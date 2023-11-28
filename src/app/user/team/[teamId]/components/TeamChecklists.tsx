"use client";
import React from "react";
import { useEffect, useState } from "react";
import ChecklistSkeletons from "./loading";

interface Team {
  name: string | null;
}

interface Checklist {
  info: {
    id: number;
    name: string;
    dueDate: string;
    viewed: boolean;
  };
  manager: {
    id: number;
    name: string;
  };
}

interface Submission {
  id?: number;
  status: string;
  submittedAt?: string;
  archivedByManager?: boolean;
  checklistinfo?: {
    name?: string;
    managerName?: string;
  };
}

type ChecklistsProps = {
  teamId: number;
};

const Checklists = ({ teamId }: ChecklistsProps) => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [team, setTeam] = useState<Team>({ name: null });
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
        const team = data.teamName;
        const checklists = data.checklists;
        const submissions = data.submissions;
        setTeam(team);
        setChecklists(checklists);
        setSubmissions(submissions);
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
      <h1 className="mb-10 text-4xl font-medium">| {team.name}</h1>
      <div className="flex w-full flex-col gap-8 lg:flex-row">
        <div className="w-full rounded-lg border border-gray-300 p-5 shadow-sm transition-shadow hover:shadow-md">
          <h3 className="mb-5 text-xl font-medium">Pending Checklists</h3>
          <div>
            {checklists.slice(0, 3).map((checklist: Checklist) => (
              <div
                key={checklist.info.id}
                className="relative mb-4 rounded-lg bg-light p-4 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-bold">
                      {checklist.info.name}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Assigned by: {checklist.manager.name}
                    </div>
                  </div>
                  <button
                    className={`${
                      checklist.info.viewed ? "bg-success" : "bg-primary"
                    } h-8 w-20 rounded px-2 py-1 text-xs font-medium text-light`}
                  >
                    {checklist.info.viewed ? "Continue" : "Start"}
                  </button>
                </div>
                {/* Date at the bottom */}
                <div className="mt-2 text-sm italic text-gray-600">
                  Due {checklist.info.dueDate}
                </div>
              </div>
            ))}
            <div className="mt-4 text-center">
              <a
                href="/path-to-all-assigned-checklists" // Replace with your target URL
                className="text-blue-600 hover:text-blue-800"
              >
                View all
              </a>
            </div>
          </div>
        </div>
        <div className="w-full rounded-lg border border-gray-300 p-5 shadow-sm transition-shadow hover:shadow-md">
          <h3 className="mb-5 text-xl font-medium">Submitted Checklists</h3>
          <div>
            {submissions.slice(0, 3).map((submission) => (
              <div
                key={submission.id}
                className="relative mb-4 rounded-lg bg-light p-4 shadow-md"
              >
                {/* Ellipsis Icon */}
                <div className="absolute right-6 top-2 rotate-90 transform cursor-pointer text-2xl text-gray-600 hover:text-gray-800">
                  &#8942; {/* HTML entity for horizontal ellipsis */}
                </div>
                {submission.checklistinfo && (
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center text-lg font-bold">
                        {submission.checklistinfo.name}
                        <span
                          className={`ml-4 rounded px-2 py-1 text-xs ${
                            submission.status === "PENDING"
                              ? "bg-red-300"
                              : submission.status === "OPENED"
                                ? "bg-yellow-300"
                                : submission.status === "REVIEWED"
                                  ? "bg-green-300"
                                  : ""
                          }`}
                        >
                          {submission.status}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Assigned by: {submission.checklistinfo.managerName}
                      </div>
                    </div>
                  </div>
                )}
                {/* Date at the bottom */}
                <div className="mt-2 text-sm italic text-gray-600">
                  Submitted at {submission.submittedAt}
                </div>
              </div>
            ))}

            <div className="mt-4 text-center">
              <a
                href="/path-to-all-submitted-checklists" // Replace with your target URL
                className="text-blue-600 hover:text-blue-800"
              >
                View all
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checklists;
