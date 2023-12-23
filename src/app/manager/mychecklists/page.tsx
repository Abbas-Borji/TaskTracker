"use client";
import Button from "@/app/common/components/Button";
import CardSkeleton from "@/app/common/components/CardSkeleton";
import Modal from "@/app/common/components/Modal";
import Notification from "@/app/common/components/Notification";
import SixCardContainer from "@/app/common/components/SixCardContainer";
import AllowOnlyManager from "@/app/common/functions/ClientAllowOnlyManager";
import { ManagerChecklist } from "@/app/common/types/ManagerChecklist";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ManagerChecklistCard from "../team/[teamId]/components/ManagerChecklistCard";

const MyChecklists = () => {
  AllowOnlyManager();
  const router = useRouter();
  const [checklists, setChecklists] = useState<ManagerChecklist[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checklistId, setChecklistId] = useState(0);
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  useEffect(() => {
    async function fetchChecklists() {
      setIsLoading(true); // Start loading
      try {
        const response = await fetch("/api/manager/checklists");
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        setChecklists(data.checklists);
        setIsLoading(false); // Stop loading after fetching data
      } catch (error) {
        console.error("Error fetching checklists:", error);
      } finally {
        setIsLoading(false); // Stop loading in case of an error
      }
    }
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
        `/api/manager/checklists/delete?checklistId=${checklistId}`,
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
          (checklist) => checklist.info.id !== checklistId,
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

  const sixSkeletonCardsArray = Array.from({ length: 6 }, (_, index) => (
    <CardSkeleton key={index} />
  ));

  return (
    <div className="p-2">
      {isNotificationVisible ? (
        <Notification
          title="Checklist Deleted"
          body="The checklist was deleted successfully!"
          icon={<CheckCircleIcon className="text-green-600" />}
          show={isNotificationVisible}
          setShow={setNotificationVisible}
        />
      ) : null}
      <h1 className="mb-5 text-4xl font-medium">| My Checklists</h1>
      <SixCardContainer
        title="Checklists"
        items={isLoading ? sixSkeletonCardsArray : checklists}
        renderItem={(item, index) =>
          isLoading ? (
            <CardSkeleton key={index} />
          ) : (
            <ManagerChecklistCard
              checklist={item}
              key={index}
              onDelete={handleDelete}
            />
          )
        }
        actionButton={
          <Button
            text="Create"
            onClick={() => router.push("/manager/checklist/create")}
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
    </div>
  );
};

export default MyChecklists;
