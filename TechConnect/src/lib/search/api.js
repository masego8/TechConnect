// src/lib/search/api.js
import { supabase } from "@/lib/supabaseClient";

/**
 * Search profiles by name or skill.
 * `query` is a string (e.g. "react" or "john")
 */
export async function searchProfilesByNameOrSkill(query) {
  if (!query || !query.trim()) return [];

  const q = query.trim();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, bio, skills, job_title, location, avatar_url")
    .or(`
      first_name.ilike.*${q}*,
      last_name.ilike.*${q}*,
      skills.cs.{${q}}
    `)
    .limit(20);

  if (error) throw error;
  return data || [];
}
