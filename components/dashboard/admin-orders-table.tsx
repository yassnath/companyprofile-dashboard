"use client";

import { useState, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { updateOrderStatusAdminAction } from "@/lib/actions/order-actions";
import { orderStatusLabel } from "@/lib/constants";
import { formatDateTimeID } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statuses = Object.keys(orderStatusLabel) as Array<keyof typeof orderStatusLabel>;

type OrderRow = {
  id: string;
  title: string;
  status: keyof typeof orderStatusLabel;
  updatedAt: string;
  user: {
    name: string;
    email: string;
  };
};

type OrdersResponse = {
  data: OrderRow[];
};

async function fetchAdminOrders() {
  const response = await fetch("/api/orders?page=1&pageSize=50&sort=updatedAt&order=desc", { cache: "no-store" });
  if (!response.ok) throw new Error("Gagal mengambil order");
  return (await response.json()) as OrdersResponse;
}

function StatusEditor({
  order,
}: {
  order: OrderRow;
}) {
  const [value, setValue] = useState<keyof typeof orderStatusLabel>(order.status);
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={value} onValueChange={(next) => setValue(next as keyof typeof orderStatusLabel)}>
        <SelectTrigger className="w-44 rounded-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {orderStatusLabel[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        className="rounded-xl"
        disabled={isPending || value === order.status}
        onClick={() => {
          startTransition(async () => {
            const result = await updateOrderStatusAdminAction({
              orderId: order.id,
              status: value,
            });

            if (!result.success) {
              toast.error(result.message);
              return;
            }

            toast.success(result.message);
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
          });
        }}
      >
        {isPending ? <Loader2 className="size-4 animate-spin" /> : "Update"}
      </Button>
    </div>
  );
}

export function AdminOrdersTable() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchAdminOrders,
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading orders...</p>;
  }

  if (error || !data) {
    return <p className="text-sm text-destructive">Gagal memuat order admin.</p>;
  }

  return (
    <div className="space-y-3">
      {data.data.map((order) => (
        <article key={order.id} className="rounded-2xl border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">{order.title}</p>
              <p className="text-xs text-muted-foreground">{order.user.name} - {order.user.email}</p>
            </div>
            <Badge variant={order.status === "CANCELLED" ? "destructive" : "secondary"}>{orderStatusLabel[order.status]}</Badge>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Updated: {formatDateTimeID(order.updatedAt)}</p>
          <div className="mt-3">
            <StatusEditor order={order} />
          </div>
        </article>
      ))}
    </div>
  );
}
