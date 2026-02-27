import { Prisma, type OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { orderFilterSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const parsed = orderFilterSchema.safeParse({
    status: url.searchParams.get("status") || undefined,
    search: url.searchParams.get("search") || undefined,
    page: url.searchParams.get("page") || undefined,
    pageSize: url.searchParams.get("pageSize") || undefined,
    sort: url.searchParams.get("sort") || undefined,
    order: url.searchParams.get("order") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid query", issues: parsed.error.issues }, { status: 400 });
  }

  const { status, search, page, pageSize, sort, order } = parsed.data;

  const where: Prisma.OrderWhereInput = {
    ...(session.user.role === "ADMIN" ? {} : { userId: session.user.id }),
    ...(status ? { status: status as OrderStatus } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [rows, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            statusHistory: true,
          },
        },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({
    data: rows,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.max(Math.ceil(total / pageSize), 1),
    },
  });
}
