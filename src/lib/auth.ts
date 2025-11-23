import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
      console.log("Reset password requested for:", data.user.email, request);
    }
  },
  plugins: [nextCookies()],
  session: {
    expiresIn: 60 * 60 * 24,
    disableSessionRefresh: true
  }
});
