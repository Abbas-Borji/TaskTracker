import { PrismaClient, Role, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seedOrganizations() {
  const organization = await prisma.organization.create({
    data: {
      name: "TaskTracker Corp",
    },
  });

  return organization;
}

async function seedDepartments(organizationId: number) {
  const departments = [
    { name: "Engineering" },
    { name: "Marketing" },
    { name: "Sales" },
    { name: "Human Resources" },
    { name: "Finance" },
    { name: "Customer Service" },
  ];

  for (const department of departments) {
    await prisma.department.create({
      data: {
        name: department.name,
        organizationId,
      },
    });
  }
}

async function seedUsers(organizationId: number) {
  const users = [
    {
      name: "John Doe",
      email: "john@tasktracker.io",
      password: await bcrypt.hash("zxcasdqwe123", 10),
      departmentId: 1,
    },
    {
      name: "Jane Smith",
      email: "jane@tasktracker.io",
      password: await bcrypt.hash("zxcasdqwe123", 10),
      departmentId: 2,
    },
    {
      name: "Steve Jobs",
      email: "steve@tasktracker.io",
      password: await bcrypt.hash("zxcasdqwe123", 10),
      departmentId: 3,
    },
    {
      name: "Alex Bjorn",
      email: "alex@tasktracker.io",
      password: await bcrypt.hash("zxcasdqwe123", 10),
      departmentId: 4,
    },
    {
      name: "Emma Watson",
      email: "emma@tasktracker.io",
      password: await bcrypt.hash("zxcasdqwe123", 10),
      departmentId: 5,
    },
    {
      name: "Robert Downey Jr.",
      email: "robert@tasktracker.io",
      password: await bcrypt.hash("zxcasdqwe123", 10),
      departmentId: 6,
    },
  ];
  const createdUsers = [];
  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: {
        ...user,
        OrganizationMembership: {
          create: {
            organizationId,
          },
        },
      },
    });
    createdUsers.push(createdUser);
  }

  return createdUsers;
}

async function seedTeams(
  createdUsers: Prisma.PromiseReturnType<typeof prisma.user.create>[],
  organizationId: number,
) {
  await prisma.team.createMany({
    data: [
      {
        name: "General",
        managerId: createdUsers[1]!.id,
        organizationId: organizationId,
      },
      {
        name: "Team A",
        managerId: createdUsers[2]!.id,
        organizationId: organizationId,
      },
      {
        name: "Team B",
        managerId: createdUsers[1]!.id,
        organizationId: organizationId,
      },
      {
        name: "Team C",
        managerId: createdUsers[2]!.id,
        organizationId: organizationId,
      },
    ],
  });
}

async function seedMemberOf(
  createdUsers: Prisma.PromiseReturnType<typeof prisma.user.create>[],
) {
  await prisma.memberOf.createMany({
    data: [
      { userId: createdUsers[0]!.id, teamId: 1 },
      { userId: createdUsers[0]!.id, teamId: 2 },
      { userId: createdUsers[0]!.id, teamId: 3 },
      { userId: createdUsers[0]!.id, teamId: 4 },
      { userId: createdUsers[1]!.id, teamId: 1 },
      { userId: createdUsers[1]!.id, teamId: 3 },
      { userId: createdUsers[2]!.id, teamId: 1 },
      { userId: createdUsers[2]!.id, teamId: 2 },
      { userId: createdUsers[2]!.id, teamId: 4 },
    ],
  });
}

async function seedChecklists(
  createdUsers: Prisma.PromiseReturnType<typeof prisma.user.create>[],
  organizationId: number,
) {
  await prisma.checklist.createMany({
    data: [
      {
        name: "Checklist 1",
        managerId: createdUsers[1]!.id,
        teamId: 1,
        organizationId: organizationId,
      },
      {
        name: "Checklist 2",
        managerId: createdUsers[2]!.id,
        teamId: 1,
        organizationId: organizationId,
      },
      {
        name: "Checklist 3",
        managerId: createdUsers[3]!.id,
        teamId: 1,
        organizationId: organizationId,
      },
      {
        name: "Checklist 4",
        managerId: createdUsers[1]!.id,
        teamId: 1,
        organizationId: organizationId,
      },
      {
        name: "Checklist 5",
        managerId: createdUsers[2]!.id,
        teamId: 1,
        organizationId: organizationId,
      },
      {
        name: "Checklist 6",
        managerId: createdUsers[3]!.id,
        teamId: 1,
        organizationId: organizationId,
      },
      {
        name: "Checklist 7",
        managerId: createdUsers[1]!.id,
        teamId: 1,
        organizationId: organizationId,
      },
    ],
  });
}

async function seedQuestions() {
  await prisma.question.createMany({
    data: [
      {
        content: "How do you rate your overall performance this quarter?",
        checklistId: 1,
      },
      {
        content: "How effectively do you feel you communicate with your team?",
        checklistId: 2,
      },
      {
        content:
          "Can you give an example of how you've contributed to team success?",
        checklistId: 3,
      },
      {
        content: "How do you manage and prioritize your workload?",
        checklistId: 4,
      },
      {
        content: "How do you adapt to new challenges and changes at work?",
        checklistId: 5,
      },
      {
        content: "Can you describe a situation where you showed leadership?",
        checklistId: 6,
      },
      {
        content: "How do you ensure the quality of your work?",
        checklistId: 7,
      },
    ],
  });
}

async function seedOptions() {
  await prisma.option.createMany({
    data: [
      // Options for "How do you rate your overall performance this quarter?"
      {
        content: "Outstanding: Exceeded all goals and expectations",
        questionId: 1,
      },
      {
        content: "Satisfactory: Met most goals and expectations",
        questionId: 1,
      },
      {
        content:
          "Needs Improvement: Did not meet several key goals and expectations",
        questionId: 1,
      },

      // Options for "How effectively do you feel you communicate with your team?"
      {
        content: "Very Effectively: Clear, concise, and always understood",
        questionId: 2,
      },
      {
        content: "Effectively: Generally clear but some areas for improvement",
        questionId: 2,
      },
      {
        content: "Ineffectively: Often misunderstood or unclear",
        questionId: 2,
      },

      // Options for "Can you give an example of how you've contributed to team success?"
      {
        content: "Leadership Role: Led projects or initiatives successfully",
        questionId: 3,
      },
      {
        content: "Support Role: Provided significant support to team members",
        questionId: 3,
      },
      {
        content:
          "Learning and Development: Focused on personal development to better contribute to the team",
        questionId: 3,
      },

      // Options for "How do you manage and prioritize your workload?"
      {
        content:
          "Very Efficiently: Always prioritize effectively and meet deadlines",
        questionId: 4,
      },
      {
        content:
          "Adequately: Usually prioritize well but sometimes miss deadlines",
        questionId: 4,
      },
      {
        content:
          "Needs Improvement: Struggle with prioritization and frequently miss deadlines",
        questionId: 4,
      },

      // Options for "How do you adapt to new challenges and changes at work?"
      {
        content: "Highly Adaptable: Quickly and effectively adapt to changes",
        questionId: 5,
      },
      {
        content:
          "Moderately Adaptable: Adapt with some hesitation or difficulty",
        questionId: 5,
      },
      {
        content:
          "Resistant to Change: Struggle to adapt and prefer consistency",
        questionId: 5,
      },

      // Options for "Can you describe a situation where you showed leadership?"
      {
        content:
          "Influential Leadership: Influenced significant positive changes or outcomes",
        questionId: 6,
      },
      {
        content:
          "Team Coordination: Coordinated and guided team members effectively",
        questionId: 6,
      },
      {
        content:
          "Problem-Solving Leadership: Led by solving critical challenges",
        questionId: 6,
      },

      // Options for "How do you ensure the quality of your work?"
      {
        content:
          "Strict Adherence to Standards: Consistently follow all guidelines and standards",
        questionId: 7,
      },
      {
        content:
          "Regular Reviews and Adjustments: Frequently review and improve work",
        questionId: 7,
      },
      {
        content:
          "Learning and Applying Feedback: Focus on learning from feedback and mistakes",
        questionId: 7,
      },
    ],
  });
}

async function seedAssignments(
  createdUsers: Prisma.PromiseReturnType<typeof prisma.user.create>[],
  organizationId: number,
) {
  await prisma.assignment.createMany({
    data: [
      {
        employeeId: createdUsers[0]!.id,
        checklistId: 1,
        teamId: 1,
        dueDate: new Date(),
        organizationId: organizationId,
      },
      {
        employeeId: createdUsers[0]!.id,
        checklistId: 2,
        teamId: 1,
        dueDate: new Date(),
        organizationId: organizationId,
      },
      {
        employeeId: createdUsers[0]!.id,
        checklistId: 3,
        teamId: 1,
        dueDate: new Date(),
        organizationId: organizationId,
      },
      {
        employeeId: createdUsers[0]!.id,
        checklistId: 4,
        teamId: 1,
        dueDate: new Date(),
        organizationId: organizationId,
      },
      {
        employeeId: createdUsers[0]!.id,
        checklistId: 5,
        teamId: 1,
        dueDate: new Date(),
        organizationId: organizationId,
      },
      {
        employeeId: createdUsers[0]!.id,
        checklistId: 6,
        teamId: 1,
        dueDate: new Date(),
        organizationId: organizationId,
      },
      {
        employeeId: createdUsers[0]!.id,
        checklistId: 7,
        teamId: 1,
        dueDate: new Date(),
        organizationId: organizationId,
      },
      {
        employeeId: createdUsers[4]!.id,
        checklistId: 1,
        teamId: 1,
        dueDate: new Date(),
        organizationId: organizationId,
      },
    ],
  });
}

async function seedSubmissions(
  createdUsers: Prisma.PromiseReturnType<typeof prisma.user.create>[],
  organizationId: number,
) {
  await prisma.submission.createMany({
    data: [
      {
        userId: createdUsers[0]!.id,
        assignmentId: 4,
        status: "PENDING",
        organizationId: organizationId,
      },
      {
        userId: createdUsers[0]!.id,
        assignmentId: 5,
        status: "OPENED",
        organizationId: organizationId,
      },
      {
        userId: createdUsers[0]!.id,
        assignmentId: 6,
        status: "REVIEWED",
        organizationId: organizationId,
      },
      {
        userId: createdUsers[0]!.id,
        assignmentId: 7,
        status: "PENDING",
        organizationId: organizationId,
      },
    ],
  });
}

async function seedSubmittedOptions() {
  await prisma.submittedOption.createMany({
    data: [
      { submissionId: 1, optionId: 12 },
      { submissionId: 2, optionId: 15 },
      { submissionId: 3, optionId: 18 },
      { submissionId: 4, optionId: 21 },
    ],
  });
}

async function seedFeedbacks(
  createdUsers: Prisma.PromiseReturnType<typeof prisma.user.create>[],
  organizationId: number,
) {
  await prisma.feedback.createMany({
    data: [
      {
        assignmentId: 6,
        content:
          "Thank you for sharing that example. It's great to hear about your problem-solving leadership skills. Can you elaborate a bit more on this? Specifically, it would be helpful to understand the context of the challenges you faced, the specific actions you took to address them, and the outcomes of your efforts.",
        managerId: createdUsers[1]!.id,
        organizationId: organizationId,
      },
      // ... Add more feedback entries if needed ...
    ],
  });
}

async function main() {
  const createdOrganization = await seedOrganizations();
  await seedDepartments(createdOrganization.id);
  const createdUsers = await seedUsers(createdOrganization.id);
  await seedTeams(createdUsers, createdOrganization.id);
  await seedMemberOf(createdUsers);
  await seedChecklists(createdUsers, createdOrganization.id);
  await seedQuestions();
  await seedOptions();
  await seedAssignments(createdUsers, createdOrganization.id);
  await seedSubmissions(createdUsers, createdOrganization.id);
  await seedSubmittedOptions();
  await seedFeedbacks(createdUsers, createdOrganization.id);
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
