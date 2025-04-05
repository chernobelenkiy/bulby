import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { AuthService } from "@/lib/auth-service";
import { AuthDataValidator } from "@/lib/telegram-auth";
import { ITelegramUser } from "@/components/auth/TelegramLoginButton";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "telegram-login",
      name: "Telegram Login",
      credentials: {},
      async authorize(credentials) {
        try {
          const telegramData = credentials as unknown as ITelegramUser;

          if (!telegramData?.id || !telegramData?.first_name || !telegramData?.hash) {
            console.error("Missing required Telegram data");
            return null;
          }

          // Validate the Telegram data
          const validator = new AuthDataValidator({
            botToken: process.env.TELEGRAM_BOT_TOKEN as string,
          });

          const authData = new Map<string, string | number | undefined>([
            ["id", telegramData.id],
            ["first_name", telegramData.first_name],
            ["last_name", telegramData.last_name],
            ["username", telegramData.username],
            ["photo_url", telegramData.photo_url],
            ["auth_date", telegramData.auth_date],
            ["hash", telegramData.hash],
          ]);

          try {
            // Skip validation in development environment to make testing easier
            if (process.env.NODE_ENV !== "development") {
              await validator.validate(authData);
            }
            
            // Create or update the user
            const user = await AuthService.createOrUpdateTelegramUser(telegramData);
            
            // Return user for session
            return {
              id: user.id,
              name: user.name,
              image: user.image,
            };
          } catch (error) {
            console.error("Telegram validation error:", error);
            return null;
          }
        } catch (error) {
          console.error("Error in Telegram login:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin", // Redirect error to sign in page
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
}; 