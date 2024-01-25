"use client";
import ChecklistForm from "@/app/common/components/ChecklistForm";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";

const ChecklistCreate = () => {
  return (
    <>
      <AllowOnlyAdmin />
      <ChecklistForm />
    </>
  );
};

export default ChecklistCreate;
