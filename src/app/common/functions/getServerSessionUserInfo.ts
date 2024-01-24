import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function getServerSessionUserInfo() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new Error("Session not found");
  }

  const userId = session.user.id;
  const currentOrganization = session.user.currentOrganization;
  const userRole = currentOrganization?.role;

  return { userId, currentOrganization, userRole };
}
