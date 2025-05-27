import { betterAuth } from "better-auth";
import { reactStartCookies } from "better-auth/react-start";
import { emailOTP, organization } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { member } from "./db/auth";
import { sendEmail } from "./email";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	plugins: [
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				await sendEmail({
					to: [email],
					subject: "One-time password for Nuonn",
					content: (
						<div>
							<p>
								Here is your one-time password to verify your
								email address.
							</p>
							<p>{otp}</p>
						</div>
					),
				});
				console.log(email, otp, type);
				// Implement the sendVerificationOTP method to send the OTP to the user's email address
			},
		}),
		organization(),
		reactStartCookies(),
	],
	databaseHooks: {
		session: {
			create: {
				before: async (session) => {
					const firstMember = await db.query.member.findFirst({
						where: eq(member.userId, session.userId),
					});
					return {
						data: {
							...session,
							activeOrganizationId: firstMember?.organizationId,
						},
					};
				},
			},
		},
	},
});
