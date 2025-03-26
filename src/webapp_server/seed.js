const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminUser = await prisma.user.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      username: "admin",
      password: "password"
    },
  });

  console.log("Admin user upserted:", adminUser);
}

main()
.catch(e => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});
