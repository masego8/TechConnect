import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
    });
  }, []);

  const handleSearch = async () => {
    setError("");

    if (!query.trim()) return;
    const q = query.trim();
    if (!user) {
      setError("You must be logged in to search.");
      return;
    }

    setLoadingSearch(true);
    try {
      const { data, error: searchError } = await supabase
        .from("profiles")
        .select("*")
        .or(`first_name.ilike.*${q}*,last_name.ilike.*${q}*,skills.cs.{${q}}`)
;

      if (searchError) throw searchError;

      const profiles = data || [];

      // Add connection status
      const enriched = await Promise.all(
        profiles.map(async (profile) => {
          if (profile.id === user.id) {
            return { ...profile, connection_status: "self" };
          }

          const status = await getConnectionStatus(user.id, profile.id);
          return { ...profile, connection_status: status };
        })
      );

      setResults(enriched);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to search profiles.");
      setResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  async function sendRequest(receiverId) {
    if (!user) return;
    setError("");

    // ⚠ Make sure these column names match your table:
    // use requester_id / receiver_id if that's what you're using in Supabase
    const { error } = await supabase.from("connections").insert({
      requester_id: user.id,
      receiver_id: receiverId,
      status: "pending",
    });

    if (error) {
      console.error(error);
      setError(error.message || "Failed to send request.");
      return;
    }

    // Refresh search results so status updates
    await handleSearch();
  }

  async function acceptRequest(otherUserId) {
    if (!user) return;
    setError("");

    // Find the pending connection where THEY requested YOU
    const { data, error } = await supabase
      .from("connections")
      .select("id")
      .eq("requester_id", otherUserId)
      .eq("receiver_id", user.id)
      .eq("status", "pending")
      .maybeSingle();

    if (error) {
      console.error(error);
      setError(error.message || "Failed to find request.");
      return;
    }
    if (!data) {
      setError("No pending request found to accept.");
      return;
    }

    const { error: updateError } = await supabase
      .from("connections")
      .update({ status: "accepted" })
      .eq("id", data.id);

    if (updateError) {
      console.error(updateError);
      setError(updateError.message || "Failed to accept request.");
      return;
    }

    // Refresh search
    await handleSearch();
  }

  return (
    <div className="w-full max-w-3xl mt-10 mx-10 min-h-screen flex flex-col justify-top space-y-6">
      <h1 className="text-3xl font-bold">Find People</h1>

      <div className="flex gap-3">
        <Input
          placeholder="Search by name or skill (e.g. React)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loadingSearch}>
          {loadingSearch ? "Searching..." : "Search"}
        </Button>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {results.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-lg">
                  {p.first_name} {p.last_name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {p.bio || "No bio available"}
                </p>
                {p.skills?.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {p.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-1 bg-muted rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Connection Buttons */}
              {p.connection_status === "self" && (
                <span className="text-xs text-muted-foreground">This is you</span>
              )}

              {p.connection_status === "connected" && (
                <span className="text-green-600 font-medium">Connected</span>
              )}

              {p.connection_status === "pending_sent" && (
                <span className="text-yellow-600 font-medium">Request Sent</span>
              )}

              {p.connection_status === "pending_received" && (
                <Button size="sm" onClick={() => acceptRequest(p.id)}>
                  Accept Request
                </Button>
              )}

              {p.connection_status === "none" && (
                <Button size="sm" onClick={() => sendRequest(p.id)}>
                  Connect
                </Button>
              )}
            </CardContent>
          </Card>
        ))}

        {!loadingSearch && results.length === 0 && !error && query.trim() && (
          <p className="text-sm text-muted-foreground">No users found.</p>
        )}
      </div>
    </div>
  );
}

// Helper function for connection status
async function getConnectionStatus(currentId, otherId) {
  const { data, error } = await supabase
    .from("connections")
    .select("*")
    .or(`
      and(requester_id.eq.${currentId},receiver_id.eq.${otherId}),
      and(requester_id.eq.${otherId},receiver_id.eq.${currentId})
    `)
    .maybeSingle();

  if (error) {
    console.error(error);
    return "none";
  }

  if (!data) return "none";
  if (data.status === "accepted") return "connected";
  if (data.status === "pending" && data.requester_id === currentId)
    return "pending_sent";
  if (data.status === "pending" && data.requester_id !== currentId)
    return "pending_received";

  return "none";
}
