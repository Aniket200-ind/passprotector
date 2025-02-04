import Nextauth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = Nextauth({
    adapter: PrismaAdapter(prisma),
  providers: [Google],
  trustHost: true,
  secret: process.env.AUTH_SECRET,
});
