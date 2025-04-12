import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { AuthService } from "@/lib/auth-service";
import { AuthDataValidator } from "@/lib/telegram";
import { ITelegramUser } from "@/types/telegram";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "telegram-login",
      name: "Telegram Login",
      credentials: {},
      async authorize(credentials) {
        try {
          console.log("🔑 NextAuth: authorize method called with credentials", credentials);
          const telegramData = credentials as unknown as ITelegramUser;
          console.log("🔑 Telegram data received in authorize:", telegramData);

          if (!telegramData?.id || !telegramData?.first_name) {
            console.error("🔑 Missing required Telegram data (id or first_name)");
            return null;
          }

          // Check if this is from WebApp - marked with special hash
          const isFromWebApp = telegramData.hash === 'webapp-no-hash' || !telegramData.hash;
          
          if (isFromWebApp) {
            console.log("🔑 Data is from WebApp, proceeding without validation");
            
            // Skip validation entirely for WebApp
            console.log("🔑 Creating/updating user with Telegram data");
            
            try {
              const user = await AuthService.createOrUpdateTelegramUser(telegramData);
              console.log("🔑 User created/updated successfully:", user.id);
              
              // Return user for session
              return {
                id: user.id,
                name: user.name,
                image: user.image,
              };
            } catch (error) {
              console.error("🔑 Error creating/updating user:", error);
              return null;
            }
          }

          // For regular Telegram Login Widget flow, validate the hash
          console.log("🔑 Regular Telegram Login flow - validating data");
          
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
            // Skip validation in development environment
            if (process.env.NODE_ENV !== "development") {
              console.log("🔑 Validating Telegram data hash");
              await validator.validate(authData);
              console.log("🔑 Telegram data validation successful");
            } else {
              console.log("🔑 Skipping Telegram data validation in development mode");
            }
            
            // Create or update the user
            console.log("🔑 Creating/updating user with Telegram data");
            const user = await AuthService.createOrUpdateTelegramUser(telegramData);
            console.log("🔑 User created/updated successfully:", user.id);
            
            // Return user for session
            return {
              id: user.id,
              name: user.name,
              image: user.image,
            };
          } catch (error) {
            console.error("🔑 Telegram validation error:", error);
            return null;
          }
        } catch (error) {
          console.error("🔑 Error in Telegram login:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error(`🔑 NextAuth Error [${code}]:`, metadata);
    },
    warn(code) {
      console.warn(`🔑 NextAuth Warning [${code}]`);
    },
    debug(code, metadata) {
      console.log(`🔑 NextAuth Debug [${code}]:`, metadata);
    },
  },
  callbacks: {
    async session({ session, token }) {
      console.log("🔑 Session callback with token:", token);
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        console.log("🔑 JWT callback with user:", user);
      }
      return token;
    }
  },
}; 