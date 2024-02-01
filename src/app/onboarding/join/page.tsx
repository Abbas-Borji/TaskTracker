"use client";
import React, { useState } from "react";
import Link from "next/link";
import Logo from "src/assets/logo.png";
import Redirect from "@/app/redirect/page";
import { signIn } from "next-auth/react";
import signInSchema from "./schema";
import { z } from "zod";
import Loading from "@/app/loading";
import Notification from "@/app/common/components/Notification";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import ThreeCardContainer from "@/app/common/components/ThreeCardContainer";
import { Invitation } from "@/app/common/types/Invitation";
import InvitationCard from "./components/InvitationCard";

interface FormErrors {
  [key: string]: string | undefined;
}

const JoinOrganization = () => {
  const invitations: Invitation[] = [
    {
      id: 1,
      status: "ACCEPTED",
      organization: {
        name: "ABC Company",
      },
    },
    {
      id: 2,
      status: "PENDING",
      organization: {
        name: "XYZ Corporation",
      },
    },
    // Add more invitations here...
  ];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const validateFormData = () => {
    try {
      signInSchema.parse({
        email,
        password,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const key = err.path[0];
          if (typeof key === "string") {
            newErrors[key] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const isValid = validateFormData();
    if (isValid) {
      handleLogin(); // Proceed with the login if valid
    } else {
      setIsLoading(false);
      console.log("Validation errors:", errors);
    }
  };

  const handleLogin = async () => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });
      if (result?.error) {
        setServerError(result.error);
        setNotificationVisible(true);
      }
    } catch (error) {
      console.log("Error:", error);
    }
    setIsLoading(false);
  };

  return (
    <>
      {isNotificationVisible ? (
        <Notification
          title={serverError}
          icon={<ExclamationTriangleIcon className="text-red-600" />}
          show={isNotificationVisible}
          setShow={setNotificationVisible}
        />
      ) : null}
      {/* <Redirect /> */}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex h-full min-h-full flex-1 flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-12 text-center shadow sm:rounded-lg sm:px-12">
              <div className="mx-auto mb-6 inline-flex items-center gap-4">
                <img
                  className="h-16 w-auto"
                  src={Logo.src}
                  alt="Your Company"
                />
                <h1 className="text-4xl text-gray-700">Organizations</h1>
              </div>
              <ThreeCardContainer
                title="Pending Invitations"
                items={invitations}
                renderItem={(item, index) =>
                  isLoading ? (
                    <div>Loading...</div>
                  ) : (
                    <InvitationCard
                      invitation={item}
                      key={index}
                      handleClick={() => console.log("Clicked")}
                    />
                  )
                }
              />

              <div>
                <div className="relative mt-8">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-white px-6 text-sm text-gray-900">
                      OR
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href="/onboarding/create"
                    className="mx-auto flex w-full items-center justify-center rounded-lg border-2 border-stone-300 bg-white py-2.5 text-center text-sm font-medium text-black hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/50"
                  >
                    Create Organization
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JoinOrganization;
