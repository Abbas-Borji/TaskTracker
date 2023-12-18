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
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const response = await fetch(`/api/admin/assignments`);
        if (!response.ok) {
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
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchChecklists();
  }, []);

  return (
    <Dashboard
      description="A list of all the users including their name, email, role, and department."
      columns={columns}
      data={assignments}
      actionButton={
        <Button
          text="Create Team"
          className="ml-auto bg-primary text-white hover:bg-indigo-400 focus-visible:outline-indigo-500"
          onClick={() => console.log("Assignment created!")}
        />
      }
    />
  );
};

export default AssignmentsTable;