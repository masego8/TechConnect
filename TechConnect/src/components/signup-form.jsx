import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { SignupForm } from "@/components/signup-form";

export default function Signup() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Get form values
    const fd = new FormData(e.currentTarget);
    const fullName = (fd.get("fullName") || "").trim();
    const email = (fd.get("email") || "").trim();
    const password = fd.get("password") || "";
    const confirmPassword = fd.get("confirmPassword") || "";

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Split full name into first/last
    const [first_name = "", last_name = ""] = fullName.split(" ");

    // Create new user in Supabase
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          full_name: fullName,
        },
        // Redirect URL (make sure your Supabase site URL matches this)
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // If email confirmations are ON, Supabase sends an email
    if (data?.user?.confirmation_sent_at) {
      alert("Check your email to confirm your account.");
      navigate("/login");
    } else {
      // Some setups allow immediate sign-in
      alert("Account created successfully!");
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <SignupForm onSubmit={onSubmit} error={error} loading={loading} />
    </div>
  );
}
