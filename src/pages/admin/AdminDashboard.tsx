import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { fetchLocations, fetchAreas, fetchModels, fetchEnquiries } from "@/lib/store";
import { MapPin, Map, Box, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { label: "Locations", value: 0, icon: MapPin },
    { label: "Areas", value: 0, icon: Map },
    { label: "Models", value: 0, icon: Box },
    { label: "Enquiries", value: 0, icon: FileText },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [locations, areas, models, enquiries] = await Promise.all([
        fetchLocations(),
        fetchAreas(),
        fetchModels(),
        fetchEnquiries(),
      ]);

      setStats([
        { label: "Locations", value: locations.length, icon: MapPin },
        { label: "Areas", value: areas.length, icon: Map },
        { label: "Models", value: models.length, icon: Box },
        { label: "Enquiries", value: enquiries.length, icon: FileText },
      ]);
    } catch (error) {
      toast.error("Failed to load dashboard stats");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-display font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border bg-card p-5 card-elevated">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
