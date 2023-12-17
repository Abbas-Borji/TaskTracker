import { PrismaClient, Role, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seedUsers() {
  const users = [
    {
      name: "John Doe",
      email: "john@tasktracker.io",
      password: await bcrypt.hash("123123123", 10),
      role: Role.USER,
      department: "Sales",
    },
    {
      name: "Jane Smith",
      email: "jane@tasktracker.io",
      password: await bcrypt.hash("123123123", 10),
      role: Role.MANAGER,
      department: "Marketing",
    },
    {
      name: "Steve Jobs",
      email: "steve@tasktracker.io",
      password: await bcrypt.hash("123123123", 10),
      role: Role.MANAGER,
      department: "Product",
    },
    {
      name: "Alex Bjorn",
      email: "alex@tasktracker.io",
      password: await bcrypt.hash("123123123", 10),
      role: Role.ADMIN,
      department: "IT",
    },
    {
      name: "Emma Watson",
      email: "emma@tasktracker.io",
      password: await bcrypt.hash("123123123", 10),
      role: Role.USER,
      department: "HR",
    },
    {
      name: "Robert Downey Jr.",
      email: "robert@tasktracker.io",
      password: await bcrypt.hash("123123123", 10),
      role: Role.ADMIN,
      department: "Finance",
    },
  ];
  const createdUsers = [];
  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: user,
    });
    createdUsers.push(createdUser);
  }

  return createdUsers;
}

async function seedTeams(
  createdUsers: Prisma.PromiseReturnType<typeof prisma.user.create>[],
) {
  await prisma.team.createMany({
    data: [
      { name: "General", managerId: createdUsers[1]!.id },
      { name: "Team A", managerId: createdUsers[2]!.id },
      { name: "Team B", managerId: createdUsers[1]!.id },
      { name: "Team C", managerId: createdUsers[2]!.id },
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
      { userId: createdUsers[2]!.id, teamId: 1 },
    ],
  });
}

async function seedChecklists(
  createdUsers: Prisma.PromiseReturnType<typeof prisma.user.create>[],
) {
  await prisma.checklist.createMany({
    data: [
      { name: "Checklist 1", managerId: createdUsers[1]!.id, teamId: 1 },
      { name: "Checklist 2", managerId: createdUsers[2]!.id, teamId: 1 },
      { name: "Checklist 3", managerId: createdUsers[3]!.id, teamId: 1 },
      { name: "Checklist 4", managerId: createdUsers[1]!.id, teamId: 1 },
      { name: "Checklist 5", managerId: createdUsers[2]!.id, teamId: 1 },
      { name: "Checklist 6", managerId: createdUsers[3]!.id, teamId: 1 },
      { name: "Checklist 7", managerId: createdUsers[1]!.id, teamId: 1 },
    ],
  });
}

async function seedQuestions() {
  await prisma.question.createMany({
    data: [
      { content: "Question 1?", checklistId: 1 },
      { content: "Question 2?", checklistId: 2 },
      { content: "Question 3?", checklistId: 3 },
    ],
  });
}

async function seedOptions() {
  await prisma.option.createMany({
    data: [
      { content: "Option 1", questionId: 1 },
      { content: "Option 2", questionId: 1 },
      { content: "Option 3", questionId: 2 },
      { content: "Option 4", questionId: 2 },
      { content: "Option 5", questionId: 3 },
      { content: "Option 6", questionId: 3 },
    ],
  });
}

async function seedAssignments(
  createdUsers: Prisma.PromiseReturnType<typeof prisma.user.create>[],
) {
  await prisma.assignment.createMany({
    data: [
      {
        employeeId: createdUsers[0]!.id,
        checklistId: 1,
        teamId: 1,
        dueDate: new Date(),
      },
      {
        employeeId: createdUsers[0]!.id,
        checklistId: 2,
        teamId: 1,
        dueDate: new Date(),
      },
      {
        employeeId: createdUsers[0]!.id,
        checklistId: 3,
        teamId: 1,
        dueDate: new Date(),
      },
      {
        employeeId: createdUsers[0]!.id,
        checklistId: 4,
        teamId: 1,
        dueDate: new Date(),
      },
      {
        employeeId: createdUsers[0]!.id,
        checklistId: 5,
        teamId: 1,
        dueDate: new Date(),
      },
      {
        employeeId: createdUsers[0]!.id,
        checklistId: 6,
        teamId: 1,
        dueDate: new Date(),
      },
      {
        employeeId: createdUsers[0]!.id,
        checklistId: 7,
        teamId: 1,
        dueDate: new Date(),
      },
      {
        employeeId: createdUsers[1]!.id,
        checklistId: 1,
        teamId: 1,
        dueDate: new Date(),
      },
    ],
  });
}

async function seedSubmissions(
  createdUsers: Prisma.PromiseReturnType<typeof prisma.user.create>[],
) {
  await prisma.submission.createMany({
    data: [
      { userId: createdUsers[0]!.id, assignmentId: 1, status: "PENDING" },
      { userId: createdUsers[0]!.id, assignmentId: 2, status: "OPENED" },
      { userId: createdUsers[0]!.id, assignmentId: 3, status: "REVIEWED" },
      { userId: createdUsers[0]!.id, assignmentId: 4, status: "PENDING" },
      { userId: createdUsers[0]!.id, assignmentId: 5, status: "OPENED" },
      { userId: createdUsers[0]!.id, assignmentId: 6, status: "REVIEWED" },
      { userId: createdUsers[0]!.id, assignmentId: 7, status: "PENDING" },
    ],
  });
}

async function seedFeedbacks(
  createdUsers: Prisma.PromiseReturnType<typeof prisma.user.create>[],
) {
  await prisma.feedback.createMany({
    data: [
      {
        assignmentId: 1,
        content: "Feedback 1",
        managerId: createdUsers[1]!.id,
      },
      {
        assignmentId: 2,
        content: "Feedback 2",
        managerId: createdUsers[2]!.id,
      },
      {
        assignmentId: 3,
        content: "Feedback 3",
        managerId: createdUsers[3]!.id,
      },
    ],
  });
}

async function main() {
  const createdUsers = await seedUsers();
  await seedTeams(createdUsers);
  await seedMemberOf(createdUsers);
  await seedChecklists(createdUsers);
  await seedQuestions();
  await seedOptions();
  await seedAssignments(createdUsers);
  await seedSubmissions(createdUsers);
  await seedFeedbacks(createdUsers);
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
