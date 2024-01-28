"use client";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";
import { useEffect, useState } from "react";
import DashboardSkeleton from "../common/components/DashboardSkeleton";
import Dashboard from "../common/components/Dashboard";
import ActionButtons from "./components/ActionButtons";
import Notification from "@/app/common/components/Notification";
import Modal from "@/app/common/components/Modal";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

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

const AssignmentsTable = ({ params }: { params: { organization: string } }) => {
  const columns = [
    { title: "ID", dataKey: "id", sortable: true },
    { title: "Checklist", dataKey: "checklistName", sortable: true },
    { title: "Employee", dataKey: "employee", sortable: true },
    { title: "Manager", dataKey: "manager", sortable: true },
    { title: "Due Date", dataKey: "dueDate", sortable: true },
    {
      title: "Actions",
      dataKey: "actions",
      render: (rowData: Assignment) => (
        <ActionButtons
          assignmentId={rowData.id}
          checklistId={rowData.checklistId}
          onDelete={handleDelete}
          organization={params.organization}
        />
      ),
    },
    // Add more columns if needed
  ];
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignmentId, setAssignmentId] = useState(0);
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  const handleDelete = (id: number) => {
    setIsModalOpen(true);
    setAssignmentId(id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    closeModal();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/assignment/delete/${assignmentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotificationVisible(true);
        setTimeout(() => {
          setNotificationVisible(false);
          setIsLoading(false);
        }, 1000);
        // Remove the deleted assignment from the assignments array
        const newAssignments = assignments.filter(
          (assignment) => assignment.id !== assignmentId,
        );
        // Update the state
        setAssignments(newAssignments);
      } else {
        console.log("Couldn't delete the assignment of ID: " + assignmentId);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("An error occurred while deleting the assignment: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchChecklists = async () => {
      try {
        const response = await fetch(`/api/admin/assignments`);
        if (!response.ok) {
          setIsLoading(false);
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
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching assignments:", error);
      }
    };

    fetchChecklists();
  }, []);

  return (
    <>
      <AllowOnlyAdmin />
      {isNotificationVisible ? (
        <Notification
          title="Assignment Deleted"
          body="The assignment was deleted successfully!"
          icon={<CheckCircleIcon className="text-green-600" />}
          show={isNotificationVisible}
          setShow={setNotificationVisible}
        />
      ) : null}
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <Dashboard
          description="A list of all the assignments and related details."
          columns={columns}
          data={assignments}
        />
      )}
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title="Confirm Delete"
        message="Are you sure you want to delete this assignment?"
        confirmButtonText="Yes"
        cancelButtonText="No, keep it"
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default AssignmentsTable;
