import { useState } from "react";
import { SignupForm } from "@/components/signup-form";
import { supabase } from "@/lib/supabaseClient";

export default function SignUp() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = fd.get("email");
    const password = fd.get("password");
    const confirm = fd.get("confirmPassword");
    const fullName = fd.get("fullName");

    if (password !== confirm) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,               // Supabase default min length is 6 chars
      options: {
        data: { full_name: fullName || "" }, // stored in user metadata
        emailRedirectTo: `${window.location.origin}/login` // optional: after email confirm
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // If email confirmations are ON, user must verify.
    setInfo("Check your email to confirm your account, then log in.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-2xl space-y-3">
        {info && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-2">
            {info}
          </div>
        )}
        <SignupForm onSubmit={onSubmit} error={error} loading={loading} />
      </div>
    </div>
  );
}
