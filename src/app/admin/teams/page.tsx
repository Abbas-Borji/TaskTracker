"use client";
import React, { useState, useEffect } from "react";
import Dashboard from "../common/components/Dashboard";
import Button from "@/app/common/components/Button";
import ActionButtons from "./components/ActionButtons";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";

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
  MemberOf: { memberOf: User }[];
}

interface Team {
  id: number;
  name: string;
  manager: string;
  totalMembers: number;
  members: string;
}

const TeamsTable = () => {
  AllowOnlyAdmin();
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`/api/admin/teams`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const teams: responseTeam[] = await response.json();
        const reshapedTeams: Team[] = teams.map((team) => ({
          id: team.id,
          name: team.name,
          manager: team.manager.name,
          totalMembers: team.totalMembers,
          members: team.MemberOf.map((member) => member.memberOf.name).join(
            " | ",
          ),
        }));

        setTeams(reshapedTeams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <Dashboard
      description="A list of all the teams and related details."
      columns={columns}
      data={teams}
      actionButton={
        <Button
          text="Create Team"
          className="ml-auto bg-primary text-white hover:bg-indigo-400 focus-visible:outline-indigo-500"
          onClick={() => console.log("Team created!")}
        />
      }
    />
  );
};

export default TeamsTable;
