"use client";
import Button from "@/app/common/components/Button";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";
import { useEffect, useState } from "react";
import Dashboard from "../common/components/Dashboard";
import DashboardSkeleton from "../common/components/DashboardSkeleton";
import ActionButtons from "./components/ActionButtons";
import TeamModal, { ComboBoxItem } from "@/app/common/components/TeamModal";
import Modal from "@/app/common/components/Modal";
import Notification from "@/app/common/components/Notification";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

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
  const columns = [
    { title: "ID", dataKey: "id", sortable: true },
    { title: "Name", dataKey: "name", sortable: true },
    { title: "Manager", dataKey: "manager", sortable: true },
    { title: "Total", dataKey: "totalMembers", sortable: true },
    { title: "Members", dataKey: "members" },
    {
      title: "Actions",
      dataKey: "actions",
      render: (rowData: ComboBoxItem) => (
        <ActionButtons
          teamId={Number(rowData.id)}
          onEdit={openTeamModal}
          onDelete={handleDelete}
        />
      ),
    },
    // Add more columns if needed
  ];

  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [teams, setTeams] = useState<Team[]>([]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teamId, setTeamId] = useState<number>(0);
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  // Team Modal Functions
  const closeTeamModal = () => {
    setIsTeamModalOpen(false);
    setTimeout(() => {
      setTeamId(0);
    }, 1000);
  };

  const openTeamModal = (teamId: number) => {
    setTeamId(teamId);
    setIsTeamModalOpen(true);
  };

  // Delete Modal Functions
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setIsDeleteModalOpen(true);
    setTeamId(id);
  };

  const confirmDeleteModal = async () => {
    closeDeleteModal();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/team/delete/${teamId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotificationVisible(true);
        setTimeout(() => {
          setNotificationVisible(false);
          setIsLoading(false);
        }, 1000);
        // Remove the deleted team from the teams array
        const newTeams = teams.filter((team) => team.id !== teamId);
        // Update the state
        setTeams(newTeams);
      } else {
        console.log("Couldn't delete the team of ID: " + teamId);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("An error occurred while deleting the team: ", error);
      setIsLoading(false);
    }
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
      {isNotificationVisible ? (
        <Notification
          title="Team Deleted"
          body="The team was deleted successfully!"
          icon={<CheckCircleIcon className="text-green-600" />}
          show={isNotificationVisible}
          setShow={setNotificationVisible}
        />
      ) : null}
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
              onClick={() => setIsTeamModalOpen(true)}
            />
          }
        />
      )}
      <TeamModal
        {...(teamId ? { teamId } : {})}
        open={isTeamModalOpen}
        onClose={closeTeamModal}
      />
      <Modal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirm Delete"
        message="Are you sure you want to delete this team?"
        confirmButtonText="Yes"
        cancelButtonText="No, keep it"
        onConfirm={confirmDeleteModal}
      />
    </>
  );
};

export default TeamsTable;
