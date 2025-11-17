
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";


import Navbar from "../components/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/admin-dashboard/components/app-sidebar";
import { SectionCards } from "../components/admin-dashboard/components/section-cards";
import { SiteHeader } from "../components/admin-dashboard/components/site-header";

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user session
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        navigate("/login"); // redirect if not logged in
      }
    }
    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };


  return (
    <div className="min-h-screen flex flex-col">
    <Navbar user={user} onLogout={handleLogout} />

      {/* Add top padding equal to header height (64px = h-16) */}
    
        <section className="px-4 py-6">
          {/* your content */}
     
   

     <SidebarProvider
          className="min-h-auto"
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 64)",
              "--header-height": "calc(var(--spacing) * 12 + 1px)"
            }
          }>
          <AppSidebar variant="sidebar" />
          <SidebarInset>
            <SiteHeader />
              <SectionCards />
          </SidebarInset>
        </SidebarProvider>

         </section>

      
    </div>
  );
}
