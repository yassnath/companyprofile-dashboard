import { AdminOrdersTable } from "@/components/dashboard/admin-orders-table";

export const metadata = {
  title: "Admin",
};

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Admin Orders</h1>
        <p className="mt-1 text-muted-foreground">Kelola semua order dan update status untuk client.</p>
      </div>
      <AdminOrdersTable />
    </div>
  );
}
