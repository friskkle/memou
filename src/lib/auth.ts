import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

import { sendEmail } from "./email";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
      console.log(`User requested password reset: ${data.user.email} ${request}`)
      await sendEmail({
        to: data.user.email,
        subject: "Memou - Reset your password",
        text: `Click the link to reset your password: ${data.url}`,
      });
    },
    async onPasswordReset({ user }, request) {
      // your logic here
      console.log(`Password for user ${user.email} has been reset. ${request}`);
    },
  },
  plugins: [nextCookies()],
  session: {
    expiresIn: 60 * 60 * 24,
    disableSessionRefresh: true
  }
});
