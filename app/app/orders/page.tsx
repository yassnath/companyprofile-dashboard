import Link from "next/link";
import { Plus } from "lucide-react";

import { OrdersTable } from "@/components/dashboard/orders-table";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Orders",
};

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Orders</h1>
          <p className="mt-1 text-muted-foreground">Kelola semua order Anda dengan filter, sorting, dan aksi cepat.</p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href="/app/orders/new">
            <Plus className="mr-2 size-4" />
            New Order
          </Link>
        </Button>
      </div>
      <OrdersTable />
    </div>
  );
}
