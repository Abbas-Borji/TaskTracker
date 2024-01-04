"use client";
import Button from "@/app/common/components/Button";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";
import { useEffect, useState } from "react";
import Dashboard from "../common/components/Dashboard";
import DashboardSkeleton from "../common/components/DashboardSkeleton";
import ActionButtons from "./components/ActionButtons";
import TeamModal from "@/app/common/components/TeamModal";

const columns = [
  { title: "ID", dataKey: "id", sortable: true },
  { title: "Name", dataKey: "name", sortable: true },
  { title: "Manager", dataKey: "manager", sortable: true },
  { title: "Total", dataKey: "totalMembers", sortable: true },
  { title: "Members", dataKey: "members" },
  { title: "Actions", dataKey: "actions", render: ActionButtons },
  // Add more columns if needed
];

interface User {
  id?: string;
  name: string;
}

interface responseTeam {
  id: number;
  name: string;
  manager: User;
  totalMembers: number;
  MemberOf: { member: User }[];
}

interface Team {
  id: number;
  name: string;
  manager: string;
  totalMembers: number;
  members: string;
}

const TeamsTable = () => {
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [teams, setTeams] = useState<Team[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchTeams = async () => {
      try {
        const response = await fetch(`/api/admin/teams`);
        if (!response.ok) {
          setIsLoading(false);
          throw new Error("Network response was not ok");
        }
        const teams: responseTeam[] = await response.json();
        const reshapedTeams: Team[] = teams.map((team) => ({
          id: team.id,
          name: team.name,
          manager: team.manager.name,
          totalMembers: team.totalMembers,
          members: team.MemberOf.map((member) => member.member.name).join(
            " | ",
          ),
        }));

        setTeams(reshapedTeams);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <>
      <AllowOnlyAdmin />
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <Dashboard
          description="A list of all the teams and related details."
          columns={columns}
          data={teams}
          actionButton={
            <Button
              text="Create Team"
              className="ml-auto bg-primary text-white hover:bg-indigo-400 focus-visible:outline-indigo-500"
              onClick={() => setIsModalOpen(true)}
            />
          }
        />
      )}
      <TeamModal open={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default TeamsTable;
