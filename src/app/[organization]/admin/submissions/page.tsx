"use client";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";
import { useEffect, useState } from "react";
import Dashboard from "../common/components/Dashboard";
import DashboardSkeleton from "../common/components/DashboardSkeleton";
import ActionButtons from "./components/ActionButtons";
import Notification from "@/app/common/components/Notification";
import Modal from "@/app/common/components/Modal";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

interface User {
  id?: string;
  name: string;
}

interface responseSubmission {
  id: number;
  createdAt: string;
  user: User;
  status: string;
  assignment: {
    checklist: {
      id: number;
      name: string;
      manager: User;
    };
  };
}

interface Submission {
  id: number;
  checklistName: string;
  checklistId: number;
  employee: string;
  manager: string;
  createdAt: string;
  status: string;
}

const SubmissionsTable = ({ params }: { params: { organization: string } }) => {
  const columns = [
    { title: "ID", dataKey: "id", sortable: true },
    { title: "Checklist", dataKey: "checklistName", sortable: true },
    { title: "Employee", dataKey: "employee", sortable: true },
    { title: "Manager", dataKey: "manager", sortable: true },
    { title: "Date", dataKey: "createdAt", sortable: true },
    { title: "Status", dataKey: "status", sortable: true },
    {
      title: "Actions",
      dataKey: "actions",
      render: (rowData: Submission) => (
        <ActionButtons
          submissionId={rowData.id}
          organization={params.organization}
          onDelete={handleDelete}
        />
      ),
    },
    // Add more columns if needed
  ];

  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissionId, setSubmissionId] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    const fetchChecklists = async () => {
      try {
        const response = await fetch(`/api/admin/submissions`);
        if (!response.ok) {
          setIsLoading(false);
          throw new Error("Network response was not ok");
        }
        const submissions: responseSubmission[] = await response.json();
        const reshapedSubmissions: Submission[] = submissions.map(
          (submission) => ({
            id: submission.id,
            checklistName: submission.assignment.checklist.name,
            checklistId: submission.assignment.checklist.id,
            employee: submission.user.name,
            manager: submission.assignment.checklist.manager.name,
            createdAt: submission.createdAt,
            status: submission.status,
          }),
        );

        setSubmissions(reshapedSubmissions);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching submissions:", error);
      }
    };

    fetchChecklists();
  }, []);

  const handleDelete = (id: number) => {
    setIsModalOpen(true);
    setSubmissionId(id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    closeModal();
    setIsLoading(true);
    try {
      const response = await fetch(`/api/submission/delete/${submissionId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setNotificationVisible(true);
        setTimeout(() => {
          setNotificationVisible(false);
          setIsLoading(false);
        }, 1000);
        // Remove the deleted submission from the submissions array
        const newSubmissions = submissions.filter(
          (submission) => submission.id !== submissionId,
        );
        // Update the state
        setSubmissions(newSubmissions);
      } else {
        console.log("Couldn't delete the submission of ID: " + submissionId);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("An error occurred while deleting the submission: ", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <AllowOnlyAdmin />
      {isNotificationVisible ? (
        <Notification
          title="Submission Deleted"
          body="The submission was deleted successfully!"
          icon={<CheckCircleIcon className="text-green-600" />}
          show={isNotificationVisible}
          setShow={setNotificationVisible}
        />
      ) : null}
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <Dashboard
            description="A list of all the submissions and related details."
            columns={columns}
            data={submissions}
          />
          <Modal
            open={isModalOpen}
            onClose={closeModal}
            title="Confirm Delete"
            message="Are you sure you want to delete this submission?"
            confirmButtonText="Yes"
            cancelButtonText="No, keep it"
            onConfirm={confirmDelete}
          />
        </>
      )}
    </>
  );
};

export default SubmissionsTable;
