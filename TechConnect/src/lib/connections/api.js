// src/lib/connections/api.js
import { supabase } from "@/lib/supabaseClient";

// --------------------
// Send connection request
// --------------------
export async function sendConnectionRequest(receiverId) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Not authenticated");

  // Optional: check for existing connection
  const { data: existing, error: existingError } = await supabase
    .from("connections")
    .select("*")
    .or(
      `and(requester_id.eq.${user.id},receiver_id.eq.${receiverId}),and(requester_id.eq.${receiverId},receiver_id.eq.${user.id})`
    )
    .maybeSingle();

  if (existingError && existingError.code !== "PGRST116") {
    throw existingError;
  }

  if (existing) {
    if (existing.status === "pending") throw new Error("Request already pending");
    if (existing.status === "accepted") throw new Error("Already connected");
  }

  const { error } = await supabase.from("connections").insert({
    requester_id: user.id,
    receiver_id: receiverId,
    status: "pending",
  });

  if (error) throw error;

  return true;
}

// --------------------
// Get incoming requests
// --------------------
export async function getIncomingRequests() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("connections")
    .select("*")
    .eq("receiver_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// --------------------
// Respond to request (accept/decline)
// --------------------
export async function respondToRequest(connectionId, newStatus) {
  if (!["accepted", "declined"].includes(newStatus)) {
    throw new Error("Invalid status");
  }

  const { error } = await supabase
    .from("connections")
    .update({ status: newStatus })
    .eq("id", connectionId);

  if (error) throw error;

  return true;
}

// --------------------
// Get accepted connections
// --------------------
export async function getConnections() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("connections")
    .select("*")
    .eq("status", "accepted")
    .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

  if (error) throw error;

  // Map results to the “other person”
  return data.map((row) => ({
    connectionId: row.id,
    otherUserId: row.requester_id === user.id ? row.receiver_id : row.requester_id,
    created_at: row.created_at,
  }));
}

