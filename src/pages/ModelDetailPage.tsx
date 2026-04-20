import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactButtons from "@/components/ContactButtons";
import { fetchLocationBySlug, fetchAreaBySlug, fetchModelBySlug, createEnquiry } from "@/lib/store";
import { CheckCircle, Send, Loader2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import NotFound from "./NotFound";

const ModelDetailPage = () => {
  const { locationSlug, areaSlug, modelSlug } = useParams<{ locationSlug: string; areaSlug: string; modelSlug: string }>();
  const [location, setLocation] = useState<any>(null);
  const [area, setArea] = useState<any>(null);
  const [model, setModel] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [locationSlug, areaSlug, modelSlug]);

  const loadData = async () => {
    if (!locationSlug || !areaSlug || !modelSlug) return;
    
    try {
      const locationData = await fetchLocationBySlug(locationSlug);
      if (!locationData) {
        setLoading(false);
        return;
      }
      
      setLocation(locationData);
      const areaData = await fetchAreaBySlug(locationData.id, areaSlug);
      if (!areaData) {
        setLoading(false);
        return;
      }
      
      setArea(areaData);
      const modelData = await fetchModelBySlug(areaData.id, modelSlug);
      if (!modelData) {
        setLoading(false);
        return;
      }
      
      setModel(modelData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load model details");
    } finally {
      setLoading(false);
    }
  };

  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setSubmitting(true);
    try {
      await createEnquiry({ modelId: model.id, ...form });
      toast.success("Enquiry submitted successfully!");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Failed to submit enquiry");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
       
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
     
      </div>
    );
  }

  if (!location || !area || !model) return <NotFound />;

  return (
    <div className="flex flex-col min-h-screen">
 
      <section className="py-12 flex-1">
        <div className="container">
          <Breadcrumbs items={[
            { label: location.name, href: `/${locationSlug}` },
            { label: area.name, href: `/${locationSlug}/${areaSlug}` },
            { label: model.name },
          ]} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden aspect-[4/3]">
                <img src={model.image} alt={model.name} className="w-full h-full object-cover" />
              </div>
              {model.images.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {model.images.map((img: string, i: number) => (
                    <div key={i} className="rounded-md overflow-hidden aspect-square">
                      <img src={img} alt={`${model.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{model.name}</h1>
              
              {/* Contact Buttons */}
              <div className="flex items-center gap-3 mb-4">
                <ContactButtons phoneNumber={model.phoneNumber} size="lg" />
                <span className="text-sm text-muted-foreground">Contact us for details</span>
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">{model.description}</p>

              {/* Features */}
              <h3 className="text-lg font-display font-semibold mb-3">Features</h3>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {model.features.map((f: string) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Specs */}
              <h3 className="text-lg font-display font-semibold mb-3">Specifications</h3>
              <div className="rounded-lg border overflow-hidden mb-6">
                {Object.entries(model.specifications).map(([key, val]: [string, any], i: number) => (
                  <div key={key} className={`flex justify-between px-4 py-2.5 text-sm ${i % 2 === 0 ? "bg-muted/50" : ""}`}>
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enquiry */}
          <div className="max-w-xl mx-auto">
            <div className="rounded-lg border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-display font-bold mb-1">Send an Enquiry</h2>
              <p className="text-sm text-muted-foreground mb-6">Interested in {model.name}? Contact us or fill the form below.</p>
              <form onSubmit={handleEnquiry} className="space-y-4">
                <Input placeholder="Your Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                <Input type="email" placeholder="Email *" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                <Input placeholder="Phone *" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                <Textarea placeholder="Your message (optional)" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={4} />
                <Button type="submit" className="w-full gap-2" disabled={submitting}>
                  {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <><Send className="h-4 w-4" /> Submit Enquiry</>}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ModelDetailPage;
