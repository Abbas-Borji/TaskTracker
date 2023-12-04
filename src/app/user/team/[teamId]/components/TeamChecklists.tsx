"use client";
import React from "react";
import { useEffect, useState } from "react";
import ThreeCardContainer from "@/app/common/components/ThreeCardContainer";
import { Checklist } from "@/app/common/types/Checklist";
import { Submission } from "@/app/common/types/Submission";
import ChecklistCard from "@/app/common/components/ChecklistCard";
import SubmissionCard from "@/app/common/components/SubmissionCard";

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

  useEffect(() => {
    async function fetchChecklists() {
      console.log("Fetching checklists for team ID:", teamId);
      try {
        const response = await fetch(`/api/checklists/team/${teamId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        const team = data.teamName;
        const checklists: Checklist[] = data.checklists;
        const submissions: Submission[] = data.submissions;
        setTeam(team);
        setChecklists(checklists);
        setSubmissions(submissions);
      } catch (error) {
        console.error("Error fetching checklists:", error);
      }
    }

    fetchChecklists();
  }, [teamId]); // Dependency array to ensure the effect runs once or when teamId changes

  return (
    <div className="p-2">
      <h1 className="mb-10 text-4xl font-medium">| {team.name}</h1>
      <div className="flex w-full flex-col gap-8 lg:flex-row">
        <ThreeCardContainer
          title="Pending Checklists"
          items={checklists}
          renderItem={(item) => <ChecklistCard checklist={item} />}
        />
        <ThreeCardContainer
          title="Submitted Checklists"
          items={submissions}
          renderItem={(item) => <SubmissionCard submission={item} />}
        />
      </div>
    </div>
  );
};

export default TeamChecklists;
