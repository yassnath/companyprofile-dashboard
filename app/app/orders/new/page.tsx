import { notFound } from "next/navigation";

import { OrderWizard } from "@/components/dashboard/order-wizard";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const metadata = {
  title: "New Order",
};

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ draft?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;

  let initialDraft = undefined;

  if (params.draft) {
    const order = await prisma.order.findUnique({ where: { id: params.draft } });

    if (!order) {
      notFound();
    }

    if (user.role !== "ADMIN" && order.userId !== user.id) {
      notFound();
    }

    if (order.status !== "DRAFT" && user.role !== "ADMIN") {
      notFound();
    }

    initialDraft = {
      id: order.id,
      serviceType: order.serviceType,
      title: order.title,
      description: order.description,
      targetAudience: order.targetAudience ?? "",
      deadline: order.deadline ? order.deadline.toISOString().slice(0, 10) : "",
      budgetMin: order.budgetMin ?? undefined,
      budgetMax: order.budgetMax ?? undefined,
      brandColors: order.brandColors ?? "",
      exampleLinks: order.exampleLinks ?? "",
      contactName: order.contactName ?? "",
      contactEmail: order.contactEmail ?? "",
      contactPhone: order.contactPhone ?? "",
      submit: false,
    };
  }

  return <OrderWizard initialDraft={initialDraft} user={{ name: user.name, email: user.email }} />;
}
