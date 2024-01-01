"use client";
import Button from "@/app/common/components/Button";
import Modal from "@/app/common/components/Modal";
import Notification from "@/app/common/components/Notification";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Dashboard from "../common/components/Dashboard";
import DashboardSkeleton from "../common/components/DashboardSkeleton";
import ActionButtons from "./components/ActionButtons";

interface User {
  id?: string;
  name: string;
}

interface responseChecklist {
  id: number;
  name: string;
  manager: User;
  totalQuestions: number;
  questions: { id: number }[];
}

interface Checklist {
  id: number;
  name: string;
  manager: string;
  totalQuestions: number;
}

const ChecklistsTable = () => {
  const columns = [
    { title: "ID", dataKey: "id", sortable: true },
    { title: "Name", dataKey: "name", sortable: true },
    { title: "Manager", dataKey: "manager", sortable: true },
    { title: "Total Questions", dataKey: "totalQuestions", sortable: true },
    {
      title: "Actions",
      dataKey: "actions",
      render: (rowData: Checklist) => (
        <ActionButtons
          checklistId={rowData.id}
          onDelete={handleDelete}
        />
      ),
    },
    // Add more columns if needed
  ];
  const router = useRouter();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [checklistId, setChecklistId] = useState(0);
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchChecklists = async () => {
      try {
        const response = await fetch(`/api/admin/checklists`);
        if (!response.ok) {
          setIsLoading(false);
          throw new Error("Network response was not ok");
        }
        const checklists: responseChecklist[] = await response.json();
        const reshapedChecklists: Checklist[] = checklists.map((checklist) => ({
          id: checklist.id,
          name: checklist.name,
          manager: checklist.manager.name,
          totalQuestions: checklist.totalQuestions,
        }));

        setChecklists(reshapedChecklists);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching checklists:", error);
      }
    };

    fetchChecklists();
  }, []);

  const handleDelete = (id: number) => {
    setIsModalOpen(true);
    setChecklistId(id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    closeModal();
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/checklist/delete?checklistId=${checklistId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setNotificationVisible(true);
        setTimeout(() => {
          setNotificationVisible(false);
          setIsLoading(false);
        }, 1000);
        // Remove the deleted checklist from the checklists array
        const newChecklists = checklists.filter(
          (checklist) => checklist.id !== checklistId,
        );
        // Update the state
        setChecklists(newChecklists);
      } else {
        console.log("Couldn't delete the checklist of ID: " + checklistId);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("An error occurred while deleting the checklist: ", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <AllowOnlyAdmin />
      {isNotificationVisible ? (
        <Notification
          title="Checklist Deleted"
          body="The checklist was deleted successfully!"
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
            description="A list of all the checklists and related details."
            columns={columns}
            data={checklists}
            actionButton={
              <Button
                text="Create Checklist"
                className="ml-auto bg-primary text-white hover:bg-indigo-400 focus-visible:outline-indigo-500"
                onClick={() => router.push("/admin/checklist/create")}
              />
            }
          />
          <Modal
            open={isModalOpen}
            onClose={closeModal}
            title="Confirm Delete"
            message="Are you sure you want to delete this checklist?"
            confirmButtonText="Yes"
            cancelButtonText="No, keep it"
            onConfirm={confirmDelete}
          />
        </>
      )}
      ;
    </>
  );
};

export default ChecklistsTable;
