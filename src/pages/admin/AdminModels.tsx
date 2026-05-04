import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { fetchModels, createModel, updateModel, deleteModel, fetchAreas, fetchLocations } from "@/lib/store";
import { Model, Area, Location } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadFilesAndGetUrls } from "@/lib/utils";
import slugify from "slugify"
import ImagePreviewList, { ItemType } from "@/components/ImagePreviewList";

const emptyModel = (): Omit<Model, "id"> => ({
  areaId: "", name: "", slug: "", image: "", images: [], shortDescription: "", description: "", phoneNumber: "", features: [], specifications: {},
});

const AdminModels = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [editing, setEditing] = useState<Model | null>(null);
  const [form, setForm] = useState(emptyModel());
  const [featuresStr, setFeaturesStr] = useState("");
  const [specsStr, setSpecsStr] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedUploads,setSelectedUploads] = useState<FileList|[]>([]) 
  const inputRef = useRef<HTMLInputElement>(null)


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [modelsData, areasData, locationsData] = await Promise.all([
        fetchModels(),
        fetchAreas(),
        fetchLocations(),
      ]);
      setModels(modelsData);
      setAreas(areasData);
      setLocations(locationsData);
      
      // Pre-populate features and specs for editing
      if (editing) {
        const currentModel = modelsData.find(m => m.id === editing.id);
        if (currentModel) {
          setFeaturesStr(currentModel.features.join(", "));
          setSpecsStr(Object.entries(currentModel.specifications).map(([k, v]) => `${k}:${v}`).join(", "));
        }
      }
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!form.name || !form.slug || !form.areaId) { toast.error("Name, slug and area required"); return; }
    let urls:string[] =[]
 
    if (selectedUploads.length) {
      urls = await uploadFilesAndGetUrls(selectedUploads);
    }
    setSaving(true);
    try {
      const features = featuresStr.split(",").map(f => f.trim()).filter(Boolean);
      const specifications: Record<string, string> = {};
      specsStr.split(",").forEach(pair => {
        const [k, v] = pair.split(":").map(s => s.trim());
        if (k && v) specifications[k] = v;
      });
      const final = { ...form, features, specifications, images:urls };
      if (editing) {
        await updateModel(editing.id, {...final,images:[...form.images,...urls]});
        toast.success("Model updated");
      } else {
        await createModel(final);
        toast.success("Model added");
      }
      setOpen(false);
      setEditing(null);
      setForm(emptyModel());
      setFeaturesStr("");
      setSpecsStr("");
      await loadData();
    } catch (error) {
      toast.error("Failed to save model");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this model?")) return;
    
    try {
      await deleteModel(id);
      setModels(models.filter(m => m.id !== id));
      toast.success("Model deleted");
    } catch (error) {
      toast.error("Failed to delete model");
      console.error(error);
    }
  };

  const openEdit = (m: Model) => {
    setEditing(m);
    setForm({ areaId: m.areaId, name: m.name, slug: m.slug, image: m.image, images: m.images, shortDescription: m.shortDescription, description: m.description, phoneNumber: m.phoneNumber, features: m.features, specifications: m.specifications });
    setFeaturesStr(m.features.join(", "));
    setSpecsStr(Object.entries(m.specifications).map(([k, v]) => `${k}:${v}`).join(", "));
    setOpen(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyModel());
    setFeaturesStr("");
    setSpecsStr("");
    setOpen(true);
  };

  const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
   setSelectedUploads(files)
  }
  const areaName = (id: string) => {
    const area = areas.find(a => a.id === id);
    const loc = locations.find(l => l.id === area?.locationId);
    return area ? `${loc?.name || ""} → ${area.name}` : "—";
  };

  const handleRemove = (index: number,previewType:ItemType) => {
    const dataTransfer  = new DataTransfer()
    Array.from(selectedUploads).forEach(((file,idx)=>{
      if (index!==idx) {
        dataTransfer.items.add(file)
      }
    }))
    console.log("working",previewType,index)
    if (previewType==="url") {
      setForm(p => ({...p,images:p.images.filter((url,idx)=>idx!==index)}))
    }
    inputRef.current.files = dataTransfer.files
    setSelectedUploads(dataTransfer.files)
  }

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
        <h1 className="text-2xl font-display font-bold">Models</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> Add Model</Button>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Model</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <Select value={form.areaId} onValueChange={v => setForm(p => ({ ...p, areaId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select Area" /></SelectTrigger>
                <SelectContent>{areas.map(a => <SelectItem key={a.id} value={a.id}>{areaName(a.id)}</SelectItem>)}</SelectContent>
              </Select>
              <Input placeholder="Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: editing ? p.slug : slugify(e.target.value) }))} />
              <Input ref={inputRef} placeholder="Upload Image" type="file" multiple onChange={handleFileChange} />
              <ImagePreviewList urls={form.images} files={ editing? []:selectedUploads} onRemove={handleRemove} />
              <Input placeholder="Phone Number (e.g. +919876543210)" value={form.phoneNumber} onChange={e => setForm(p => ({ ...p, phoneNumber: e.target.value }))} />
              <Input placeholder="Short Description" value={form.shortDescription} onChange={e => setForm(p => ({ ...p, shortDescription: e.target.value }))} />
              <Textarea placeholder="Full Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} />
              <Input placeholder="Features (comma separated)" value={featuresStr} onChange={e => setFeaturesStr(e.target.value)} />
              <Input placeholder="Specs (Key:Value, comma separated)" value={specsStr} onChange={e => setSpecsStr(e.target.value)} />
              <Button onClick={save} className="w-full" disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : editing ? "Update" : "Add"} Model
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr><th className="text-left px-4 py-3 font-medium">Name</th><th className="text-left px-4 py-3 font-medium">Area</th><th className="text-left px-4 py-3 font-medium">Phone</th><th className="text-right px-4 py-3 font-medium">Actions</th></tr>
          </thead>
          <tbody>
            {models.map(m => (
              <tr key={m.id} className="border-t">
                <td className="px-4 py-3">{m.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{areaName(m.areaId)}</td>
                <td className="px-4 py-3">{m.phoneNumber}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(m)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(m.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {models.length === 0 && <p className="text-center text-muted-foreground py-8">No models yet.</p>}
      </div>
    </AdminLayout>
  );
};

export default AdminModels;
