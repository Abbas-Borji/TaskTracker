"use client";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";
import { useEffect, useState } from "react";
import Dashboard from "../common/components/Dashboard";
import DashboardSkeleton from "../common/components/DashboardSkeleton";
import ActionButtons from "./components/ActionButtons";
import Notification from "@/app/common/components/Notification";
import Modal from "@/app/common/components/Modal";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import UserModal from "@/app/common/components/UserModal";

interface Department {
  id: number;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  departmentName: string | null;
  department: Department | null;
}

const UsersTable = () => {
  const columns = [
    { title: "ID", dataKey: "counter", sortable: true },
    { title: "Name", dataKey: "name", sortable: true },
    { title: "Email", dataKey: "email" },
    { title: "Role", dataKey: "role", sortable: true },
    { title: "Department", dataKey: "departmentName" },
    {
      title: "Actions",
      dataKey: "actions",
      render: (rowData: User) => (
        <ActionButtons
          userId={rowData.id}
          onEdit={openUserModal}
          onDelete={handleDelete}
        />
      ),
    },
  ];
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [users, setUsers] = useState<User[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  // Delete Modal Functions
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setIsDeleteModalOpen(true);
    setUserId(id);
  };

  const confirmDeleteModal = async () => {
    closeDeleteModal();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/profile/delete/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotificationVisible(true);
        setTimeout(() => {
          setNotificationVisible(false);
          setIsLoading(false);
        }, 1000);
        // Remove the deleted user from the users array
        const newUsers = users.filter((user) => user.id !== userId);
        // Update the state
        setUsers(newUsers);
      } else {
        console.log("Couldn't delete the user of ID: " + userId);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("An error occurred while deleting the user: ", error);
      setIsLoading(false);
    }
  };

  // User Modal Functions
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const openUserModal = (userId: string) => {
    setUserId(userId);
    setIsUserModalOpen(true);
  };
  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setTimeout(() => {
      setUserId("");
      window.location.reload();
    }, 1000);
  };

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
      {isNotificationVisible ? (
        <Notification
          title="User Deleted"
          body="The user was deleted successfully!"
          icon={<CheckCircleIcon className="text-green-600" />}
          show={isNotificationVisible}
          setShow={setNotificationVisible}
        />
      ) : null}
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <Dashboard
          description="A list of all the users including their names, emails, roles, and departments."
          columns={columns}
          data={users}
        />
      )}
      <UserModal
        {...(userId ? { userId } : {})}
        open={isUserModalOpen}
        onClose={closeUserModal}
      />
      <Modal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirm Delete"
        message="Are you sure you want to delete this user?"
        confirmButtonText="Yes"
        cancelButtonText="No, keep it"
        onConfirm={confirmDeleteModal}
      />
    </>
  );
};

export default UsersTable;
