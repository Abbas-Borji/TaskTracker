"use client";
import Button from "@/app/common/components/Button";
import CardSkeleton from "@/app/common/components/CardSkeleton";
import Modal from "@/app/common/components/Modal";
import Notification from "@/app/common/components/Notification";
import SixCardContainer from "@/app/common/components/SixCardContainer";
import ThreeCardContainer from "@/app/common/components/ThreeCardContainer";
import { Checklist } from "@/app/common/types/Checklist";
import { Submission } from "@/app/common/types/Submission";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ManagerChecklistCard from "./ManagerChecklistCard";
import ManagerSubmissionCard from "./ManagerSubmissionCard";

interface Team {
  name: string | null;
}

type ChecklistsProps = {
  teamId: number;
};

const TeamChecklists = ({ teamId }: ChecklistsProps) => {
  const router = useRouter();
  const [team, setTeam] = useState<Team>({ name: null });
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [viewType, setViewType] = useState("default"); // 'default', 'checklists', 'submissions'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checklistId, setChecklistId] = useState(0);
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  const handleViewAll = (type: string) => {
    setViewType(type);
  };
  const handleViewDefault = () => {
    setViewType("default");
  };

  useEffect(() => {
    async function fetchChecklists() {
      setIsLoading(true); // Start loading
      console.log("Fetching checklists for team ID:", teamId);
      try {
        const response = await fetch(`/api/manager/checklists/team/${teamId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        setTeam(data.teamName);
        setChecklists(data.checklists);
        setSubmissions(data.submissions);
        setIsLoading(false); // Stop loading after fetching data
      } catch (error) {
        console.error("Error fetching checklists:", error);
      } finally {
        setIsLoading(false); // Stop loading in case of an error
      }
    }

    fetchChecklists();
  }, [teamId]);

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

  const threeSkeletonCardsArray = Array.from({ length: 3 }, (_, index) => (
    <CardSkeleton key={index} />
  ));

  const sixSkeletonCardsArray = Array.from({ length: 6 }, (_, index) => (
    <CardSkeleton key={index} />
  ));

  const renderContent = () => {
    switch (viewType) {
      case "checklists":
        return (
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
            onViewBack={handleViewDefault}
            actionButton={
              <Button
                text="Create"
                onClick={() =>
                  router.push(`/manager/checklist/create?teamId=` + teamId)
                }
              />
            }
          />
        );
      case "submissions":
        return (
          <SixCardContainer
            title="Responses"
            items={isLoading ? sixSkeletonCardsArray : submissions}
            renderItem={(item: any, index: number) =>
              isLoading ? (
                <CardSkeleton key={index} />
              ) : (
                <ManagerSubmissionCard submission={item} key={index} />
              )
            }
            onViewBack={handleViewDefault}
          />
        );
      default:
        return (
          <div className="flex w-full flex-col gap-8 lg:flex-row">
            <ThreeCardContainer
              title="Checklists"
              items={isLoading ? threeSkeletonCardsArray : checklists}
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
              onViewAll={() => handleViewAll("checklists")}
              actionButton={
                <Button
                  text="Create"
                  onClick={() =>
                    router.push(`/manager/checklist/create?teamId=` + teamId)
                  }
                />
              }
            />
            <ThreeCardContainer
              title="Responses"
              items={isLoading ? threeSkeletonCardsArray : submissions}
              renderItem={(item, index) =>
                isLoading ? (
                  <CardSkeleton key={index} />
                ) : (
                  <ManagerSubmissionCard submission={item} key={index} />
                )
              }
              onViewAll={() => handleViewAll("submissions")}
            />
          </div>
        );
    }
  };

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
      <h1 className="mb-5 text-4xl font-medium">| {team.name || "Team ..."}</h1>
      {renderContent()}
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

export default TeamChecklists;
