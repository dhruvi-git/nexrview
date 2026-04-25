import "dotenv/config";
import { PrismaClient } from "./lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  await db.user.updateMany({
    data: {
      credits: 50,
      creditBalance: 50
    }
  });
  console.log("Updated all existing users to 50 credits!");
}

main().catch(console.error).finally(() => db.$disconnect());
