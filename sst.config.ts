/// <reference path="./.sst/platform/config.d.ts" />

const PROFILE = "krak";
const LOCAL_STAGES = ["billyhawkes"];
const ROOT_DOMAIN = "nuonn.com";
const STAGES = ["prod", "dev", ...LOCAL_STAGES];

export default $config({
	app(input) {
		return {
			name: "nuonn",
			removal: input.stage === "prod" ? "retain" : "remove",
			home: "aws",
			providers: {
				aws: {
					region: "ca-central-1",
					profile: PROFILE,
				},
				cloudflare: true,
			},
		};
	},
	async run() {
		// STAGE VALIDATION //
		if (!STAGES.includes($app.stage)) {
			throw new Error(`Stage ${$app.stage} not found`);
		}

		const domain =
			$app.stage === "prod"
				? ROOT_DOMAIN
				: `${$app.stage}.${ROOT_DOMAIN}`;
		const emailDomain = `email.${domain}`;

		sst.aws.Vpc.get("Vpc", "vpc-08c28b23ee20f3975");
		const aurora = sst.aws.Aurora.get("Aurora", "krak-prod-auroracluster");

		const dns = sst.cloudflare.dns({
			proxy: true,
		});
		const cloudflareZone = cloudflare.getZoneOutput({
			name: ROOT_DOMAIN,
		});

		const environment = {
			OPENAI_API_KEY: new sst.Secret("OPENAI_API_KEY").value,
			DATABASE_URL: $interpolate`postgres://${aurora.username}:${aurora.password}@${aurora.host}:${aurora.port}/${$app.name}-${$app.stage}`,
			VITE_SITE_URL: LOCAL_STAGES.includes($app.stage)
				? "http://localhost:3000"
				: `https://${domain}`,
		};

		// EMAIL //
		const email = new sst.aws.Email("Email", {
			sender: domain,
			dns,
		});
		if (email) {
			new aws.ses.MailFrom("MailFrom", {
				mailFromDomain: emailDomain,
				domain,
			});
			new cloudflare.Record("MX", {
				zoneId: cloudflareZone.id,
				name: emailDomain,
				type: "MX",
				priority: 10,
				value: "feedback-smtp.ca-central-1.amazonses.com",
			});
			new cloudflare.Record("TXT", {
				zoneId: cloudflareZone.id,
				name: emailDomain,
				type: "TXT",
				value: '"v=spf1 include:amazonses.com ~all"',
			});
		}

		new sst.aws.TanStackStart("TSS", {
			link: [aurora, email],
			dev: {
				command: "bun dev",
			},
			environment,
		});

		// Dev
		new sst.x.DevCommand("Studio", {
			link: [aurora],
			dev: {
				command: "drizzle-kit studio",
			},
			environment,
		});
		new sst.x.DevCommand("EmailClient", {
			dev: {
				command: "bun email",
			},
		});
	},
});
