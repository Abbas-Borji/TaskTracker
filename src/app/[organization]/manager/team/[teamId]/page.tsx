import AllowOnlyManager from "@/app/common/functions/ClientAllowOnlyManager";
import TeamChecklists from "./components/TeamChecklists";

const TeamPage = ({ params }: { params: { teamId: string } }) => {
  const teamId = params.teamId;
  const teamIdNumber = teamId ? parseInt(teamId, 10) : null;

  return (
    <div>
      <AllowOnlyManager />
      {teamIdNumber ? (
        <TeamChecklists teamId={teamIdNumber} />
      ) : (
        <p>Invalid Team ID</p>
      )}
    </div>
  );
};

export default TeamPage;
