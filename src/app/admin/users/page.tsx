"use client";
import React, { useState, useEffect } from "react";
import Dashboard from "../common/components/Dashboard";
import AdminDashboardData from "@/app/common/types/AdminDashboardData";

const columns: Array<AdminDashboardData<User>["columns"][number]> = [
  { title: "ID", dataKey: "id" },
  { title: "Name", dataKey: "name", sortable: true },
  { title: "Email", dataKey: "email" },
  { title: "Role", dataKey: "role", sortable: true },
  { title: "Department", dataKey: "department" },
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
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/admin/users`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return <Dashboard columns={columns} data={users} />;
};

export default UsersTable;

// actionButton={
//   <Button
//     text="Add User"
//     className="ml-auto bg-primary text-white hover:bg-indigo-400 focus-visible:outline-indigo-500"
//     onClick={() => console.log("User created!")}
//   />}
