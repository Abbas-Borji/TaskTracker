"use client";
import { useParams } from "next/navigation";
import TeamChecklists from "./components/TeamChecklists";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const TeamPage = () => {
  const session = useSession();
  const userRole = session.data?.user?.role;
  const router = useRouter();
  if (userRole === "ADMIN" || userRole === "USER") {
    router.replace("/redirect");
  }
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
