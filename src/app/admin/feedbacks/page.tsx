"use client";
import React, { useState, useEffect } from "react";
import Dashboard from "../common/components/Dashboard";
import Button from "@/app/common/components/Button";
import ActionButtons from "./components/ActionButtons";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";

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
  AllowOnlyAdmin();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const response = await fetch(`/api/admin/feedbacks`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const feedbacks: responseFeedback[] = await response.json();
        const reshapedFeedbacks: Feedback[] = feedbacks.map(
          (feedback) => ({
            id: feedback.id,
            checklistName: feedback.assignment.checklist.name,
            checklistId: feedback.assignment.checklist.id,
            employee: feedback.assignment.employee.name,
            manager: feedback.assignment.checklist.manager.name,
            createdAt: feedback.createdAt,
          }),
        );

        setFeedbacks(reshapedFeedbacks);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchChecklists();
  }, []);

  return (
    <Dashboard
      description="A list of all the users including their name, email, role, and department."
      columns={columns}
      data={feedbacks}
      actionButton={
        <Button
          text="Create Team"
          className="ml-auto bg-primary text-white hover:bg-indigo-400 focus-visible:outline-indigo-500"
          onClick={() => console.log("Feedback created!")}
        />
      }
    />
  );
};

export default FeedbacksTable;
