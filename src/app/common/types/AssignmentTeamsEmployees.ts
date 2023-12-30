type Team = {
  id: number;
  name: string;
};

export type Employee = {
  id: number;
  name: string;
};

type ResponseWithTeam = {
  checklistName: string;
  hasTeam: true;
  team: Team;
  restructuredEmployees: Employee[];
  message?: string;
};

type ResponseWithoutTeam = {
  checklistName: string;
  hasTeam: false;
  restructuredTeams: Team[];
  message?: string;
};

type ExpectedResponse = ResponseWithTeam | ResponseWithoutTeam;

export default ExpectedResponse;
