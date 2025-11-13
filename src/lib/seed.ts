// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {}, // do nothing if it exists
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123", // TODO: Hash this password in production
      role: "admin",
    },
  });

  console.log("Admin user created:", admin);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
