"use client";
import React, { useState } from "react";
import ChecklistForm from "@/app/common/components/ChecklistForm";
import AllowOnlyManager from "@/app/common/functions/ClientAllowOnlyManager";
import FormSkeleton from "@/app/common/components/FormSkeleton";

const ChecklistCreate = () => {
  const [isLoading, setIsLoading] = useState(true);
  AllowOnlyManager();
  return <>{isLoading ? <FormSkeleton /> : <ChecklistForm />}</>;
};

export default ChecklistCreate;
