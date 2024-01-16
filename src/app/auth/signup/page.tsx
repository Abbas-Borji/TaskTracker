"use client";
import React, { useState, useEffect } from "react";
import Logo from "src/assets/logo.png";
import { signIn } from "next-auth/react";
import Link from "next/link";
import signUpSchema from "./schema";
import { z } from "zod";
import Loading from "@/app/loading";
import Notification from "@/app/common/components/Notification";
import SignupRedirect from "@/app/redirect/SignupRedirect";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface FormErrors {
  [key: string]: string | undefined;
}

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handlePasswordConfirmationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(event.target.value);
  };

  const validateFormData = () => {
    try {
      signUpSchema.parse({
        name,
        email,
        password,
        confirmPassword,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // ... inside your validation function
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
    e.preventDefault();
    const isValid = validateFormData();
    if (isValid) {
      handleRegister(); // Proceed with the login if valid
    } else {
      console.log("Validation errors:", errors);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      setIsLoading(false);

      if (response.status === 400) {
        // Handle error
        const errorData = await response.json();
        console.error("Error:", errorData.message);
        setServerError(errorData.message);
        setNotificationVisible(true);
        return;
      }

      if (response.status === 201) {
        // Handle success
        setServerError("");
        setNotificationVisible(true);
        signIn("credentials", {
          redirect: false,
          email: email,
          password: password,
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
    }
  };

  return (
    <>
      {isLoading ? <Loading /> : null}
      {isNotificationVisible ? (
        serverError ? (
          <Notification
            title={serverError}
            body="There was an error processing your request."
            icon={<ExclamationTriangleIcon className="text-red-600" />}
            show={isNotificationVisible}
            setShow={setNotificationVisible}
          />
        ) : (
          <Notification
            title="Welcome to TaskTracker!"
            body="You have successfully registered an account."
            icon={<CheckCircleIcon className="text-green-400" />}
            show={isNotificationVisible}
            setShow={setNotificationVisible}
          />
        )
      ) : null}
      <SignupRedirect />
      <div className="flex h-full min-h-full flex-1 flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 text-center shadow sm:rounded-lg sm:px-12">
            <div className="mx-auto mb-6 inline-flex items-center gap-4">
              <img className="h-16 w-auto" src={Logo.src} alt="Your Company" />
              <h1 className="text-4xl text-gray-700">Sign Up</h1>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="name"
                    className="block text-left text-sm font-medium leading-6 text-gray-900"
                  >
                    Full Name
                  </label>
                  {errors.name && (
                    <p className="text-sm font-medium text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name} // Connect the input to the name state
                    onChange={handleNameChange} // Update state on change
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="email"
                    className="block text-left text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  {errors.email && (
                    <p className="text-sm font-medium text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email} // Connect the input to the email state
                    onChange={handleEmailChange} // Update state on change
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  {errors.password && (
                    <p className="text-sm font-medium text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password} // Connect the input to the password state
                    onChange={handlePasswordChange} // Update state on change
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium leading-6 text-gray-900"
                  >
                    Confirm Password
                  </label>
                  {errors.confirmPassword && (
                    <p className="text-sm font-medium text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={confirmPassword}
                    onChange={handlePasswordConfirmationChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Register
                </button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className=" text-gray-900">
                  Already have an account?&nbsp;
                  <Link
                    href="/auth/login"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Login
                  </Link>
                </span>
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
                  <span className="bg-white px-6 text-gray-900">OR</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  className="mx-auto flex w-full items-center justify-center rounded-lg border-2 border-stone-300 bg-white py-2.5 text-center text-sm font-medium text-black hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/50"
                  onClick={() => signIn("google", { callbackUrl: "/redirect" })}
                >
                  <svg
                    className="mr-2 h-7 w-7"
                    xmlns="http://www.w3.org/2000/svg"
                    width="705.6"
                    height="720"
                    viewBox="0 0 186.69 190.5"
                  >
                    <path
                      fill="#4285f4"
                      d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z"
                      transform="translate(1184.583 765.171)"
                    ></path>
                    <path
                      fill="#34a853"
                      d="M-1142.714-651.791l-6.972 5.337-24.679 19.223c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"
                      transform="translate(1184.583 765.171)"
                    ></path>
                    <path
                      fill="#fbbc05"
                      d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z"
                      transform="translate(1184.583 765.171)"
                    ></path>
                    <path
                      fill="#ea4335"
                      d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z"
                      transform="translate(1184.583 765.171)"
                    ></path>
                  </svg>
                  Continue with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
