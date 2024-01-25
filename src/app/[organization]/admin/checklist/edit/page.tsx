"use client";
import ChecklistForm from "@/app/common/components/ChecklistForm";
import FormSkeleton from "@/app/common/components/FormSkeleton";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";
import { Checklist } from "@/app/common/types/CreateOrEditChecklist";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ChecklistEdit = () => {
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const checklistId = Number(searchParams.get("checklistId"));

  useEffect(() => {
    const fetchChecklist = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/checklist/get?checklistId=${checklistId}`,
        );
        if (response.ok) {
          const data = await response.json();
          setChecklist(data);
        } else {
          // Handle non-OK responses here
          console.error(
            "Failed to fetch checklist. HTTP status: ",
            response.status,
          );
        }
      } catch (error) {
        // Handle network errors or other exceptions here
        console.error(
          "An error occurred while fetching the checklist: ",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (checklistId) {
      fetchChecklist();
    }
  }, [checklistId]);

  return (
    <>
      <AllowOnlyAdmin />
      {isLoading ? (
        <FormSkeleton />
      ) : (
        checklist && <ChecklistForm initialChecklist={checklist} />
      )}
    </>
  );
};

export default ChecklistEdit;
