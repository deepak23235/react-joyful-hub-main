import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAreas, useLocations, useCreateArea, useUpdateArea, useDeleteArea } from "@/hooks/use-queries";
import { Area, Location } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import slugify from "slugify"
import { Skeleton } from "@/components/ui/skeleton";

const emptyArea = (): Omit<Area, "id"> => ({ locationId: "", name: "", slug: "", image: "", description: "" });

const AdminAreas = () => {
  const { data: areas = [], isLoading: areasLoading, refetch: refetchAreas } = useAreas();
  const { data: locations = [], isLoading: locationsLoading, refetch: refetchLocations } = useLocations();
  
  const createMutation = useCreateArea();
  const updateMutation = useUpdateArea();
  const deleteMutation = useDeleteArea();

  const [editing, setEditing] = useState<Area | null>(null);
  const [form, setForm] = useState(emptyArea());
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loading = areasLoading || locationsLoading;
  const saving = createMutation.isPending || updateMutation.isPending;

  const handleRefresh = async () => {
    await Promise.all([refetchAreas(), refetchLocations()]);
  };

  const save = async () => {
    if (!form.name || !form.slug || !form.locationId) { toast.error("All fields required"); return; }
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, data: { ...form, image: "" } });
        toast.success("Area updated");
      } else {
        await createMutation.mutateAsync({ ...form, image: "" });
        toast.success("Area added");
      }
      setOpen(false);
      setEditing(null);
      setForm(emptyArea());
    } catch (error) {
      toast.error("Failed to save area");
      console.error(error);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this area? This will also delete all associated models.")) return;
    
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Area deleted");
    } catch (error) {
      toast.error("Failed to delete area");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (a: Area) => {
    setEditing(a);
    setForm({ locationId: a.locationId, name: a.name, slug: a.slug, image: a.image, description: a.description });
    setOpen(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyArea());
    setOpen(true);
  };

  const locName = (id: string) => locations.find(l => l.id === id)?.name || "—";

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Areas</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading || saving || Boolean(deletingId)} className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <Button onClick={openNew} className="gap-2" disabled={loading || saving || Boolean(deletingId)}>
              <Plus className="h-4 w-4" /> Add Area
            </Button>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Area</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <Select value={form.locationId} onValueChange={v => setForm(p => ({ ...p, locationId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select Location" /></SelectTrigger>
                <SelectContent>{locations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
              </Select>
              <Input  placeholder="Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: editing ? p.slug : slugify(e.target.value) }))} />
              <Textarea placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              <Button onClick={save} className="w-full" disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : editing ? "Update" : "Add"} Area
              </Button>
            </div>
          </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="surface-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr><th className="text-left px-4 py-3 font-medium">Name</th><th className="text-left px-4 py-3 font-medium">Location</th><th className="text-left px-4 py-3 font-medium">Slug</th><th className="text-right px-4 py-3 font-medium">Actions</th></tr>
          </thead>
          <tbody>
            {loading && !areas.length ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3 text-right"><Skeleton className="h-8 w-20 ml-auto" /></td>
                </tr>
              ))
            ) : (
              areas.map(a => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-3">{a.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{locName(a.locationId)}</td>
                  <td className="px-4 py-3 text-muted-foreground">/{a.slug}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(a)} disabled={saving || Boolean(deletingId)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(a.id)} disabled={saving || Boolean(deletingId)}>
                      {deletingId === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin text-destructive" /> : <Trash2 className="h-3.5 w-3.5 text-destructive" />}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!loading && areas.length === 0 && <p className="text-center text-muted-foreground py-8">No areas yet.</p>}
      </div>
    </AdminLayout>
  );
};

export default AdminAreas;
