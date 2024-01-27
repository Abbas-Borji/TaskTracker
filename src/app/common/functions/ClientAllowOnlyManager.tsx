"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AllowOnlyManager = () => {
  const session = useSession();
  const userRole = session.data?.user.currentOrganization.role;
  const router = useRouter();
  if (userRole === "ADMIN" || userRole === "USER") {
    router.replace("/redirect");
  }
  return <></>;
};

export default AllowOnlyManager;
