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
  { title: "Actions", dataKey: "actions", render: ActionButtons },
  // Add more columns if needed
];

interface User {
  id?: string;
  name: string;
}

interface responseFeedback {
  id: number;
  createdAt: string;
  assignment: {
    employee: User;
    checklist: {
      id: number;
      name: string;
      manager: User;
    };
  };
}

interface Feedback {
  id: number;
  checklistName: string;
  checklistId: number;
  employee: string;
  manager: string;
  createdAt: string;
}

const FeedbacksTable = () => {
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchChecklists = async () => {
      try {
        const response = await fetch(`/api/admin/feedbacks`);
        if (!response.ok) {
          setIsLoading(false);
          throw new Error("Network response was not ok");
        }
        const feedbacks: responseFeedback[] = await response.json();
        const reshapedFeedbacks: Feedback[] = feedbacks.map((feedback) => ({
          id: feedback.id,
          checklistName: feedback.assignment.checklist.name,
          checklistId: feedback.assignment.checklist.id,
          employee: feedback.assignment.employee.name,
          manager: feedback.assignment.checklist.manager.name,
          createdAt: feedback.createdAt,
        }));

        setFeedbacks(reshapedFeedbacks);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching feedbacks:", error);
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
          description="A list of all the feedbacks and related details."
          columns={columns}
          data={feedbacks}
        />
      )}
    </>
  );
};

export default FeedbacksTable;
