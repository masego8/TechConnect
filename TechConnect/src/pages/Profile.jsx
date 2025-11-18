import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProfileHeader from "../components/profile-page/components/profile-header";
import ProfileContent from "../components/profile-page/components/profile-content";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [bio,       setBio]       = useState("");
  const [location,  setLocation]  = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      setUser(user);
      setEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name,last_name,bio,location")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        setFirstName(profile.first_name || "");
        setLastName(profile.last_name || "");
        setBio(profile.bio || "");
        setLocation(profile.location || "");
      } else {
        await supabase.from("profiles").upsert({ id: user.id });
      }

      setLoading(false);
    })();
  }, []);

  const savePersonal = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        first_name: firstName,
        last_name:  lastName,
        bio,
        location,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setSaving(false);
    if (error) alert(error.message);
    else alert("Saved.");
  };

  if (loading) return null; // or loader

  return (
    <div className="container mx-auto space-y-6 px-4 py-10">
      {/* 🔵 Header now gets live data */}
      <ProfileHeader
        firstName={firstName}
        lastName={lastName}
        email={email}
        bio={bio}
        location={location}
      />

      {/* 🔵 Content edits the same data */}
      <ProfileContent
        firstName={firstName}
        lastName={lastName}
        email={email}
        bio={bio}
        location={location}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setBio={setBio}
        setLocation={setLocation}
        saving={saving}
        onSavePersonal={savePersonal}
      />
    </div>
  );
}
