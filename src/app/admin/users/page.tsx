"use client";
import React, { useState, useEffect } from "react";
import Dashboard from "../common/components/Dashboard";
import Button from "@/app/common/components/Button";
import ActionButtons from "./components/ActionButtons";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";

const columns = [
  { title: "ID", dataKey: "counter", sortable: true },
  { title: "Name", dataKey: "name", sortable: true },
  { title: "Email", dataKey: "email" },
  { title: "Role", dataKey: "role", sortable: true },
  { title: "Department", dataKey: "department" },
  { title: "Actions", dataKey: "actions", render: ActionButtons },
  // Add more columns if needed
];

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string | null;
}

const UsersTable = () => {
  AllowOnlyAdmin();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/admin/users`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const users: User[] = await response.json();
        // Add a counter to each user
        const usersWithCounter = users.map((user, index) => ({
          ...user,
          counter: index + 1,
        }));
        setUsers(usersWithCounter);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Dashboard
      description="A list of all the users including their names, emails, roles, and departments."
      columns={columns}
      data={users}
    />
  );
};

export default UsersTable;
