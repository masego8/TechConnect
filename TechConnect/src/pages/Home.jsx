import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";

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
      {/* Navbar */}
      <header className="border-b bg-background/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-primary">TechConnect</h1>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
            )}
            <Button variant="outline" onClick={handleLogout} style={{backgroundColor: 'grey'}}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Welcome to TechConnect 👋</h2>
          <p className="text-muted-foreground">
            Connect with mentors, explore projects, and grow your tech career.
          </p>
        </section>

        {/* Feature Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card >
            <CardHeader>
              <CardTitle>Mentorship</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Find experienced developers and get one-on-one mentorship.</p>
            </CardContent>
          </Card>

          <Card onClick="">
            <CardHeader>
              <CardTitle>Portfolio Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Get your projects reviewed and receive valuable feedback.</p>
            </CardContent>
          </Card>

          <Card onClick="">
            <CardHeader>
              <CardTitle>Career Guidance</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Access resources and tips to take your tech career further.</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} TechConnect. All rights reserved.
      </footer>
    </div>
  );
}
