import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export default async function serverSession() {
  const session = await getServerSession(authOptions);
  return session;
}
