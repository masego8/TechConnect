// src/pages/SignUp.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import SignupForm from "@/components/signup-form";

export default function SignUp() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const fullName = (fd.get("fullName") || "").trim();
    const email = (fd.get("email") || "").trim();
    const password = fd.get("password") || "";
    const confirmPassword = fd.get("confirmPassword") || "";

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const [first_name = "", last_name = ""] = fullName.split(" ");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data?.user?.confirmation_sent_at) {
      alert("Check your email to confirm your account.");
      navigate("/login");
    } else {
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
