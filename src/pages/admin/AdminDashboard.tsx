import AdminLayout from "@/components/AdminLayout";
import { useLocations, useAreas, useModels, useEnquiries } from "@/hooks/use-queries";
import { MapPin, Map, Box, FileText, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const AdminDashboard = () => {
  const { data: locations, isLoading: locationsLoading, refetch: refetchLocations } = useLocations();
  const { data: areas, isLoading: areasLoading, refetch: refetchAreas } = useAreas();
  const { data: models, isLoading: modelsLoading, refetch: refetchModels } = useModels();
  const { data: enquiries, isLoading: enquiriesLoading, refetch: refetchEnquiries } = useEnquiries();

  const loading = locationsLoading || areasLoading || modelsLoading || enquiriesLoading;
  
  const handleRefresh = async () => {
    await Promise.all([
      refetchLocations(),
      refetchAreas(),
      refetchModels(),
      refetchEnquiries(),
    ]);
  };

  const stats = [
    { label: "Locations", value: locations?.length || 0, icon: MapPin },
    { label: "Areas", value: areas?.length || 0, icon: Map },
    { label: "Models", value: models?.length || 0, icon: Box },
    { label: "Enquiries", value: enquiries?.length || 0, icon: FileText },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <Button variant="outline" onClick={handleRefresh} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="surface-panel p-5 card-elevated">
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-9 w-12" />
            </div>
          ))
        ) : (
          stats.map((s) => (
            <div key={s.label} className="surface-panel p-5 card-elevated">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-accent" />
              </div>
              <p className="text-3xl font-bold">{s.value}</p>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
