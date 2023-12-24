"use client";
import React from "react";
import ChecklistForm from "@/app/common/components/ChecklistForm";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";

const ChecklistCreate = () => {
  AllowOnlyAdmin();
  return <ChecklistForm />;
};

export default ChecklistCreate;
