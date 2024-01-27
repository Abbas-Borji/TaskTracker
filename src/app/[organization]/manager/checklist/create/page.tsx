"use client";
import ChecklistForm from "@/app/common/components/ChecklistForm";
import AllowOnlyManager from "@/app/common/functions/ClientAllowOnlyManager";

const ChecklistCreate = () => {
  return (
    <>
      <AllowOnlyManager />
      <ChecklistForm />
    </>
  );
};

export default ChecklistCreate;
