"use client";
import React from "react";
import { useEffect, useState } from "react";
import ChecklistSkeletons from "./loading";

interface Checklist {
  info: {
    id: number;
    name: string;
  };
  manager: {
    id: number;
    name: string;
  };
}

interface Manager {
  id: number;
  name: string;
}

type TeamChecklistsProps = {
  teamId: number;
};

const TeamChecklists = ({ teamId }: TeamChecklistsProps) => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchChecklists() {
      setIsLoading(true);
      console.log("Fetching checklists for team ID:", teamId);
      try {
        const response = await fetch(`/api/user/team/${teamId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        setChecklists(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching checklists:", error);
        setIsLoading(true);
      }
    }

    fetchChecklists();
  }, [teamId]); // Dependency array to ensure the effect runs once or when teamId changes

  if (isLoading) {
    return (
      <div className="relative">
        <ChecklistSkeletons />
      </div>
    );
  }

  return (
    <div className="p-2">
      <h1 className="mb-10 text-4xl font-medium">| Team {teamId}</h1>
      <div className="flex w-full flex-col gap-8 lg:flex-row">
      <div className="w-full rounded-lg border border-gray-300 shadow-sm p-5 hover:shadow-md transition-shadow">
          <h3 className="mb-5 text-xl font-medium">Pending Checklists</h3>
          <div>
            {checklists.map((checklist: Checklist) => (
              <div
                key={checklist.info.id}
                className="mb-4 rounded-lg bg-[#f5f5f5] p-4 shadow-md"
              >
                <div className="text-lg font-bold">{checklist.info.name}</div>
                <div className="text-gray-600">
                  Assigned by: {checklist.manager.name}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full rounded-lg border border-gray-300 shadow-sm p-5 hover:shadow-md transition-shadow">
          <h3 className="mb-5 text-xl font-medium">Submitted Checklists</h3>
          <div>
            {checklists.map((checklist: Checklist) => (
              <div
                key={checklist.info.id}
                className="mb-4 rounded-lg bg-[#f5f5f5] p-4 shadow-md"
              >
                <div className="text-lg font-bold">{checklist.info.name}</div>
                <div className="text-gray-600">
                  Assigned by: {checklist.manager.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamChecklists;
