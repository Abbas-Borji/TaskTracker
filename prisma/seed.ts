import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedUsers() {
await prisma.user.createMany({
    data: [
      { fullName: "John Doe", email:"john@tasktracker.io", password:"123123123", role: "USER" },
      { fullName: "Jane Smith", email:"jane@tasktracker.io", password:"123123123", role: "MANAGER" },
      { fullName: "Alex Bjorn", email:"alex@tasktracker.io", password:"123123123", role: "ADMIN" },
    ],
    
});
}

async function seedTeams() {
  await prisma.team.createMany({
    data: [
      { name: "Team A", managerId: 2 },
      { name: "Team B", managerId: 2 },
    ],
  });
}

async function seedChecklists() {
  await prisma.checklist.createMany({
    data: [
      { name: "Checklist 1", managerId: 2 },
      { name: "Checklist 2", managerId: 2 },
    ],
  });
}

async function seedQuestions() {
  await prisma.question.createMany({
    data: [
      { content: "Question 1?", checklistId: 1 },
      { content: "Question 2?", checklistId: 1 },
      { content: "Question 3?", checklistId: 2 },
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
    ],
  });
}

async function seedAssignments() {
  await prisma.assignment.createMany({
    data: [
      { employeeId: 1, checklistId: 1, teamId: 1, dueDate: new Date() },
      { employeeId: 2, checklistId: 2, teamId: 2, dueDate: new Date() },
      { employeeId: 2, checklistId: 1, teamId: 1, dueDate: new Date() },
    ],
  });
}

async function seedSubmissions() {
  await prisma.submission.createMany({
    data: [
      { userId: 1, assignmentId: 1 },
      { userId: 1, assignmentId: 2 },
      { userId: 2, assignmentId: 3 },
    ],
  });
}

async function seedFeedbacks() {
  await prisma.feedback.createMany({
    data: [
      { assignmentId: 1, content: "Feedback 1", managerId: 2 },
      { assignmentId: 2, content: "Feedback 2", managerId: 2 },
      { assignmentId: 3, content: "Feedback 3", managerId: 3 },
    ],
  });
}

async function main() {
  await seedUsers();
  await seedTeams();
  await seedChecklists();
  await seedQuestions();
  await seedOptions();
  await seedAssignments();
  await seedSubmissions();
  await seedFeedbacks();
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });