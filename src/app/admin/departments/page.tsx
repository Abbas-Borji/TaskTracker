"use client";
import Button from "@/app/common/components/Button";
import DepartmentModal from "@/app/common/components/DepartmentModal";
import Modal from "@/app/common/components/Modal";
import Notification from "@/app/common/components/Notification";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Dashboard from "../common/components/Dashboard";
import DashboardSkeleton from "../common/components/DashboardSkeleton";
import ActionButtons from "./components/ActionButtons";

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

interface EmployeesResponse {
  employees: ComboBoxItem[];
}

interface DepartmentData {
  name: string;
  members: ComboBoxItem[];
}

export interface ComboBoxItem {
  id: number | string;
  name: string;
}

interface NotificationData {
  isVisible: boolean;
  title: string;
  body: string;
  type: "success" | "error"; // Assuming only two types of notifications
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
          onEdit={openDepartmentModal}
          onDelete={handleDelete}
        />
      ),
    },
    // Add more columns if needed
  ];

  // -----------------------------------------------------------------------------------------
  // Variables and States

  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState<number>(0);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employees, setEmployees] = useState<ComboBoxItem[]>([]);
  const [departmentName, setDepartmentName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<ComboBoxItem[]>([]);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState(false);
  const isDepartmentProvided = departmentId ? true : false;

  // Notification state variables
  const [notification, setNotification] = useState<NotificationData>({
    isVisible: false,
    title: "",
    body: "",
    type: "success", // Default value, can be either 'success' or 'error'
  });
  // Notification state function
  const showNotification = (
    title: string,
    body: string,
    type: "success" | "error",
  ) => {
    setNotification({ isVisible: true, title, body, type });
    setTimeout(() => {
      setNotification({
        isVisible: false,
        title: "",
        body: "",
        type: "success",
      });
    }, 1000);
  };

  // -----------------------------------------------------------------------------------------
  // Create/Edit Department Modal Functions

  // Fetch all employees if departmentId is not provided
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsEmployeeLoading(true);
      try {
        const response = await fetch("/api/employees/get");
        const data: EmployeesResponse = await response.json();
        setEmployees(data.employees);
        setIsEmployeeLoading(false);
      } catch (error: any) {
        console.log("Error fetching employees: ", error);
        setIsEmployeeLoading(false);
      }
    };
    if (!isDepartmentProvided) {
      fetchEmployees();
    }
  }, [isDepartmentProvided]);

  // Open department modal in edit mode when edit button is clicked
  const openDepartmentModal = async (departmentId: number) => {
    setDepartmentId(departmentId);
    setIsDepartmentModalOpen(true);
    await fetchDepartmentDetails(departmentId);
  };

  // Fetch department details function
  const fetchDepartmentDetails = async (id: number) => {
    setIsEmployeeLoading(true);
    try {
      const response = await fetch(`/api/department/get/${id}`);
      const data: DepartmentData = await response.json();
      setDepartmentName(data.name);
      setSelectedMembers(data.members);
      setIsEmployeeLoading(false);
    } catch (error: any) {
      // Show error notification
      showNotification(
        "Fetching Department Error",
        "Failed to fetch department data",
        "error",
      );
    }
  };

  // Department creation function
  const handleCreate = async () => {
    setIsDepartmentModalOpen(false);
    setIsLoading(true);
    if (departmentName === "" || selectedMembers.length === 0) {
      showNotification(
        "Creating Department Error",
        "Please type a name and select the members.",
        "error",
      );
      setIsLoading(false);
      return;
    }

    const departmentData: DepartmentData = {
      name: departmentName,
      members: selectedMembers,
    };

    try {
      const response = await fetch("/api/department/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(departmentData),
      });

      if (!response.ok) {
        const data = await response.json();
        showNotification(
          "Creating Department Error",
          data.message || "Failed to create department.",
          "error",
        );
        setIsLoading(false);
        return;
      }

      // Handle success
      await fetchDepartments();
      showNotification(
        "Department Created",
        "Department created successfully.",
        "success",
      );
      setIsLoading(false);
    } catch (error: any) {
      showNotification(
        "Creating Department Error",
        error.message || "Failed to create department.",
        "error",
      );
      setIsLoading(false);
    }
  };

  // Department update function
  const handleUpdate = async () => {
    setIsDepartmentModalOpen(false);
    setIsLoading(true);

    if (departmentName === "" || selectedMembers.length === 0) {
      showNotification(
        "Updating Department Error",
        "Please type a name and select the members.",
        "error",
      );
      setIsLoading(false);
      return;
    }

    const departmentData: DepartmentData = {
      name: departmentName,
      members: selectedMembers,
    };

    try {
      const response = await fetch("/api/department/update/" + departmentId, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(departmentData),
      });

      if (!response.ok) {
        const data = await response.json();
        showNotification(
          "Updating Department Error",
          data.message || "Failed to update department.",
          "error",
        );
        setIsLoading(false);
        return;
      }

      // Handle success
      await fetchDepartments();
      showNotification(
        "Department Updated",
        "Department updated successfully.",
        "success",
      );
      handleClose();
    } catch (error: any) {
      showNotification(
        "Updating Department Error",
        error.message || "Failed to update department.",
        "error",
      );
      handleClose();
    }
  };

  const handleClose = () => {
    // Call the original onClose prop to close the modal
    setIsDepartmentModalOpen(false);
    setTimeout(() => {
      // Resetting all the state variables to their initial states
      resetDepartmentModalState();
      setIsLoading(false);
    }, 500);
  };

  const resetDepartmentModalState = () => {
    setDepartmentId(0);
    setDepartmentName("");
    setSelectedMembers([]);
  };

  // -----------------------------------------------------------------------------------------
  // Delete Modal Functions

  // Open delete modal when delete button is clicked
  const handleDelete = (id: number) => {
    setIsDeleteModalOpen(true);
    setDepartmentId(id);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // Delete department function
  const confirmDeleteModal = async () => {
    setIsLoading(true);
    closeDeleteModal();

    try {
      const response = await fetch(`/api/department/delete/${departmentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted department from the departments array
        const newDepartments = departments.filter(
          (department) => department.id !== departmentId,
        );
        // Update the state
        setDepartments(newDepartments);
        showNotification(
          "Department Deleted",
          "Department deleted successfully.",
          "success",
        );
        setIsLoading(false);
        setDepartmentId(0);
      } else {
        showNotification(
          "Deleting Department Error",
          "Failed to delete department.",
          "error",
        );
        console.log("Couldn't delete the department of ID: " + departmentId);
        setIsLoading(false);
        setDepartmentId(0);
      }
    } catch (error: any) {
      showNotification(
        "Deleting Department Error",
        error.message || "Failed to delete department.",
        "error",
      );
      console.log("An error occurred while deleting the department: ", error);
      setIsLoading(false);
      setDepartmentId(0);
    }
  };

  // -----------------------------------------------------------------------------------------

  // Fetch all departments
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
      showNotification(
        "Departments Fetching Error",
        "Failed to fetch departments.",
        "error",
      );
      setIsLoading(false);
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchDepartments();
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
          description="A list of all the departments and their related details."
          columns={columns}
          data={departments}
          actionButton={
            <Button
              text="Create Department"
              className="ml-auto bg-primary text-white hover:bg-indigo-400 focus-visible:outline-indigo-500"
              onClick={() => setIsDepartmentModalOpen(true)}
            />
          }
        />
      )}
      <DepartmentModal
        open={isDepartmentModalOpen}
        handleClose={handleClose}
        departmentName={departmentName}
        setDepartmentName={setDepartmentName}
        employees={employees}
        selectedMembers={selectedMembers}
        setSelectedMembers={setSelectedMembers}
        handleCreate={handleCreate}
        handleUpdate={handleUpdate}
        isEmployeeLoading={isEmployeeLoading}
        isDepartmentProvided={isDepartmentProvided}
      />
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
