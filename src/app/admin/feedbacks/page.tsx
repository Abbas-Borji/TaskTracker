"use client";
import Modal from "@/app/common/components/Modal";
import Notification from "@/app/common/components/Notification";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Dashboard from "../common/components/Dashboard";
import DashboardSkeleton from "../common/components/DashboardSkeleton";
import ActionButtons from "./components/ActionButtons";

interface User {
  id?: string;
  name: string;
}

interface responseFeedback {
  id: number;
  createdAt: string;
  assignment: {
    employee: User;
    submission: {
      id: number;
    };
    checklist: {
      id: number;
      name: string;
      manager: User;
    };
  };
}

interface Feedback {
  id: number;
  checklistName: string;
  checklistId: number;
  submissionId: number;
  employee: string;
  manager: string;
  createdAt: string;
}

const FeedbacksTable = () => {
  const columns = [
    { title: "ID", dataKey: "id", sortable: true },
    { title: "Checklist", dataKey: "checklistName", sortable: true },
    { title: "Employee", dataKey: "employee", sortable: true },
    { title: "Manager", dataKey: "manager", sortable: true },
    { title: "Date", dataKey: "createdAt", sortable: true },
    {
      title: "Actions",
      dataKey: "actions",
      render: (rowData: Feedback) => (
        <ActionButtons
          feedbackId={rowData.id}
          submissionId={rowData.submissionId}
          onDelete={handleDelete}
        />
      ),
    },
  ];
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackId, setFeedbackId] = useState(0);

  const handleDelete = (id: number) => {
    setIsModalOpen(true);
    setFeedbackId(id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    closeModal();
    setIsLoading(true);
    try {
      const response = await fetch(`/api/feedback/delete/${feedbackId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setNotificationVisible(true);
        setTimeout(() => {
          setNotificationVisible(false);
          setIsLoading(false);
        }, 1000);
        // Remove the deleted feedback from the feedbacks array
        const newFeedbacks = feedbacks.filter(
          (feedback) => feedback.id !== feedbackId,
        );
        // Update the state
        setFeedbacks(newFeedbacks);
      } else {
        console.log("Couldn't delete the feedback of ID: " + feedbackId);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("An error occurred while deleting the feedback: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchChecklists = async () => {
      try {
        const response = await fetch(`/api/admin/feedbacks`);
        if (!response.ok) {
          setIsLoading(false);
          throw new Error("Network response was not ok");
        }
        const feedbacks: responseFeedback[] = await response.json();
        const reshapedFeedbacks: Feedback[] = feedbacks.map((feedback) => ({
          id: feedback.id,
          checklistName: feedback.assignment.checklist.name,
          checklistId: feedback.assignment.checklist.id,
          submissionId: feedback.assignment.submission.id,
          employee: feedback.assignment.employee.name,
          manager: feedback.assignment.checklist.manager.name,
          createdAt: feedback.createdAt,
        }));

        setFeedbacks(reshapedFeedbacks);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchChecklists();
  }, []);

  return (
    <>
      <AllowOnlyAdmin />
      {isNotificationVisible ? (
        <Notification
          title="Feedback Deleted"
          body="The feedback was deleted successfully!"
          icon={<CheckCircleIcon className="text-green-600" />}
          show={isNotificationVisible}
          setShow={setNotificationVisible}
        />
      ) : null}
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <Dashboard
          description="A list of all the feedbacks and related details."
          columns={columns}
          data={feedbacks}
        />
      )}
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title="Confirm Delete"
        message="Are you sure you want to delete this feedback?"
        confirmButtonText="Yes"
        cancelButtonText="No, keep it"
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default FeedbacksTable;
