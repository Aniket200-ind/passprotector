import Nextauth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";




export const { handlers, signIn, signOut, auth } = Nextauth({
    adapter: PrismaAdapter(prisma),
  providers: [Google],
  trustHost: true,
  secret: process.env.AUTH_SECRET,
});
