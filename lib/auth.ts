import { auth } from "@clerk/nextjs/server";

export const getCurrentUser = async () => {
  const session = await auth();
  if (!session.userId) return null;
  return session.userId;
}; 