import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MapPin, Map, Box, FileText, Menu, X, LayoutDashboard } from "lucide-react";

const adminNav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Locations", icon: MapPin, href: "/admin/locations" },
  { label: "Areas", icon: Map, href: "/admin/areas" },
  { label: "Models", icon: Box, href: "/admin/models" },
  { label: "Enquiries", icon: FileText, href: "/admin/enquiries" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile toggle */}
      <button onClick={() => setOpen(!open)} className="fixed left-4 top-4 z-50 rounded-md border bg-card p-2 text-foreground shadow-sm lg:hidden">
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open && <button aria-label="Close sidebar overlay" className="fixed inset-0 z-30 bg-foreground/30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="border-b border-sidebar-border p-6">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-sidebar-foreground">
            <MapPin className="h-5 w-5 text-sidebar-primary" />
            ModelDir
          </Link>
          <span className="mt-1 block text-xs uppercase tracking-wide text-sidebar-foreground/55">Admin Panel</span>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {adminNav.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 lg:ml-64">
        <div className="mx-auto w-full max-w-6xl p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
