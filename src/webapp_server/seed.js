const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminUser = await prisma.user.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      username: "admin",
      password: "$2y$10$41f.V7MXsnNiY4FWIvwDXu7DDZxZh3MEUKCaBKHTObBi2xs79Ey5G"
    },
  });

  const adminUser2 = await prisma.user.upsert({
    where: { id: "2" },
    update: {},
    create: {
      id: "2",
      username: "men",
      password: "$2y$10$41f.V7MXsnNiY4FWIvwDXu7DDZxZh3MEUKCaBKHTObBi2xs79Ey5G"
    },
  });

  console.log("Admin user upserted:", adminUser2);
}

main()
.catch(e => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});
