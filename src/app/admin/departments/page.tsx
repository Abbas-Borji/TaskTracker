"use client";
import Button from "@/app/common/components/Button";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";
import { useEffect, useState } from "react";
import Dashboard from "../common/components/Dashboard";
import DashboardSkeleton from "../common/components/DashboardSkeleton";
import ActionButtons from "./components/ActionButtons";
import DepartmentModal, {
  ComboBoxItem,
} from "@/app/common/components/DepartmentModal";
import Modal from "@/app/common/components/Modal";
import Notification from "@/app/common/components/Notification";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

interface User {
  id: string;
  name: string | null;
}

interface responseDepartment {
  id: number;
  name: string;
  totalMembers: number;
  users: User[];
}

interface Department {
  id: number;
  name: string;
  totalMembers: number;
  members: string;
}

const DepartmentsTable = () => {
  const columns = [
    { title: "ID", dataKey: "id", sortable: true },
    { title: "Name", dataKey: "name", sortable: true },
    { title: "Total", dataKey: "totalMembers", sortable: true },
    { title: "Members", dataKey: "members" },
    {
      title: "Actions",
      dataKey: "actions",
      render: (rowData: ComboBoxItem) => (
        <ActionButtons
          departmentId={Number(rowData.id)}
          onEdit={() => console.log("Edit Department")}
          onDelete={handleDelete}
        />
      ),
    },
    // Add more columns if needed
  ];

  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [departments, setDepartments] = useState<Department[]>([]);
  // const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departmentId, setDepartmentId] = useState<number>(0);
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  // // Department Modal Functions
  // const closeDepartmentModal = () => {
  //   setIsDepartmentModalOpen(false);
  //   setTimeout(() => {
  //     setDepartmentId(0);
  //   }, 1000);
  // };

  // const openDepartmentModal = (departmentId: number) => {
  //   setDepartmentId(departmentId);
  //   setIsDepartmentModalOpen(true);
  // };

  // Delete Modal Functions
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setIsDeleteModalOpen(true);
    setDepartmentId(id);
  };

  const confirmDeleteModal = async () => {
    closeDeleteModal();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/department/delete/${departmentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotificationVisible(true);
        setTimeout(() => {
          setNotificationVisible(false);
          setIsLoading(false);
        }, 1000);
        // Remove the deleted department from the departments array
        const newDepartments = departments.filter(
          (department) => department.id !== departmentId,
        );
        // Update the state
        setDepartments(newDepartments);
      } else {
        console.log("Couldn't delete the department of ID: " + departmentId);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("An error occurred while deleting the department: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`/api/admin/departments`);
        if (!response.ok) {
          setIsLoading(false);
          throw new Error("Network response was not ok");
        }
        const departments: responseDepartment[] = await response.json();
        const reshapedDepartments: Department[] = departments.map(
          (department) => ({
            id: department.id,
            name: department.name,
            totalMembers: department.totalMembers,
            members: department.users.map((user) => user.name).join(" | "),
          }),
        );

        setDepartments(reshapedDepartments);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <>
      <AllowOnlyAdmin />
      {isNotificationVisible ? (
        <Notification
          title="Department Deleted"
          body="The department was deleted successfully!"
          icon={<CheckCircleIcon className="text-green-600" />}
          show={isNotificationVisible}
          setShow={setNotificationVisible}
        />
      ) : null}
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <Dashboard
          description="A list of all the departments and their related details."
          columns={columns}
          data={departments}
          actionButton={
            <Button
              text="Create Department"
              className="ml-auto bg-primary text-white hover:bg-indigo-400 focus-visible:outline-indigo-500"
              onClick={() => console.log("Create Department")}
            />
          }
        />
      )}
      {/* <DepartmentModal
        {...(departmentId ? { departmentId } : {})}
        open={isDepartmentModalOpen}
        onClose={closeDeleteModal}
      /> */}
      <Modal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirm Delete"
        message="Are you sure you want to delete this department?"
        confirmButtonText="Yes"
        cancelButtonText="No, keep it"
        onConfirm={confirmDeleteModal}
      />
    </>
  );
};

export default DepartmentsTable;
