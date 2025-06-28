"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validate = () => {
    const newErrors: typeof error = {};
    if (!email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError({});
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/profile");
    } catch (error: any) {
      setError({ general: error.message || "Failed to sign in" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-[var(--color-primary)] px-6">
      <form
        onSubmit={handleSignIn}
        noValidate
        className="bg-[var(--color-secondary)] w-full max-w-md p-10 rounded-3xl shadow-xl space-y-6 transition-colors duration-300 min-h-[560px] flex flex-col justify-between"
      >
        <h2 className="text-4xl font-extrabold text-center text-[var(--color-accent)] select-none mb-2">
          Reach Your Goals
        </h2>
        <p className="text-center text-base text-[var(--color-primary)] ">
          Sign in to continue your journey
        </p>

        {error.general && (
          <p className="text-[var(--color-warning)] text-center font-semibold mb-3">
            {error.general}
          </p>
        )}

        <div className="flex flex-col space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-xl font-semibold text-[var(--color-accent)]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              aria-invalid={!!error.email}
              aria-describedby={error.email ? "email-error" : undefined}
              className={`w-full p-4 rounded-lg border bg-[var(--color-primary)] text-[var(--color-text)] placeholder-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition duration-300 ${
                error.email
                  ? "border-[var(--color-warning)] focus:ring-[var(--color-warning)]"
                  : "border-[var(--color-primary)]"
              }`}
            />
            {error.email && (
              <span
                id="email-error"
                className="block mt-2 font-semibold text-[var(--color-warning)] text-md"
              >
                {error.email}
              </span>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block mb-1 text-xl font-semibold text-[var(--color-accent)]"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              minLength={6}
              autoComplete="current-password"
              aria-invalid={!!error.password}
              aria-describedby={error.password ? "password-error" : undefined}
              className={`w-full p-4 rounded-lg border bg-[var(--color-primary)] text-[var(--color-text)] placeholder-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition duration-300 ${
                error.password
                  ? "border-[var(--color-warning)] focus:ring-[var(--color-warning)]"
                  : "border-[var(--color-primary)]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={0}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-[var(--color-accent)] hover:text-[var(--color-text)] transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9 0-1.657.507-3.187 1.373-4.438M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    opacity={0.5}
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c1.34 0 2.61.3 3.732.832M15.5 15.5l3.5 3.5"
                  />
                </svg>
              )}
            </button>
            {error.password && (
              <span
                id="password-error"
                className=" block mt-2 font-semibold text-[var(--color-warning)] text-md"
              >
                {error.password}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-4">
          <button
            type="submit"
            disabled={loading}
            aria-live="polite"
            aria-busy={loading}
            className={`w-full py-4 rounded-lg text-xl font-semibold text-[var(--color-primary)] shadow-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)] ${
              loading
                ? "bg-[var(--color-primary)] cursor-not-allowed opacity-70"
                : "bg-[var(--color-accent)] hover:brightness-110"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <Link
            href="/forgot-password"
            className="text-[var(--color-primary)] hover:underline text-md transition"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </main>
  );
}
