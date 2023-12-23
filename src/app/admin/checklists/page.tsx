"use client";
import React, { useState, useEffect } from "react";
import Dashboard from "../common/components/Dashboard";
import Button from "@/app/common/components/Button";
import ActionButtons from "./components/ActionButtons";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";

const columns = [
  { title: "ID", dataKey: "id", sortable: true },
  { title: "Name", dataKey: "name", sortable: true },
  { title: "Manager", dataKey: "manager", sortable: true },
  { title: "Total Questions", dataKey: "totalQuestions", sortable: true },
  { title: "Actions", dataKey: "actions", render: ActionButtons },
  // Add more columns if needed
];

interface User {
  id?: string;
  name: string;
}

interface responseChecklist {
  id: number;
  name: string;
  manager: User;
  totalQuestions: number;
  questions: { id: number }[];
}

interface Checklist {
  id: number;
  name: string;
  manager: string;
  totalQuestions: number;
}

const ChecklistsTable = () => {
  AllowOnlyAdmin();
  const [checklists, setChecklists] = useState<Checklist[]>([]);

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const response = await fetch(`/api/admin/checklists`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const checklists: responseChecklist[] = await response.json();
        const reshapedChecklists: Checklist[] = checklists.map((checklist) => ({
          id: checklist.id,
          name: checklist.name,
          manager: checklist.manager.name,
          totalQuestions: checklist.totalQuestions,
        }));

        setChecklists(reshapedChecklists);
      } catch (error) {
        console.error("Error fetching checklists:", error);
      }
    };

    fetchChecklists();
  }, []);

  return (
    <Dashboard
      description="A list of all the checklists and related details."
      columns={columns}
      data={checklists}
    />
  );
};

export default ChecklistsTable;
