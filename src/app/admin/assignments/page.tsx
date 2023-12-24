"use client";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";
import { useEffect, useState } from "react";
import DashboardSkeleton from "../common/components/DashboardSkeleton";
import Dashboard from "../common/components/Dashboard";
import ActionButtons from "./components/ActionButtons";

const columns = [
  { title: "ID", dataKey: "id", sortable: true },
  { title: "Checklist", dataKey: "checklistName", sortable: true },
  { title: "Employee", dataKey: "employee", sortable: true },
  { title: "Manager", dataKey: "manager", sortable: true },
  { title: "Due Date", dataKey: "dueDate", sortable: true },
  { title: "Actions", dataKey: "actions", render: ActionButtons },
  // Add more columns if needed
];

interface User {
  id?: string;
  name: string;
}

interface responseAssignment {
  id: number;
  dueDate: string;
  employee: User;
  checklist: {
    id: number;
    name: string;
    manager: User;
  };
}

interface Assignment {
  id: number;
  checklistName: string;
  checklistId: number;
  employee: string;
  manager: string;
  dueDate: string;
}

const AssignmentsTable = () => {
  AllowOnlyAdmin();
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchChecklists = async () => {
      try {
        const response = await fetch(`/api/admin/assignments`);
        if (!response.ok) {
          setIsLoading(false);
          throw new Error("Network response was not ok");
        }
        const assignments: responseAssignment[] = await response.json();
        const reshapedAssignments: Assignment[] = assignments.map(
          (assignment) => ({
            id: assignment.id,
            checklistName: assignment.checklist.name,
            checklistId: assignment.checklist.id,
            employee: assignment.employee.name,
            manager: assignment.checklist.manager.name,
            dueDate: assignment.dueDate,
          }),
        );

        setAssignments(reshapedAssignments);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching assignments:", error);
      }
    };

    fetchChecklists();
  }, []);

  return (
    <>
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <Dashboard
          description="A list of all the assignments and related details."
          columns={columns}
          data={assignments}
        />
      )}
    </>
  );
};

export default AssignmentsTable;
