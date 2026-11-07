const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const productCount = await prisma.product.count();

  if (productCount === 0) {
    await prisma.product.createMany({
      data: [
        { name: 'Buku', price: 15000 },
        { name: 'Pulpen', price: 5000 },
      ],
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
