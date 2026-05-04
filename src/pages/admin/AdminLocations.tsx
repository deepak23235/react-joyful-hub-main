import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { fetchLocations, createLocation, updateLocation, deleteLocation } from "@/lib/store";
import { Location } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import slugify from "slugify"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const emptyLocation = (): Omit<Location, "id"> => ({ name: "", slug: "", image: "", description: "" });

const AdminLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [editing, setEditing] = useState<Location | null>(null);
  const [form, setForm] = useState(emptyLocation());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const data = await fetchLocations();
      setLocations(data);
    } catch (error) {
      toast.error("Failed to load locations");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!form.name || !form.slug) { toast.error("Name and slug are required"); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateLocation(editing.id, form);
        toast.success("Location updated");
      } else {
        await createLocation(form);

        toast.success("Location added");
      }
      setOpen(false);
      setEditing(null);
      setForm(emptyLocation());
      await loadLocations();
    } catch (error) {
      toast.error("Failed to save location");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this location? This will also delete all associated areas and models.")) return;
    
    try {
      await deleteLocation(id);
      setLocations(locations.filter(l => l.id !== id));
      toast.success("Location deleted");
    } catch (error) {
      toast.error("Failed to delete location");
      console.error(error);
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl  font-bold">Locations</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> Add Location</Button>
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
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr><th className="text-left px-4 py-3 font-medium">Name</th><th className="text-left px-4 py-3 font-medium">Slug</th><th className="text-right px-4 py-3 font-medium">Actions</th></tr>
          </thead>
          <tbody>
            {locations.map(l => (
              <tr key={l.id} className="border-t">
                <td className="px-4 py-3">{l.name}</td>
                <td className="px-4 py-3 text-muted-foreground">/{l.slug}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(l)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(l.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {locations.length === 0 && <p className="text-center text-muted-foreground py-8">No locations yet.</p>}
      </div>
    </AdminLayout>
  );
};

export default AdminLocations;
