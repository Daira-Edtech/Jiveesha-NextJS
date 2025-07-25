import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client lazily to avoid initialization issues
const getPrismaClient = () => {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  return global.prisma;
};

export const auth = betterAuth({
  database: prismaAdapter(getPrismaClient(), {
    provider: "sqlserver",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://jiveesha-next-js-deploy.vercel.app",
    "https://jiveesha-nextjs.onrender.com/",
    "https://jiveesha-nextjs-wqr8.onrender.com",
    "https://jiveesha-nextjs-k0cu.onrender.com",
  ],
  //   socialProviders: {
  //     github: {
  //       clientId: process.env.GITHUB_CLIENT_ID,
  //       clientSecret: process.env.GITHUB_CLIENT_SECRET,
  //     },
  //   },
});
