"use client";
import React from "react";
import { useEffect, useState } from "react";
import ThreeCardContainer from "@/app/common/components/ThreeCardContainer";
import { Checklist } from "@/app/common/types/Checklist";
import { Submission } from "@/app/common/types/Submission";
import ChecklistCard from "@/app/common/components/ChecklistCard";
import SubmissionCard from "@/app/common/components/SubmissionCard";
import CardSkeleton from "@/app/common/components/CardSkeleton";

interface Team {
  name: string | null;
}

type ChecklistsProps = {
  teamId: number;
};

const TeamChecklists = ({ teamId }: ChecklistsProps) => {
  const [team, setTeam] = useState<Team>({ name: null });
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    async function fetchChecklists() {
      setIsLoading(true); // Start loading
      console.log("Fetching checklists for team ID:", teamId);
      try {
        const response = await fetch(`/api/checklists/team/${teamId}`);
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

  const skeletonCardsArray = Array.from({ length: 3 }, (_, index) => (
    <CardSkeleton key={index} />
  ));

  return (
    <div className="p-2">
      <h1 className="mb-10 text-4xl font-medium">
        | {team.name || "Team ..."}
      </h1>
      <div className="flex w-full flex-col gap-8 lg:flex-row">
        <ThreeCardContainer
          title="Pending Checklists"
          items={isLoading ? skeletonCardsArray : checklists}
          renderItem={(item) =>
            isLoading ? <CardSkeleton /> : <ChecklistCard checklist={item} />
          }
        />
        <ThreeCardContainer
          title="Submitted Checklists"
          items={isLoading ? skeletonCardsArray : submissions}
          renderItem={(item) =>
            isLoading ? <CardSkeleton /> : <SubmissionCard submission={item} />
          }
        />
      </div>
    </div>
  );
};

export default TeamChecklists;
