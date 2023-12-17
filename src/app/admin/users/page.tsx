"use client";
import React, { useState, useEffect } from "react";
import Dashboard from "../common/components/Dashboard";
import Button from "@/app/common/components/Button";
import ActionButtons from "./components/ActionButtons";

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
  actions: React.ReactNode;
}

const UsersTable = () => {
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
      columns={columns}
      data={users}
      actionButton={
        <Button
          text="Add User"
          className="ml-auto bg-primary text-white hover:bg-indigo-400 focus-visible:outline-indigo-500"
          onClick={() => console.log("User created!")}
        />
      }
    />
  );
};

export default UsersTable;
