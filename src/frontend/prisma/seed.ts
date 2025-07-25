import { PrismaClient } from "../lib/prisma";
const prisma = new PrismaClient();

async function main() {
  const patron = await prisma.patron.upsert({
    where: { id: -1, name: "John Doe" },
    update: {},
    create: {
      id: -1,
      name: "John Doe",
    },
  });
  console.log("Seeded: ", patron);
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
