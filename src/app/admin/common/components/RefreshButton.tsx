"use client";
import React from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const RefreshButton = () => {
  return (
    <button
      onClick={() => window.location.reload()}
      className="flex items-center justify-center rounded-lg bg-slate-600 p-1.5 text-white hover:bg-dark"
    >
      <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
      <span className="sr-only">Refresh</span>
    </button>
  );
};

export default RefreshButton;
