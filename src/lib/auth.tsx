import { betterAuth } from "better-auth";
import { reactStartCookies } from "better-auth/react-start";
import { emailOTP } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	plugins: [
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				console.log(email, otp, type);
				// Implement the sendVerificationOTP method to send the OTP to the user's email address
			},
		}),
		reactStartCookies(),
	],
});
