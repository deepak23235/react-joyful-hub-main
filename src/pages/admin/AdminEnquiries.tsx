import AdminLayout from "@/components/AdminLayout";
import { useEnquiries, useModels } from "@/hooks/use-queries";
import { Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const AdminEnquiries = () => {
  const { data: enquiries = [], isLoading: enquiriesLoading, refetch: refetchEnquiries } = useEnquiries();
  const { data: models = [], isLoading: modelsLoading, refetch: refetchModels } = useModels();

  const loading = enquiriesLoading || modelsLoading;

  const handleRefresh = async () => {
    await Promise.all([refetchEnquiries(), refetchModels()]);
  };

  const modelName = (id: string) => models.find(m => m.id === id)?.name || "—";

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">User Enquiries</h1>
        <Button variant="outline" onClick={handleRefresh} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      <div className="surface-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Phone</th>
              <th className="text-left px-4 py-3 font-medium">Model</th>
              <th className="text-left px-4 py-3 font-medium">Message</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading && !enquiries.length ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-48" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                </tr>
              ))
            ) : (
              enquiries.map(e => (
                <tr key={e.id} className="border-t">
                  <td className="px-4 py-3">{e.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.email}</td>
                  <td className="px-4 py-3">{e.phone}</td>
                  <td className="px-4 py-3">{modelName(e.modelId)}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{e.message}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(e.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!loading && enquiries.length === 0 && <p className="text-center text-muted-foreground py-8">No enquiries yet.</p>}
      </div>
    </AdminLayout>
  );
};

export default AdminEnquiries;
