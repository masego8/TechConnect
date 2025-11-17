import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Shield, Key, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function ProfileContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  // Personal tab (controlled inputs)
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
        // seed a blank row (optional)
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

  const changePassword = async () => {
    const pw = prompt("Enter new password (min 6 chars):");
    if (!pw) return;
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) alert(error.message); else alert("Password updated.");
  };

  const deleteAccount = async () => {
    alert("Delete account requires a server-side function (service role). Add later.");
  };

  if (loading) return null;

  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="availability">Availability</TabsTrigger>
      </TabsList>

      {/* Personal Information */}
      <TabsContent value="personal" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and profile information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={4} value={bio} onChange={(e)=>setBio(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={location} onChange={(e)=>setLocation(e.target.value)} />
            </div>

            <div className="flex justify-end">
              <Button onClick={savePersonal} disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Account Settings */}
      <TabsContent value="account" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Account Status</Label>
                <p className="text-muted-foreground text-sm">Your account is currently active</p>
              </div>
              <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Delete Account</Label>
                <p className="text-muted-foreground text-sm">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="destructive" onClick={deleteAccount}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Security Settings */}
      <TabsContent value="security" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Password</Label>
                <p className="text-muted-foreground text-sm">Change your password</p>
              </div>
              <Button variant="outline" onClick={changePassword}>
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Two-Factor Authentication</Label>
                <p className="text-muted-foreground text-sm">Add extra security</p>
              </div>
              <Button variant="outline" size="sm" disabled>Configure</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Availability (spelling fixed) */}
      <TabsContent value="availability" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Availability Settings</CardTitle>
            <CardDescription>Set your availability for Connections.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-sm">
              TODO: add fields (e.g., weekdays, time windows) and save to profiles.
            </p>
            <Separator />
            <Button variant="outline" disabled>Change Availability</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
