"use client";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";
import { useEffect, useState } from "react";
import Dashboard from "../common/components/Dashboard";
import DashboardSkeleton from "../common/components/DashboardSkeleton";
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
}

const UsersTable = () => {
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/admin/users`);
        if (!response.ok) {
          setIsLoading(false);
          throw new Error("Network response was not ok");
        }
        const users: User[] = await response.json();
        // Add a counter to each user
        const usersWithCounter = users.map((user, index) => ({
          ...user,
          counter: index + 1,
        }));
        setUsers(usersWithCounter);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <AllowOnlyAdmin />
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <Dashboard
          description="A list of all the users including their names, emails, roles, and departments."
          columns={columns}
          data={users}
        />
      )}
    </>
  );
};

export default UsersTable;
