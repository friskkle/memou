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
      await sendEmail({
        to: data.user.email,
        subject: "Memou - Reset your password",
        text: `Click the link to reset your password: ${data.url}`,
      });
    }
  },
  plugins: [nextCookies()],
  session: {
    expiresIn: 60 * 60 * 24,
    disableSessionRefresh: true
  }
});
