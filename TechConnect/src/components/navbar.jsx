// src/components/Navbar.jsx
import { Button } from "@/components/ui/button";

export default function Navbar({ user, onLogout }) {
  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50
        w-full border-b bg-background/60 backdrop-blur-sm
      "
      style={{ height: "64px" }} // ~h-16
    >
      {/* Full-width content. Remove max-w-* to truly span edge-to-edge */}
      <div className="w-full px-4 flex items-center justify-between h-full">
        <h1 className="text-2xl font-bold text-primary">TechConnect</h1>

        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-muted-foreground">{user.email}</span>
          )}
          <Button
            variant="outline"
            onClick={onLogout}
            className="bg-gray-500 text-white hover:bg-gray-600"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
