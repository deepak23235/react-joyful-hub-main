import { Link } from "react-router-dom";
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
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Logo" className=" h-16  w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
            Home
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
