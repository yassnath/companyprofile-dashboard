import { PrismaClient, OrderStatus, Role, ServiceType } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("Solvix123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@solvix.studio" },
    update: {
      name: "Solvix Admin",
      passwordHash,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
    create: {
      name: "Solvix Admin",
      email: "admin@solvix.studio",
      passwordHash,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@solvix.studio" },
    update: {
      name: "Demo User",
      passwordHash,
      role: Role.USER,
      emailVerified: new Date(),
    },
    create: {
      name: "Demo User",
      email: "user@solvix.studio",
      passwordHash,
      role: Role.USER,
      emailVerified: new Date(),
    },
  });

  const existing = await prisma.order.findFirst({ where: { userId: user.id } });

  if (!existing) {
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        serviceType: ServiceType.LANDING_PAGE,
        status: OrderStatus.IN_PROGRESS,
        title: "Landing Page Rework - Solvix Partner",
        description:
          "Modernisasi landing page B2B SaaS dengan fokus konversi lead dan kecepatan loading.",
        targetAudience: "SMB owners dan startup founders",
        budgetMin: 12000000,
        budgetMax: 20000000,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        referencesJson: {
          examples: ["https://stripe.com", "https://linear.app"],
          notes: "Tone premium, minimal, data-first",
        },
        contactName: "Demo User",
        contactEmail: "user@solvix.studio",
      },
    });

    await prisma.orderStatusHistory.createMany({
      data: [
        {
          orderId: order.id,
          status: OrderStatus.SUBMITTED,
          note: "Order dikirim oleh client",
          actorUserId: user.id,
        },
        {
          orderId: order.id,
          status: OrderStatus.IN_REVIEW,
          note: "Scope direview tim Solvix",
          actorUserId: admin.id,
        },
        {
          orderId: order.id,
          status: OrderStatus.IN_PROGRESS,
          note: "Proyek masuk tahap implementasi",
          actorUserId: admin.id,
        },
      ],
    });
  }

  const leadExists = await prisma.lead.findFirst({ where: { email: "lead@solvix.studio" } });
  if (!leadExists) {
    await prisma.lead.create({
      data: {
        name: "Prospect Founder",
        email: "lead@solvix.studio",
        message: "Kami butuh redesign website + dashboard internal.",
        sourcePage: "/contact",
      },
    });
  }

  console.log("Seed complete: demo users and sample data ready.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
