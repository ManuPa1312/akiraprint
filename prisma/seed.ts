import { PrismaClient } from "../node_modules/.prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Maglia Trend Wave",
        price: 19.99,
        category: "maglie",
        description: "Maglia con grafica originale Trend Wave",
        image: "/products/maglia1.jpg",
      },
      {
        name: "Cappellino Akira",
        price: 14.99,
        category: "cappellini",
        description: "Cappellino con logo Akira Print",
        image: "/products/cappellino1.jpg",
      },
      {
        name: "Gadget personalizzabile",
        price: 9.99,
        category: "gadget",
        description: "Gadget personalizzabile con la tua grafica",
        image: "/products/gadget1.jpg",
      },
    ],
  });
  console.log("Prodotti inseriti!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());