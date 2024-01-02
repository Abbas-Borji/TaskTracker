"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import React from "react";

interface ContainerProps {
  title: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const Container = ({ title, children, footer }: ContainerProps) => {
  const router = useRouter();
  const exit = () => {
    router.back();
  };
  return (
    <>
      <div className="relative min-h-[70px] w-full rounded-lg border border-gray-300 bg-light">
        <div className="mb-6">
          <h1 className="mt-6 text-center text-2xl font-medium max-w-[210px] sm:max-w-xs md:max-w-lg overflow-hidden overflow-ellipsis text-overflow whitespace-nowrap mx-auto">{title}</h1>
          <div className="absolute right-6 top-6">
            <button
              onClick={exit}
              className="flex items-center rounded bg-dark px-1 py-1 text-xs text-white hover:bg-orange-700"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="p-6 sm:p-16">{children}</div>
        {footer}
      </div>
    </>
  );
};

export default Container;
