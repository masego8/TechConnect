import { useState } from "react";
import { LoginForm } from "@/components/login-form";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ add this

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = fd.get("email");
    const password = fd.get("password");

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      navigate("/home"); // ✅ redirect after successful login
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <LoginForm onSubmit={onSubmit} error={error} loading={loading} />
    </div>
  );
}
