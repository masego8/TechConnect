
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
      <section className="px-0 py-6">
        <div className="flex gap-6 mt-6 items-start">
          <SidebarProvider className="h-screen flex-none" style={{ "--sidebar-width": "150px", width: "150px" }}>
            <AppSidebar variant="sidebar" />
          </SidebarProvider>
          <div className="flex flex-col w-300">
            <Card className="w-full shadow-md mt-8 mb-6">
              <CardHeader>
                <CardTitle>Welcome!</CardTitle>
              </CardHeader>
              <CardContent>
                TechConnect is a website designed to connect professionals, please take a look around.
              </CardContent>
            </Card>
            <div className="flex gap-4">
              <Card className="flex-1 shadow-md">
                <CardHeader>
                  <CardTitle>Expert Search</CardTitle>
                </CardHeader>
                <CardContent>
                  Use our search function to find experts in the field and view their experience
                </CardContent>
              </Card>

              <Card className="flex-1 shadow-md">
                <CardHeader>
                  <CardTitle>1 on 1s</CardTitle>
                </CardHeader>
                <CardContent>
                  Arrange 1 on 1s as soon as required by checking the Availability
                </CardContent>
              </Card>

              <Card className="flex-1 shadow-md">
                <CardHeader>
                  <CardTitle>Card 3</CardTitle>
                </CardHeader>
                <CardContent>
                  content…
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
