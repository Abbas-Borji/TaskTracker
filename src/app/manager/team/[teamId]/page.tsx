"use client";
import { useParams } from "next/navigation";
import TeamChecklists from "./components/TeamChecklists";
import AllowOnlyManager from "@/app/common/functions/ClientAllowOnlyManager";

const TeamPage = () => {
  AllowOnlyManager();
  const params = useParams();
  const teamId = Array.isArray(params.teamId)
    ? params.teamId[0]
    : params.teamId;

  const teamIdNumber = teamId ? parseInt(teamId, 10) : null;

  return (
    <div>
      {teamIdNumber ? (
        <TeamChecklists teamId={teamIdNumber} />
      ) : (
        <p>Invalid Team ID</p>
      )}
    </div>
  );
};

export default TeamPage;
