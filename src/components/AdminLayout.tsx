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
    <div className="flex min-h-screen">
      {/* Mobile toggle */}
      <button onClick={() => setOpen(!open)} className="fixed top-4 left-4 z-50 lg:hidden rounded-md bg-primary p-2 text-primary-foreground">
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transform transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 text-lg  font-bold text-sidebar-foreground">
            <MapPin className="h-5 w-5 text-sidebar-primary" />
            ModelDir
          </Link>
          <span className="text-xs text-sidebar-foreground/50">Admin Panel</span>
        </div>
        <nav className="px-3 space-y-1">
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
        <div className="p-6 md:p-8 max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
