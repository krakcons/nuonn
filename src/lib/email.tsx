import type { ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";

export const ses = new SESv2Client({
	region: "ca-central-1",
	endpoint: "https://email.ca-central-1.amazonaws.com",
	credentials: {
		accessKeyId: process.env.SES_ACCESS_KEY!,
		secretAccessKey: process.env.SES_SECRET!,
	},
});

export const fromAddress = `Nuonn <noreply@nuonn.com>`;

export async function sendEmail({
	to,
	subject,
	content,
}: {
	to: string[];
	subject: string;
	content: ReactElement;
}): Promise<void> {
	const html = renderToString(content);
	const command = new SendEmailCommand({
		FromEmailAddress: fromAddress,
		Destination: {
			ToAddresses: to,
		},
		Content: {
			Simple: {
				Subject: { Data: subject, Charset: "UTF-8" },
				Body: {
					Html: { Data: html, Charset: "UTF-8" },
				},
			},
		},
	});
	await ses.send(command);
}
