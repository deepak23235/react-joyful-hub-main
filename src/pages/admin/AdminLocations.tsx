import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation } from "@/hooks/use-queries";
import { Location } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import slugify from "slugify"
import { Plus, Pencil, Trash2, Loader2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const emptyLocation = (): Omit<Location, "id"> => ({ name: "", slug: "", image: "", description: "" });

const AdminLocations = () => {
  const { data: locations = [], isLoading: loading, refetch } = useLocations();
  const createMutation = useCreateLocation();
  const updateMutation = useUpdateLocation();
  const deleteMutation = useDeleteLocation();

  const [editing, setEditing] = useState<Location | null>(null);
  const [form, setForm] = useState(emptyLocation());
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const saving = createMutation.isPending || updateMutation.isPending;

  const save = async () => {
    if (!form.name || !form.slug) { toast.error("Name and slug are required"); return; }
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, data: form });
        toast.success("Location updated");
      } else {
        await createMutation.mutateAsync(form);
        toast.success("Location added");
      }
      setOpen(false);
      setEditing(null);
      setForm(emptyLocation());
    } catch (error) {
      toast.error("Failed to save location");
      console.error(error);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this location? This will also delete all associated areas and models.")) return;
    
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Location deleted");
    } catch (error) {
      toast.error("Failed to delete location");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (loc: Location) => {
    setEditing(loc);
    setForm({ name: loc.name, slug: loc.slug, image: loc.image, description: loc.description });
    setOpen(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyLocation());
    setOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Locations</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={loading || saving || Boolean(deletingId)} className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <Button onClick={openNew} className="gap-2" disabled={loading || saving || Boolean(deletingId)}>
              <Plus className="h-4 w-4" /> Add Location
            </Button>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Location</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <Input placeholder="Name" value={form.name} onChange={e => { setForm(p => ({ ...p, name: e.target.value, slug: editing ? p.slug : slugify(e.target.value) })); }} />
              <Textarea placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              <Button onClick={save} className="w-full" disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : editing ? "Update" : "Add"} Location
              </Button>
            </div>
          </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="surface-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr><th className="text-left px-4 py-3 font-medium">Name</th><th className="text-left px-4 py-3 font-medium">Slug</th><th className="text-right px-4 py-3 font-medium">Actions</th></tr>
          </thead>
          <tbody>
            {loading && !locations.length ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3 text-right"><Skeleton className="h-8 w-20 ml-auto" /></td>
                </tr>
              ))
            ) : (
              locations.map(l => (
                <tr key={l.id} className="border-t">
                  <td className="px-4 py-3">{l.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">/{l.slug}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(l)} disabled={saving || Boolean(deletingId)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(l.id)} disabled={saving || Boolean(deletingId)}>
                      {deletingId === l.id ? <Loader2 className="h-3.5 w-3.5 animate-spin text-destructive" /> : <Trash2 className="h-3.5 w-3.5 text-destructive" />}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!loading && locations.length === 0 && <p className="text-center text-muted-foreground py-8">No locations yet.</p>}
      </div>
    </AdminLayout>
  );
};

export default AdminLocations;
