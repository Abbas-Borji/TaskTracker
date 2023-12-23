"use client";
import React from "react";
import { useEffect, useState } from "react";
import ThreeCardContainer from "@/app/common/components/ThreeCardContainer";
import { Checklist } from "@/app/common/types/Checklist";
import { Submission } from "@/app/common/types/Submission";
import ManagerChecklistCard from "./ManagerChecklistCard";
import ManagerSubmissionCard from "./ManagerSubmissionCard";
import CardSkeleton from "@/app/common/components/CardSkeleton";
import SixCardContainer from "@/app/common/components/SixCardContainer";
import Button from "@/app/common/components/Button";
import { useRouter } from "next/navigation";

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

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    const response = await fetch(
      `/api/manager/checklists/delete?checklistId=${id}`,
      {
        method: "DELETE",
      },
    );

    if (response.ok) {
      // Remove the deleted checklist from the checklists array
      const newChecklists = checklists.filter(
        (checklist) => checklist.info.id !== id,
      );
      // Update the state
      setChecklists(newChecklists);
      setIsLoading(false);
    } else {
      console.log("Couldn't delete the checklist of ID: " + id);
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
      <h1 className="mb-5 text-4xl font-medium">| {team.name || "Team ..."}</h1>
      {renderContent()}
    </div>
  );
};

export default TeamChecklists;
