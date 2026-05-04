import React, { useState, useEffect, } from "react";
import AdminLayout from "@/components/AdminLayout";
import { fetchAreas, createArea, updateArea, deleteArea, fetchLocations } from "@/lib/store";
import { Area, Location } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import slugify from "slugify"



const emptyArea = (): Omit<Area, "id"> => ({ locationId: "", name: "", slug: "", image: "", description: "" });

const AdminAreas = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [editing, setEditing] = useState<Area | null>(null);
  const [form, setForm] = useState(emptyArea());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [areasData, locationsData] = await Promise.all([
        fetchAreas(),
        fetchLocations(),
      ]);
      setAreas(areasData);
      setLocations(locationsData);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!form.name || !form.slug || !form.locationId) { toast.error("All fields required"); return; }
   
    setSaving(true);
    
    try {
      if (editing) {
        await updateArea(editing.id, {...form,image:""});
        toast.success("Area updated");
      } else {
        await createArea({...form,image:""});
        toast.success("Area added");
      }
      setOpen(false);
      setEditing(null);
      setForm(emptyArea());
      await loadData();
    } catch (error) {
      toast.error("Failed to save area");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this area? This will also delete all associated models.")) return;
    
    try {
      await deleteArea(id);
      setAreas(areas.filter(a => a.id !== id));
      toast.success("Area deleted");
    } catch (error) {
      toast.error("Failed to delete area");
      console.error(error);
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
        <h1 className="text-2xl  font-bold">Areas</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> Add Area</Button>
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
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr><th className="text-left px-4 py-3 font-medium">Name</th><th className="text-left px-4 py-3 font-medium">Location</th><th className="text-left px-4 py-3 font-medium">Slug</th><th className="text-right px-4 py-3 font-medium">Actions</th></tr>
          </thead>
          <tbody>
            {areas.map(a => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-3">{a.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{locName(a.locationId)}</td>
                <td className="px-4 py-3 text-muted-foreground">/{a.slug}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(a)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(a.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {areas.length === 0 && <p className="text-center text-muted-foreground py-8">No areas yet.</p>}
      </div>
    </AdminLayout>
  );
};

export default AdminAreas;
