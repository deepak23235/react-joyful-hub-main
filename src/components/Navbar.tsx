import { Link } from "react-router-dom";
import { MapPin, Settings } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux";
import { supabase } from "@/lib/supabase";
import { setUserSession } from "@/redux/features/authSlice";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const isLoggedIn = useAppSelector((state) => state.authSlice.isLoggedIn);
  const dispatch = useAppDispatch();

  const signOut = () => {
    supabase.auth.signOut()
      .then(() => {
        dispatch(setUserSession(null));
      })
      .catch(() => {
      });
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-lg font-semibold text-foreground">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-accent/15">
            <MapPin className="h-4 w-4 text-accent" />
          </span>
          ModelDir
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
            Home
          </Link>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:translate-y-[-1px] hover:bg-primary/90"
          >
            <Settings className="h-3.5 w-3.5" />
            Admin
          </Link>
          {isLoggedIn && (
            <Button variant="ghost" size="sm" onClick={signOut}>
              Sign out
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
