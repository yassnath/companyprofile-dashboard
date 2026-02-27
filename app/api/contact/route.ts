import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { contactLeadSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactLeadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Input tidak valid", issues: parsed.error.issues }, { status: 400 });
  }

  const limiter = rateLimit(
    `lead:${parsed.data.email}:${getClientIp(request.headers)}`,
    6,
    60_000,
  );

  if (!limiter.allowed) {
    return NextResponse.json(
      { message: "Terlalu banyak request. Coba lagi sebentar." },
      { status: 429 },
    );
  }

  const lead = await prisma.lead.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
      sourcePage: parsed.data.sourcePage,
    },
  });

  return NextResponse.json({ data: lead }, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ data: leads });
}
