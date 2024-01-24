"use client";
import React from "react";
import { useEffect, useState } from "react";
import ThreeCardContainer from "@/app/common/components/ThreeCardContainer";
import { Checklist } from "@/app/common/types/Checklist";
import { Submission } from "@/app/common/types/Submission";
import ChecklistCard from "@/app/common/components/ChecklistCard";
import SubmissionCard from "@/app/common/components/SubmissionCard";
import CardSkeleton from "@/app/common/components/CardSkeleton";
import SixCardContainer from "@/app/common/components/SixCardContainer";
import { useRouter } from "next/navigation";

interface Team {
  name: string | null;
}

type ChecklistsProps = {
  teamId: number;
  organization: string;
};

const TeamChecklists = ({ teamId, organization }: ChecklistsProps) => {
  const [team, setTeam] = useState<Team>({ name: null });
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [viewType, setViewType] = useState("default"); // 'default', 'checklists', 'submissions'
  const router = useRouter();

  const onClick = async (assignmentId: number) => {
    // Update assignment viewedByEmployee status to 'true'
    try {
      const response = await fetch(`/api/user/assignment/${assignmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // Empty body
      });
      if (!response.ok) {
        throw new Error("Failed to update assignment");
      }
      console.log("Assignment updated successfully");
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
    router.push(`/${organization}/user/assignment/${assignmentId}`);
  };

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
        const response = await fetch(`/api/user/checklists/team/${teamId}`);
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
            title="Pending Checklists"
            items={isLoading ? sixSkeletonCardsArray : checklists}
            renderItem={(item, index) =>
              isLoading ? (
                <CardSkeleton key={index} />
              ) : (
                <ChecklistCard
                  checklist={item}
                  handleClick={onClick}
                  key={index}
                />
              )
            }
            onViewBack={handleViewDefault}
          />
        );
      case "submissions":
        return (
          <SixCardContainer
            title="Submitted Checklists"
            items={isLoading ? sixSkeletonCardsArray : submissions}
            renderItem={(item: any, index: number) =>
              isLoading ? (
                <CardSkeleton key={index} />
              ) : (
                <SubmissionCard submission={item} key={index} organization={organization}/>
              )
            }
            onViewBack={handleViewDefault}
          />
        );
      default:
        return (
          <div className="flex w-full flex-col gap-8 lg:flex-row">
            <ThreeCardContainer
              title="Pending Checklists"
              items={isLoading ? threeSkeletonCardsArray : checklists}
              renderItem={(item, index) =>
                isLoading ? (
                  <CardSkeleton key={index} />
                ) : (
                  <ChecklistCard
                    checklist={item}
                    handleClick={onClick}
                    key={index}
                  />
                )
              }
              onViewAll={() => handleViewAll("checklists")}
            />
            <ThreeCardContainer
              title="Submitted Checklists"
              items={isLoading ? threeSkeletonCardsArray : submissions}
              renderItem={(item, index) =>
                isLoading ? (
                  <CardSkeleton key={index} />
                ) : (
                  <SubmissionCard submission={item} key={index} organization={organization}/>
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
