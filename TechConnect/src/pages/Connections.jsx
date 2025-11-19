import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  getIncomingRequests,
  getConnections,
  respondToRequest,
} from "@/lib/connections/api";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Users, UserPlus, Clock3 } from "lucide-react";

export default function ConnectionsPage() {
  const [pending, setPending] = useState([]);        // incoming requests
  const [connections, setConnections] = useState([]); // accepted connections (with otherUserId)
  const [profilesById, setProfilesById] = useState({}); // { userId: profileRow }
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setError("");
        setLoading(true);

        // 1) Get pending + accepted connections
        const [pendingData, connectionsData] = await Promise.all([
          getIncomingRequests(),
          getConnections(),
        ]);

        setPending(pendingData || []);
        setConnections(connectionsData || []);

        // 2) Collect all user IDs we need profiles for
        const ids = new Set();

        (pendingData || []).forEach((req) => {
          ids.add(req.requester_id);
        });

        (connectionsData || []).forEach((c) => {
          ids.add(c.otherUserId);
        });

        if (ids.size > 0) {
          const { data: profiles, error: profileError } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, location")
            .in("id", Array.from(ids));

          if (profileError) throw profileError;

          const dict = {};
          (profiles || []).forEach((p) => {
            dict[p.id] = p;
          });
          setProfilesById(dict);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load connections.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRespond = async (connectionId, newStatus) => {
    try {
      setActionLoadingId(connectionId);
      setError("");
      await respondToRequest(connectionId, newStatus);

      if (newStatus === "accepted") {
        // Move from pending → connections
        const req = pending.find((p) => p.id === connectionId);
        if (req) {
          setPending((prev) => prev.filter((p) => p.id !== connectionId));
          setConnections((prev) => [
            ...prev,
            {
              connectionId,
              otherUserId: req.requester_id,
              created_at: req.created_at,
            },
          ]);
        }
      } else {
        // declined: just remove from pending
        setPending((prev) => prev.filter((p) => p.id !== connectionId));
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update request.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderName = (userId) => {
    const p = profilesById[userId];
    if (!p) return "User";
    const name = [p.first_name, p.last_name].filter(Boolean).join(" ");
    return name || "User";
  };

  const renderInitials = (userId) => {
    const name = renderName(userId);
    const parts = name.trim().split(/\s+/);
    return (parts[0]?.[0] || "").concat(parts[1]?.[0] || "").toUpperCase() || "U";
  };

  const hasPending = useMemo(() => pending.length > 0, [pending]);
  const hasConnections = useMemo(() => connections.length > 0, [connections]);

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-7 w-7" />
          Connections
        </h1>
        <p className="text-muted-foreground">
          Manage your TechConnect network: review connection requests and see who you’re connected with.
        </p>
      </header>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Requests{" "}
            {hasPending && (
              <Badge variant="secondary" className="ml-2">
                {pending.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="connections">
            Connections{" "}
            {hasConnections && (
              <Badge variant="secondary" className="ml-2">
                {connections.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Pending Requests */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>
                People who want to connect with you. Accept or decline their requests.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading && (
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                </div>
              )}

              {!loading && pending.length === 0 && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  No pending requests right now.
                </div>
              )}

              {!loading &&
                pending.map((req) => {
                  const p = profilesById[req.requester_id];
                  return (
                    <div
                      key={req.id}
                      className="flex items-center justify-between rounded-lg border px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {p?.avatar_url ? (
                            <AvatarImage src={p.avatar_url} alt={renderName(req.requester_id)} />
                          ) : (
                            <AvatarImage src="" alt={renderName(req.requester_id)} />
                          )}
                          <AvatarFallback>{renderInitials(req.requester_id)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{renderName(req.requester_id)}</div>
                          {p?.job_title && (
                            <div className="text-xs text-muted-foreground">{p.job_title}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoadingId === req.id}
                          onClick={() => handleRespond(req.id, "declined")}
                        >
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          disabled={actionLoadingId === req.id}
                          onClick={() => handleRespond(req.id, "accepted")}
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connections */}
        <TabsContent value="connections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Connections</CardTitle>
              <CardDescription>
                People you’re connected with on TechConnect.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="h-24 bg-muted rounded animate-pulse" />
                  <div className="h-24 bg-muted rounded animate-pulse" />
                </div>
              )}

              {!loading && connections.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  You don’t have any connections yet. Start by sending connection requests from
                  people’s profiles.
                </p>
              )}

              {!loading && connections.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {connections.map((c) => {
                    const p = profilesById[c.otherUserId];
                    return (
                      <div
                        key={c.connectionId || `${c.otherUserId}-${c.created_at}`}
                        className="flex items-center gap-3 rounded-lg border px-3 py-2"
                      >
                        <Avatar>
                          {p?.avatar_url ? (
                            <AvatarImage src={p.avatar_url} alt={renderName(c.otherUserId)} />
                          ) : (
                            <AvatarImage src="" alt={renderName(c.otherUserId)} />
                          )}
                          <AvatarFallback>{renderInitials(c.otherUserId)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">{renderName(c.otherUserId)}</div>
                          {p?.job_title && (
                            <div className="text-xs text-muted-foreground">
                              {p.job_title}
                            </div>
                          )}
                          {p?.location && (
                            <div className="text-xs text-muted-foreground">
                              {p.location}
                            </div>
                          )}
                        </div>
                        {/* Space for "View profile" / "Message" later */}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
