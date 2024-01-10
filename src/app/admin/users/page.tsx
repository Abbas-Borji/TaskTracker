"use client";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";
import { useEffect, useState } from "react";
import Dashboard from "../common/components/Dashboard";
import DashboardSkeleton from "../common/components/DashboardSkeleton";
import ActionButtons from "./components/ActionButtons";
import Notification from "@/app/common/components/Notification";
import Modal from "@/app/common/components/Modal";
import UserModal from "@/app/common/components/UserModal";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

interface NotificationData {
  isVisible: boolean;
  title: string;
  body: string;
  type: "success" | "error"; // Assuming only two types of notifications
}

interface Department {
  id: number;
  name: string;
}

interface ProfileData {
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "MANAGER";
  Department: Department | null;
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
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [notification, setNotification] = useState<NotificationData>({
    isVisible: false,
    title: "",
    body: "",
    type: "success", // Default value, can be either 'success' or 'error'
  });
  const [isUserModalLoading, setIsUserModalLoading] = useState(false);

  // Notification state function
  const showNotification = (
    title: string,
    body: string,
    type: "success" | "error",
  ) => {
    setNotification({ isVisible: true, title, body, type });
  };

  // Initial state for updatedUserData
  const emptyUserData: ProfileData = {
    name: "",
    email: "",
    role: "USER",
    Department: null,
  };

  // Initial data for the user
  const [userData, setUserData] = useState<ProfileData>(emptyUserData);
  // List of departments
  const [departments, setDepartments] = useState<Department[]>([]);
  // User Modal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // -----------------------------------------------------------------------------------------------

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
        // Remove the deleted user from the users array
        const newUsers = users.filter((user) => user.id !== userId);
        // Update the state
        setUsers(newUsers);

        showNotification(
          "User Deleted",
          "The user was deleted successfully!",
          "success",
        );
      } else {
        const data = await response.json();
        console.log("Couldn't delete the user of ID: " + userId);
        showNotification(
          data.message || "Error Deleting User",
          "Couldn't delete the user.",
          "error",
        );
      }
    } catch (error: any) {
      console.error("An error occurred while deleting the user: ", error);
      showNotification(
        "Error",
        error.toString() || "An error occurred while deleting the user.",
        "error",
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setNotification({ ...notification, isVisible: false });
      }, 1000);
    }
  };

  // -----------------------------------------------------------------------------------------------

  // User Modal Functions
  const openUserModal = async (userId: string) => {
    setUserId(userId);
    setIsUserModalLoading(true);
    setIsUserModalOpen(true);
    try {
      await fetchDepartments();
      await fetchUserDetails(userId);
    } catch (error) {
      console.error("Error in opening modal:", error);
    } finally {
      setIsUserModalLoading(false); // End loading
    }
  };
  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setUserId("");
  };
  // Fetch user details if userId is provided
  const fetchUserDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/users/get/${id}`);
      const data: ProfileData = await response.json();
      setUserData(data);
    } catch (error: any) {}
  };
  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/admin/departments");
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };
  // Handle user data update
  const handleUpdate = async () => {
    setIsLoading(true);
    closeUserModal();
    try {
      const response = await fetch(`/api/admin/users/update/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const data = await response.json();
        showNotification(
          data.message || "Error Updating User",
          "Couldn't update the user.",
          "error",
        );
        setTimeout(() => {
          setNotification({ ...notification, isVisible: false });
        }, 1000);
        setIsLoading(false);
        throw new Error(data.message || "Failed to update user.");
      }

      // Update the user in the local state
      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          if (user.id === userId) {
            // Assuming userData.Department can be null and you want to map it to departmentName
            const updatedUserDepartmentName = userData.Department
              ? userData.Department.name
              : null;

            return {
              ...user,
              ...userData,
              departmentName: updatedUserDepartmentName,
              // Ensure all other User properties are appropriately mapped
            };
          }
          return user;
        });
      });

      // Handle success
      showNotification(
        "User Updated",
        "The user was updated successfully.",
        "success",
      );
      setTimeout(() => {
        setNotification({ ...notification, isVisible: false });
      }, 1000);
      setIsLoading(false);
      closeUserModal();
    } catch (error: any) {
      showNotification(
        "Error",
        error.toString() || "An error occurred while updating the user.",
        "error",
      );
      setTimeout(() => {
        setNotification({ ...notification, isVisible: false });
      }, 1000);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    closeUserModal();
    // Resetting all the state variables to their initial states
    setTimeout(() => {
      setUserData({
        name: "",
        email: "",
        role: "USER",
        Department: null,
      });
      setNotification({ ...notification, isVisible: false });
      setIsLoading(false);
    }, 500);
  };

  // -----------------------------------------------------------------------------------------------

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
      {notification.isVisible && (
        <Notification
          title={notification.title}
          body={notification.body}
          icon={
            notification.type === "error" ? (
              <ExclamationTriangleIcon className="text-red-600" />
            ) : (
              <CheckCircleIcon className="text-green-600" />
            )
          }
          show={notification.isVisible}
          setShow={() => setNotification({ ...notification, isVisible: false })}
        />
      )}
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
        open={isUserModalOpen}
        departments={departments}
        userData={userData}
        setUserData={setUserData}
        handleUpdate={handleUpdate}
        handleClose={handleClose}
        isUserModalLoading={isUserModalLoading}
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
