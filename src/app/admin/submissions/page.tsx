"use client";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";
import { useEffect, useState } from "react";
import Dashboard from "../common/components/Dashboard";
import DashboardSkeleton from "../common/components/DashboardSkeleton";
import ActionButtons from "./components/ActionButtons";

const columns = [
  { title: "ID", dataKey: "id", sortable: true },
  { title: "Checklist", dataKey: "checklistName", sortable: true },
  { title: "Employee", dataKey: "employee", sortable: true },
  { title: "Manager", dataKey: "manager", sortable: true },
  { title: "Date", dataKey: "createdAt", sortable: true },
  { title: "Status", dataKey: "status", sortable: true },
  { title: "Actions", dataKey: "actions", render: ActionButtons },
  // Add more columns if needed
];

interface User {
  id?: string;
  name: string;
}

interface responseSubmission {
  id: number;
  createdAt: string;
  user: User;
  status: string;
  assignment: {
    checklist: {
      id: number;
      name: string;
      manager: User;
    };
  };
}

interface Submission {
  id: number;
  checklistName: string;
  checklistId: number;
  employee: string;
  manager: string;
  createdAt: string;
  status: string;
}

const SubmissionsTable = () => {
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchChecklists = async () => {
      try {
        const response = await fetch(`/api/admin/submissions`);
        if (!response.ok) {
          setIsLoading(false);
          throw new Error("Network response was not ok");
        }
        const submissions: responseSubmission[] = await response.json();
        const reshapedSubmissions: Submission[] = submissions.map(
          (submission) => ({
            id: submission.id,
            checklistName: submission.assignment.checklist.name,
            checklistId: submission.assignment.checklist.id,
            employee: submission.user.name,
            manager: submission.assignment.checklist.manager.name,
            createdAt: submission.createdAt,
            status: submission.status,
          }),
        );

        setSubmissions(reshapedSubmissions);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching submissions:", error);
      }
    };

    fetchChecklists();
  }, []);

  return (
    <>
      <AllowOnlyAdmin />
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <Dashboard
          description="A list of all the submissions and related details."
          columns={columns}
          data={submissions}
        />
      )}
    </>
  );
};

export default SubmissionsTable;
