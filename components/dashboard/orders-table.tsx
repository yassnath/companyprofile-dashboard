/* eslint-disable react-hooks/incompatible-library */
"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Loader2, Pencil, Search, XCircle } from "lucide-react";
import { toast } from "sonner";

import { cancelOrderAction } from "@/lib/actions/order-actions";
import { formatDateTimeID } from "@/lib/format";
import { orderStatusLabel, serviceTypeLabel } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const statuses = [
  "ALL",
  "DRAFT",
  "SUBMITTED",
  "IN_REVIEW",
  "IN_PROGRESS",
  "WAITING_CLIENT",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
] as const;

type OrderRow = {
  id: string;
  title: string;
  serviceType: keyof typeof serviceTypeLabel;
  status: keyof typeof orderStatusLabel;
  updatedAt: string;
  createdAt: string;
};

type OrdersResponse = {
  data: OrderRow[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

async function fetchOrders(params: {
  status: string;
  search: string;
  page: number;
  sort: string;
  order: "asc" | "desc";
}) {
  const query = new URLSearchParams();
  if (params.status !== "ALL") query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  query.set("page", String(params.page));
  query.set("pageSize", "10");
  query.set("sort", params.sort);
  query.set("order", params.order);

  const response = await fetch(`/api/orders?${query.toString()}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Gagal memuat daftar order.");
  }

  return (await response.json()) as OrdersResponse;
}

function statusVariant(status: keyof typeof orderStatusLabel): "default" | "secondary" | "outline" | "destructive" {
  if (status === "CANCELLED") return "destructive";
  if (status === "COMPLETED") return "default";
  if (status === "DRAFT") return "outline";
  return "secondary";
}

function statusColorClass(status: keyof typeof orderStatusLabel) {
  if (status === "DRAFT") return "border-slate-300 bg-slate-500/8 text-slate-700 dark:text-slate-300";
  if (status === "SUBMITTED") return "border-sky-300 bg-sky-500/10 text-sky-700 dark:text-sky-300";
  if (status === "IN_REVIEW") return "border-indigo-300 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300";
  if (status === "IN_PROGRESS") return "border-violet-300 bg-violet-500/10 text-violet-700 dark:text-violet-300";
  if (status === "WAITING_CLIENT") return "border-amber-300 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  if (status === "DELIVERED") return "border-teal-300 bg-teal-500/10 text-teal-700 dark:text-teal-300";
  if (status === "COMPLETED") return "border-emerald-300 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300";
  return "border-rose-300 bg-rose-500/12 text-rose-700 dark:text-rose-300";
}

function CancelOrderButton({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <XCircle className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Batalkan order ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini akan mengubah status order menjadi Cancelled.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Tidak</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              startTransition(async () => {
                const result = await cancelOrderAction({ orderId: id });
                if (!result.success) {
                  toast.error(result.message);
                  return;
                }
                toast.success(result.message);
                queryClient.invalidateQueries({ queryKey: ["orders"] });
              });
            }}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : "Ya, batalkan"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function OrdersTable() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("ALL");
  const [sort, setSort] = useState("updatedAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["orders", status, search, page, sort, order],
    queryFn: () => fetchOrders({ status, search, page, sort, order }),
    placeholderData: (previousData) => previousData,
  });

  const columns = useMemo<ColumnDef<OrderRow>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Project",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.title}</p>
            <p className="text-xs text-muted-foreground">{serviceTypeLabel[row.original.serviceType]}</p>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant={statusVariant(row.original.status)}
            className={row.original.status === "CANCELLED" ? "" : statusColorClass(row.original.status)}
          >
            {orderStatusLabel[row.original.status]}
          </Badge>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => <span className="text-sm">{formatDateTimeID(row.original.updatedAt)}</span>,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const canEdit = row.original.status === "DRAFT";

          return (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href={`/app/orders/${row.original.id}`} aria-label="View order">
                  <Eye className="size-4" />
                </Link>
              </Button>
              {canEdit ? (
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/app/orders/new?draft=${row.original.id}`} aria-label="Edit draft order">
                    <Pencil className="size-4" />
                  </Link>
                </Button>
              ) : null}
              {row.original.status !== "CANCELLED" && row.original.status !== "COMPLETED" ? (
                <CancelOrderButton id={row.original.id} />
              ) : null}
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setSearch(searchInput.trim());
                setPage(1);
              }
            }}
            placeholder="Cari judul atau deskripsi order"
            className="rounded-xl pl-9"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center">
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full rounded-xl sm:w-auto lg:w-44">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((item) => (
                <SelectItem key={item} value={item}>
                  {item === "ALL" ? "All statuses" : orderStatusLabel[item]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={`${sort}:${order}`}
            onValueChange={(value) => {
              const [nextSort, nextOrder] = value.split(":");
              setSort(nextSort);
              setOrder(nextOrder as "asc" | "desc");
            }}
          >
            <SelectTrigger className="w-full rounded-xl sm:w-auto lg:w-44">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt:desc">Updated (newest)</SelectItem>
              <SelectItem value="updatedAt:asc">Updated (oldest)</SelectItem>
              <SelectItem value="createdAt:desc">Created (newest)</SelectItem>
              <SelectItem value="createdAt:asc">Created (oldest)</SelectItem>
              <SelectItem value="deadline:asc">Deadline (nearest)</SelectItem>
              <SelectItem value="deadline:desc">Deadline (latest)</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="rounded-xl sm:w-auto"
            onClick={() => {
              setSearch(searchInput.trim());
              setPage(1);
            }}
          >
            Apply
          </Button>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={`mobile-skeleton-${index}`} className="rounded-2xl border bg-card p-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="mt-2 h-3 w-1/2" />
              </div>
            ))
          : null}

        {!isLoading && (data?.data.length ?? 0) > 0
          ? data?.data.map((item) => {
              const canEdit = item.status === "DRAFT";

              return (
                <article key={item.id} className="rounded-2xl border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{serviceTypeLabel[item.serviceType]}</p>
                    </div>
                    <Badge variant="outline" className={statusColorClass(item.status)}>
                      {orderStatusLabel[item.status]}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Updated {formatDateTimeID(item.updatedAt)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/app/orders/${item.id}`}>
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                    {canEdit ? (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/app/orders/new?draft=${item.id}`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                    ) : null}
                    {item.status !== "CANCELLED" && item.status !== "COMPLETED" ? (
                      <CancelOrderButton id={item.id} />
                    ) : null}
                  </div>
                </article>
              );
            })
          : null}

        {!isLoading && (data?.data.length ?? 0) === 0 ? (
          <div className="rounded-2xl border bg-card p-5 text-sm text-muted-foreground">
            Belum ada order. Mulai dari tombol New Order.
          </div>
        ) : null}
      </div>

      <div className="hidden rounded-2xl border bg-card md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell colSpan={columns.length}>
                      <div className="space-y-2 py-2">
                        <Skeleton className="h-4 w-2/5" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div className="py-8 text-sm text-muted-foreground">
                      Belum ada order. Mulai dari tombol New Order.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {isFetching ? "Updating..." : `Total ${data?.pagination.total ?? 0} order`}
        </p>

        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  setPage((prev) => Math.max(prev - 1, 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(data?.pagination.totalPages ?? 1, 5) }, (_, index) => index + 1).map(
              (item) => (
                <PaginationItem key={item}>
                  <PaginationLink
                    href="#"
                    isActive={item === (data?.pagination.page ?? 1)}
                    onClick={(event) => {
                      event.preventDefault();
                      setPage(item);
                    }}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  setPage((prev) => Math.min(prev + 1, data?.pagination.totalPages ?? 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
