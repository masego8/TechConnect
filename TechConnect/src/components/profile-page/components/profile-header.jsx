import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Calendar, Mail, MapPin } from "lucide-react";

export default function ProfileHeader({
  firstName,
  lastName,
  email,
  bio,
  location,
}) {
  const initials =
    (firstName?.[0] || "").toUpperCase() +
    (lastName?.[0] || "").toUpperCase();

  const displayName =
    firstName || lastName
      ? `${firstName || ""} ${lastName || ""}`.trim()
      : "New user";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              {/* you can later swap this to a user-uploaded avatar URL */}
              <AvatarImage
                src="https://bundui-images.netlify.app/avatars/08.png"
                alt={displayName}
              />
              <AvatarFallback className="text-2xl">
                {initials || "?"}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
            >
              <Camera />
            </Button>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">{displayName}</h1>
            </div>

            {/* bio from Supabase */}
            {bio && (
              <p className="text-muted-foreground">
                {bio}
              </p>
            )}

            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              {email && (
                <div className="flex items-center gap-1">
                  <Mail className="size-4" />
                  {email}
                </div>
              )}

              {location && (
                <div className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  {location}
                </div>
              )}

              {/* you can wire this to created_at later; leaving static or removing for now */}
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                Joined TechConnect
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
