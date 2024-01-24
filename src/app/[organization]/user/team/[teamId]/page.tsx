import TeamChecklists from "./components/TeamChecklists";
import AllowOnlyUser from "@/app/common/functions/ClientAllowOnlyUser";

const TeamPage = ({
  params,
}: {
  params: { organization: string; teamId: string };
}) => {
  const teamId = params.teamId;
  const teamIdNumber = teamId ? parseInt(teamId, 10) : null;
  const organization = params.organization;

  return (
    <div>
      <AllowOnlyUser />
      {teamIdNumber ? (
        <TeamChecklists teamId={teamIdNumber} organization={organization} />
      ) : (
        <p>Invalid Team ID</p>
      )}
    </div>
  );
};

export default TeamPage;
