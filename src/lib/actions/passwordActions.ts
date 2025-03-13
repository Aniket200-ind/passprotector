//! src/lib/actions/passwordActions.ts

"use server"

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { PasswordCategory } from "@prisma/client";

export async function getUserPasswordStats() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) return null;

  const categoryData = await prisma.password.groupBy({
    by: ["category"],
    where: { userId: user.id },
    _count: true,
  });

  const strengthData = await prisma.password.groupBy({
    by: ["strength"],
    where: { userId: user.id },
    _count: true,
  });

  const totalWeakPasswords = await prisma.password.count({
    where: { userId: user.id, strength: "Weak" },
  });

  const totalStrongPasswords = await prisma.password.count({
    where: { userId: user.id, strength: "Strong" },
  });

  const totalCategories = Object.keys(PasswordCategory).length;

  const totalPasswords = await prisma.password.count({
    where: { userId: user.id },
  });

  return {
    categoryData,
    strengthData,
    totalPasswords,
    totalWeakPasswords,
    totalStrongPasswords,
    totalCategories,
  };
}
