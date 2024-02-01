"use client";
import React, { useState } from "react";
import Link from "next/link";
import Logo from "src/assets/logo.png";
import Redirect from "@/app/redirect/page";
import { signIn } from "next-auth/react";
import createOrganizationSchema from "./schema";
import { z } from "zod";
import Loading from "@/app/loading";
import Notification from "@/app/common/components/Notification";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface FormErrors {
  [key: string]: string | undefined;
}

const JoinOrganization = () => {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  

  const validateFormData = () => {
    try {
      createOrganizationSchema.parse({
        name,
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
    // try {
    //   const result = await signIn("credentials", {
    //     redirect: false,
    //     email: email,
    //     password: password,
    //   });
    //   if (result?.error) {
    //     setServerError(result.error);
    //     setNotificationVisible(true);
    //   }
    // } catch (error) {
    //   console.log("Error:", error);
    // }
    // setIsLoading(false);
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

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="email"
                      className="block text-left text-sm font-medium leading-6 text-gray-900"
                    >
                      Choose a Name
                    </label>
                    {errors.email && (
                      <p className="text-sm font-medium text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="name"
                      autoComplete="name"
                      required
                      value={name} // Connect the input to the email state
                      onChange={handleNameChange} // Update state on change
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Create Organization
                  </button>
                </div>
              </form>

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
                    href="/onboarding/join"
                    className="mx-auto flex w-full items-center justify-center rounded-lg border-2 border-stone-300 bg-white py-2.5 text-center text-sm font-medium text-black hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/50"
                  >
                    Join Organization
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
