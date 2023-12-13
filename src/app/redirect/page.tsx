"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "../loading";

interface RedirectProps {
  to?: string;
}

// The Redirect component is responsible for redirecting users based on their roles
const Redirect = ({ to }: RedirectProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  // isLoading state is used to show the Loading component until the redirection is complete
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This function fetches the user role and redirects the user to the appropriate page
    const fetchUserRoleAndRedirect = () => {
      const userRole = session!.user.role;
      switch (userRole) {
        case "ADMIN":
          router.replace("/admin/users");
          break;
        case "USER":
          router.replace("/api/user/entry");
          break;
        case "MANAGER":
          router.replace("/manager/mychecklists");
          break;
        default:
          break;
      }

      // Once the redirection is complete, set isLoading to false
      setIsLoading(false);
    };

    // If the session exists, fetch the user role and redirect
    if (session) {
      fetchUserRoleAndRedirect();
    }

    // If the session does not exist after 100ms, redirect to the login page
    const timeoutId = setTimeout(() => {
      if (!session) {
        router.replace(to ? to : "/auth/login");
      }
      setIsLoading(false);
    }, 100);

    // Clear the timeout using its ID when the component is removed from the DOM (unmounts)
    return () => {
      clearTimeout(timeoutId);
    };
  }, [session, router]);

  // If isLoading is true, render the Loading component
  if (isLoading) {
    return <Loading />;
  }

  return <></>;
};

export default Redirect;
