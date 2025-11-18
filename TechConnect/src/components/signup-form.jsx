// src/components/signup-form.jsx

export default function SignupForm({ onSubmit, error, loading }) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md space-y-4 bg-card p-6 rounded-lg shadow"
    >
      <div className="space-y-2">
        <label htmlFor="fullName" className="block text-sm font-medium">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          className="w-full border rounded px-3 py-2"
          placeholder="John Doe"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full border rounded px-3 py-2"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded bg-primary text-primary-foreground disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}
