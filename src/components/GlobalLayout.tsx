import React,{useState,useEffect} from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { setUserSession } from '@/redux/features/authSlice';
import { useAppDispatch } from '@/redux';
import { Outlet } from 'react-router-dom';

const GlobalLayout = () => {
      const [session, setSession] = useState<Session | null>(null);
      const [loading, setLoading] = useState(true);
     const dispatch = useAppDispatch()
      
    
      useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
          setLoading(false);
          dispatch(setUserSession(session))
        });
    
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          setLoading(false);
          dispatch(setUserSession(session))
        });
    
        return () => subscription.unsubscribe();
      }, []);
    return (
        <>
            <Navbar />
            <Outlet/>
            <Footer />
        </>
    )
}

export default GlobalLayout
