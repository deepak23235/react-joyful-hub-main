import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { fetchEnquiries, fetchModels } from "@/lib/store";
import { Enquiry, Model } from "@/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [enquiriesData, modelsData] = await Promise.all([
        fetchEnquiries(),
        fetchModels(),
      ]);
      setEnquiries(enquiriesData);
      setModels(modelsData);
    } catch (error) {
      toast.error("Failed to load enquiries");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const modelName = (id: string) => models.find(m => m.id === id)?.name || "—";

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
      <h1 className="text-2xl  font-bold mb-6">User Enquiries</h1>
      <div className="rounded-lg border overflow-hidden">
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
            {enquiries.map(e => (
              <tr key={e.id} className="border-t">
                <td className="px-4 py-3">{e.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{e.email}</td>
                <td className="px-4 py-3">{e.phone}</td>
                <td className="px-4 py-3">{modelName(e.modelId)}</td>
                <td className="px-4 py-3 max-w-xs truncate">{e.message}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(e.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {enquiries.length === 0 && <p className="text-center text-muted-foreground py-8">No enquiries yet.</p>}
      </div>
    </AdminLayout>
  );
};

export default AdminEnquiries;
