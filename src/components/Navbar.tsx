import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, LogOut, Menu, Navigation } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux";
import { supabase } from "@/lib/supabase";
import { setUserSession } from "@/redux/features/authSlice";
import { useAreas, useLocations } from "@/hooks/use-queries";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const isLoggedIn = useAppSelector((state) => state.authSlice.isLoggedIn);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { data: locations = [] } = useLocations();
  const { data: areas = [] } = useAreas();
  const [locationsOpen, setLocationsOpen] = useState(false);

  const isActive = (path: string) => pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
  const areaLinks = (locationId: string) => areas.filter((area) => area.locationId === locationId).slice(0, 6);

  const signOut = () => {
    supabase.auth.signOut().then(() => dispatch(setUserSession(null))).catch(() => undefined);
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur" aria-label="Primary navigation">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex shrink-0 items-center" aria-label="Finder Girls Near Me home">
          <img src="/logo.png" alt="Finder Girls Near Me" width="160" height="64" className="h-14 w-auto object-contain" />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <Link to="/" aria-current={pathname === "/" ? "page" : undefined} className={cn("rounded-md px-3 py-2 text-sm font-medium hover:bg-muted", pathname === "/" ? "text-accent" : "text-muted-foreground")}>Home</Link>
          <div className="relative" onMouseLeave={() => setLocationsOpen(false)}>
            <button type="button" onClick={() => setLocationsOpen((open) => !open)} onMouseEnter={() => setLocationsOpen(true)} aria-expanded={locationsOpen} aria-controls="desktop-location-menu" className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              Locations <ChevronDown className="h-4 w-4" />
            </button>
            {locationsOpen && (
              <div id="desktop-location-menu" className="absolute right-0 top-full w-[min(900px,85vw)] rounded-xl border bg-popover p-5 shadow-2xl">
                <div className="mb-4 flex items-center justify-between border-b pb-3">
                  <p className="font-semibold">Browse all live locations</p>
                  <a href="/#browse-by-location" className="text-sm text-accent hover:underline">All Locations / Near Me</a>
                </div>
                <div className="grid max-h-[65vh] grid-cols-2 gap-6 overflow-y-auto xl:grid-cols-3">
                  {locations.map((location) => (
                    <div key={location.id}>
                      <Link to={`/${location.slug}`} onClick={() => setLocationsOpen(false)} aria-current={isActive(`/${location.slug}`) ? "page" : undefined} className={cn("font-semibold hover:text-accent", isActive(`/${location.slug}`) && "text-accent")}>{location.name}</Link>
                      <ul className="mt-2 space-y-1">
                        {areaLinks(location.id).map((area) => (
                          <li key={area.id}><Link to={`/${location.slug}/${area.slug}`} onClick={() => setLocationsOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">{area.name}</Link></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link to="/about-us" aria-current={pathname === "/about-us" ? "page" : undefined} className={cn("rounded-md px-3 py-2 text-sm font-medium hover:bg-muted", pathname === "/about-us" ? "text-accent" : "text-muted-foreground")}>About</Link>
          <a href="/#faqs" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">FAQ</a>
          {isLoggedIn && <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="mr-2 h-4 w-4" /> Sign out</Button>}
        </div>

        <Sheet>
          <SheetTrigger asChild><Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></Button></SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader><SheetTitle>Menu</SheetTitle></SheetHeader>
            <div className="mt-6 space-y-2">
              <SheetClose asChild><Link to="/" className="block rounded-md px-3 py-2 font-medium hover:bg-muted">Home</Link></SheetClose>
              <details className="rounded-md border" open>
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-3 font-medium">Locations <ChevronDown className="h-4 w-4" /></summary>
                <div className="space-y-3 border-t p-3">
                  <SheetClose asChild><a href="/#browse-by-location" className="flex items-center gap-2 text-sm font-medium text-accent"><Navigation className="h-4 w-4" /> All Locations / Near Me</a></SheetClose>
                  {locations.map((location) => (
                    <details key={location.id} className="rounded-md bg-muted/40 p-2">
                      <summary className={cn("cursor-pointer font-medium", isActive(`/${location.slug}`) && "text-accent")}>{location.name}</summary>
                      <div className="mt-2 space-y-2 border-l pl-3">
                        <SheetClose asChild><Link to={`/${location.slug}`} className="block text-sm font-medium">View all in {location.name}</Link></SheetClose>
                        {areaLinks(location.id).map((area) => <SheetClose asChild key={area.id}><Link to={`/${location.slug}/${area.slug}`} className="block text-sm text-muted-foreground">{area.name}</Link></SheetClose>)}
                      </div>
                    </details>
                  ))}
                </div>
              </details>
              <SheetClose asChild><Link to="/about-us" className="block rounded-md px-3 py-2 font-medium hover:bg-muted">About</Link></SheetClose>
              <SheetClose asChild><a href="/#faqs" className="block rounded-md px-3 py-2 font-medium hover:bg-muted">FAQ</a></SheetClose>
              {isLoggedIn && <Button variant="ghost" className="w-full justify-start" onClick={signOut}>Sign out</Button>}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
