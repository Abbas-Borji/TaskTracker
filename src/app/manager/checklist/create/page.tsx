"use client";
import React from "react";
import ChecklistForm from "@/app/common/components/ChecklistForm";
import AllowOnlyManager from "@/app/common/functions/ClientAllowOnlyManager";

const ChecklistCreate = () => {
  AllowOnlyManager();
  return <ChecklistForm />;
};

export default ChecklistCreate;
