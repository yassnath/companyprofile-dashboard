"use server";

import { OrderStatus, type Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  cancelOrderSchema,
  orderDraftSchema,
  orderWizardSchema,
  type OrderDraftInput,
} from "@/lib/validations";

type OrderActionResult = {
  success: boolean;
  message: string;
  orderId?: string;
};

function mapDraftToOrderData(
  input: OrderDraftInput,
  fallback: { name?: string | null; email?: string | null },
): Omit<Prisma.OrderUncheckedCreateInput, "userId"> {
  const links = input.exampleLinks
    ?.split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    serviceType: input.serviceType ?? "LANDING_PAGE",
    title: input.title?.trim() || "Untitled Draft",
    description: input.description?.trim() || "Draft order",
    targetAudience: input.targetAudience?.trim() || "General audience",
    budgetMin: input.budgetMin ?? null,
    budgetMax: input.budgetMax ?? null,
    deadline: input.deadline ? new Date(input.deadline) : null,
    brandColors: input.brandColors || null,
    exampleLinks: input.exampleLinks || null,
    referencesJson: {
      list: input.references ?? [],
      links: links ?? [],
    },
    contactName: input.contactName?.trim() || fallback.name || "Client",
    contactEmail: input.contactEmail?.trim() || fallback.email || "client@example.com",
    contactPhone: input.contactPhone || null,
  };
}

export async function saveOrderDraftAction(input: OrderDraftInput): Promise<OrderActionResult> {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: "Session tidak ditemukan. Silakan login ulang.",
    };
  }

  const parsed = input.submit ? orderWizardSchema.safeParse(input) : orderDraftSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data order tidak valid",
    };
  }

  const data = parsed.data;
  const mapped = mapDraftToOrderData(data, { name: session.user.name, email: session.user.email });

  const existing = data.id
    ? await prisma.order.findUnique({
        where: { id: data.id },
      })
    : null;

  if (existing) {
    const isOwner = existing.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return {
        success: false,
        message: "Anda tidak memiliki akses untuk mengubah order ini.",
      };
    }

    if (existing.status !== "DRAFT" && !isAdmin) {
      return {
        success: false,
        message: "Hanya order berstatus Draft yang bisa diubah.",
      };
    }

    const nextStatus = data.submit ? OrderStatus.SUBMITTED : OrderStatus.DRAFT;
    const transitioned = existing.status !== nextStatus;

    const updated = await prisma.order.update({
      where: { id: existing.id },
      data: {
        ...mapped,
        status: nextStatus,
        submittedAt: data.submit ? existing.submittedAt ?? new Date() : existing.submittedAt,
      },
    });

    if (transitioned) {
      await prisma.orderStatusHistory.create({
        data: {
          orderId: updated.id,
          status: nextStatus,
          note: data.submit ? "Order disubmit oleh client" : "Order disimpan sebagai draft",
          actorUserId: session.user.id,
        },
      });
    }

    revalidatePath("/app/orders");
    revalidatePath(`/app/orders/${updated.id}`);

    return {
      success: true,
      message: data.submit ? "Order berhasil dikirim" : "Draft berhasil disimpan",
      orderId: updated.id,
    };
  }

  const status = data.submit ? OrderStatus.SUBMITTED : OrderStatus.DRAFT;

  const created = await prisma.order.create({
    data: {
      ...mapped,
      userId: session.user.id,
      status,
      submittedAt: data.submit ? new Date() : null,
      statusHistory: {
        create: {
          status,
          note: data.submit ? "Order pertama kali disubmit" : "Draft pertama dibuat",
          actorUserId: session.user.id,
        },
      },
    },
  });

  revalidatePath("/app/orders");
  revalidatePath("/app");

  return {
    success: true,
    message: data.submit ? "Order berhasil dikirim" : "Draft berhasil dibuat",
    orderId: created.id,
  };
}

export async function cancelOrderAction(input: { orderId: string; note?: string }): Promise<OrderActionResult> {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: "Session tidak ditemukan.",
    };
  }

  const parsed = cancelOrderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Input pembatalan tidak valid.",
    };
  }

  const order = await prisma.order.findUnique({ where: { id: parsed.data.orderId } });
  if (!order) {
    return {
      success: false,
      message: "Order tidak ditemukan.",
    };
  }

  const isOwner = order.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return {
      success: false,
      message: "Anda tidak punya akses membatalkan order ini.",
    };
  }

  const forbiddenStatuses: OrderStatus[] = [OrderStatus.CANCELLED, OrderStatus.COMPLETED];
  if (forbiddenStatuses.includes(order.status)) {
    return {
      success: false,
      message: "Order tidak bisa dibatalkan pada status saat ini.",
    };
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.CANCELLED },
    }),
    prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: OrderStatus.CANCELLED,
        note: parsed.data.note || "Order dibatalkan",
        actorUserId: session.user.id,
      },
    }),
  ]);

  revalidatePath("/app/orders");
  revalidatePath(`/app/orders/${order.id}`);

  return {
    success: true,
    message: "Order berhasil dibatalkan.",
    orderId: order.id,
  };
}

export async function updateOrderStatusAdminAction(input: {
  orderId: string;
  status: OrderStatus;
  note?: string;
}): Promise<OrderActionResult> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Akses admin dibutuhkan.",
    };
  }

  const order = await prisma.order.findUnique({ where: { id: input.orderId } });
  if (!order) {
    return {
      success: false,
      message: "Order tidak ditemukan.",
    };
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: input.orderId },
      data: {
        status: input.status,
        submittedAt: input.status === OrderStatus.SUBMITTED ? order.submittedAt ?? new Date() : order.submittedAt,
      },
    }),
    prisma.orderStatusHistory.create({
      data: {
        orderId: input.orderId,
        status: input.status,
        note: input.note || `Status diperbarui menjadi ${input.status}`,
        actorUserId: session.user.id,
      },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath(`/app/orders/${input.orderId}`);

  return {
    success: true,
    message: "Status order berhasil diperbarui.",
    orderId: input.orderId,
  };
}
