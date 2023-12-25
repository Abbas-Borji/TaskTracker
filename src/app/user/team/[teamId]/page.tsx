import TeamChecklists from "./components/TeamChecklists";
import AllowOnlyUser from "@/app/common/functions/ClientAllowOnlyUser";

const TeamPage = ({ params }: { params: { teamId: string } }) => {
  const teamId = params.teamId;
  const teamIdNumber = teamId ? parseInt(teamId, 10) : null;

  return (
    <div>
      <AllowOnlyUser />
      {teamIdNumber ? (
        <TeamChecklists teamId={teamIdNumber} />
      ) : (
        <p>Invalid Team ID</p>
      )}
    </div>
  );
};

export default TeamPage;
