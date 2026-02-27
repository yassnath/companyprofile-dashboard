import Link from "next/link";
import { ArrowRight, Clock3, CreditCard, FolderKanban, MessageSquareMore } from "lucide-react";

import { HelpDialog } from "@/components/dashboard/help-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTimeID } from "@/lib/format";
import { orderStatusLabel } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardOverviewPage() {
  const user = await requireUser();

  const baseWhere = user.role === "ADMIN" ? {} : { userId: user.id };

  const [activeOrders, pendingPayments, totalMessages, recentActivity, completedOrders] = await Promise.all([
    prisma.order.count({
      where: {
        ...baseWhere,
        status: {
          in: ["SUBMITTED", "IN_REVIEW", "IN_PROGRESS", "WAITING_CLIENT", "DELIVERED"],
        },
      },
    }),
    prisma.order.count({
      where: {
        ...baseWhere,
        paymentStatus: {
          in: ["UNPAID", "PENDING"],
        },
      },
    }),
    Promise.resolve(3),
    prisma.orderStatusHistory.findMany({
      where:
        user.role === "ADMIN"
          ? {}
          : {
              order: {
                userId: user.id,
              },
            },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        order: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    }),
    prisma.order.findMany({
      where: {
        ...baseWhere,
        status: "COMPLETED",
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
      take: 30,
    }),
  ]);

  const avgDeliveryDays =
    completedOrders.length > 0
      ? Math.round(
          completedOrders.reduce((acc, order) => {
            const diff = order.updatedAt.getTime() - order.createdAt.getTime();
            return acc + diff / (1000 * 60 * 60 * 24);
          }, 0) / completedOrders.length,
        )
      : 12;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="mt-1 text-muted-foreground">Pantau order aktif, pembayaran, dan aktivitas terbaru Anda.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <HelpDialog />
          <Button asChild className="rounded-xl">
            <Link href="/app/orders/new">
              Create New Order
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="metric-card metric-blue border-primary/18">
          <CardHeader className="pb-2">
            <CardDescription>Active Orders</CardDescription>
            <CardTitle className="text-3xl">{activeOrders}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="inline-flex size-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
              <FolderKanban className="size-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card metric-amber border-amber-400/25">
          <CardHeader className="pb-2">
            <CardDescription>Pending Payment</CardDescription>
            <CardTitle className="text-3xl">{pendingPayments}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="inline-flex size-10 items-center justify-center rounded-xl border border-amber-400/35 bg-amber-400/10">
              <CreditCard className="size-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card metric-emerald border-emerald-400/25">
          <CardHeader className="pb-2">
            <CardDescription>Avg Delivery Time</CardDescription>
            <CardTitle className="text-3xl">{avgDeliveryDays} hari</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="inline-flex size-10 items-center justify-center rounded-xl border border-emerald-400/35 bg-emerald-400/10">
              <Clock3 className="size-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card metric-violet border-violet-400/22">
          <CardHeader className="pb-2">
            <CardDescription>Messages</CardDescription>
            <CardTitle className="text-3xl">{totalMessages}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="inline-flex size-10 items-center justify-center rounded-xl border border-violet-400/35 bg-violet-400/10">
              <MessageSquareMore className="size-5 text-violet-500" />
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
          <CardDescription>Perubahan status dan update terbaru order Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada aktivitas. Mulai dengan membuat order baru.</p>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="rounded-xl border bg-background/70 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">{activity.order.title}</p>
                    <Badge variant="secondary">{orderStatusLabel[activity.status]}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{activity.note || "Status diperbarui"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDateTimeID(activity.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
