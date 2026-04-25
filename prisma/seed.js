import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding dummy interviewers...");

  // Create 3 dummy interviewers
  const interviewers = [
    {
      clerkUserId: "mock_clerk_user_1",
      email: "jane.doe@example.com",
      name: "Jane Doe",
      role: "INTERVIEWER",
      imageUrl: "https://i.pravatar.cc/150?u=jane",
      bio: "Senior Frontend Engineer with 8 years of experience building scalable UIs.",
      title: "Senior Frontend Engineer",
      company: "Meta",
      yearsExp: 8,
      categories: ["FRONTEND", "SYSTEM_DESIGN"],
      creditRate: 2,
    },
    {
      clerkUserId: "mock_clerk_user_2",
      email: "john.smith@example.com",
      name: "John Smith",
      role: "INTERVIEWER",
      imageUrl: "https://i.pravatar.cc/150?u=john",
      bio: "Backend specialist focusing on distributed systems and high-throughput architectures.",
      title: "Staff Software Engineer",
      company: "Stripe",
      yearsExp: 10,
      categories: ["BACKEND", "SYSTEM_DESIGN", "DSA"],
      creditRate: 3,
    },
    {
      clerkUserId: "mock_clerk_user_3",
      email: "alice.w@example.com",
      name: "Alice Wang",
      role: "INTERVIEWER",
      imageUrl: "https://i.pravatar.cc/150?u=alice",
      bio: "I love helping candidates crack the DSA interviews. Ex-Google interviewer.",
      title: "Software Engineer III",
      company: "Google",
      yearsExp: 4,
      categories: ["DSA", "BEHAVIORAL"],
      creditRate: 1,
    }
  ];

  for (const data of interviewers) {
    const user = await db.user.upsert({
      where: { email: data.email },
      update: {},
      create: data,
    });
    
    // Add some future availabilities for each interviewer
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 2);
    nextDay.setHours(14, 0, 0, 0);

    await db.availability.createMany({
      data: [
        {
          interviewerId: user.id,
          startTime: tomorrow,
          endTime: new Date(tomorrow.getTime() + 60 * 60 * 1000), // +1 hour
        },
        {
          interviewerId: user.id,
          startTime: nextDay,
          endTime: new Date(nextDay.getTime() + 60 * 60 * 1000), // +1 hour
        }
      ]
    });
  }

  console.log("✅ Successfully seeded 3 dummy interviewers with availabilities!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
