import { Link } from "react-router-dom";
import { MapPin, Settings } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux";
import { supabase } from "@/lib/supabase";
import { setUserSession } from "@/redux/features/authSlice";

const Navbar = () => {
  const isLoggedIn = useAppSelector(state=>state.authSlice.isLoggedIn)
  const dispatch =useAppDispatch() 
  const signOut = ()=>{
    supabase.auth.signOut()
    .then(()=>{
      dispatch(setUserSession(null))
    })
    .catch(err=>{

    })
  }
  return (
      <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
    <div className="container flex h-16 items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold  text-foreground">
        <MapPin className="h-5 w-5 text-accent" />
        ModelDir
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Home
        </Link>
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Settings className="h-3.5 w-3.5" />
          Admin
        </Link>

       {isLoggedIn && <button onClick={signOut}>signout</button>}
      </div>
    </div>
  </nav>
  )
};

export default Navbar;
