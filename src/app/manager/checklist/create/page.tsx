'use client';
import React from "react";
import ChecklistForm from "@/app/common/components/ChecklistForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ChecklistCreate = () => {
  const session = useSession();
  const userRole = session.data?.user?.role;
  const router = useRouter();
  if (userRole === "USER") {
    router.replace("/redirect");
  }
  return <ChecklistForm />;
};

export default ChecklistCreate;
