import { Button } from "@/components/ui/button";
import { Construction, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UnderConstruction() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-6">
      <div className="flex flex-col items-center space-y-6 max-w-md">
        {/* Icon */}
        <div className="bg-muted rounded-full p-6">
          <Construction className="h-12 w-12 text-primary" />
        </div>

        {/* Headings */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Page Under Construction 🚧</h1>
          <p className="text-muted-foreground text-sm">
            We're working hard to bring this page to life. Check back soon for updates.
          </p>
        </div>

        {/* Optional ETA */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Expected launch: Coming soon</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-6">
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => navigate("/home")}>
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
