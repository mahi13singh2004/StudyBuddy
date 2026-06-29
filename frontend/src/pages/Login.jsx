import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth.store.js";
import Spinner from "../components/Spinner.jsx";
import logo from "../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { login, err, loading, stopLoading } = useAuthStore();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loadingMessage, setLoadingMessage] = useState("Signing you in...");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingMessage("Authenticating your credentials...");

    try {
      const res = await login({
        email: form.email,
        password: form.password,
      });
      if (res) {
        setLoadingMessage("Redirecting to your dashboard...");
        setTimeout(() => {
          navigate("/");
          setTimeout(() => stopLoading(), 100);
        }, 500);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoadingMessage("Signing you in...");
    }
  };

  const handleDemoLogin = () => {
    setForm({
      email: "recruiter@gmail.com",
      password: "recruiter123456"
    });
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <img
              src={logo}
              alt="StudyBuddy"
              className="h-20 mx-auto mb-6"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />

            <h1 className="text-4xl font-bold text-white mb-2">
              Study<span className="text-green-500">Buddy</span>
            </h1>

            <p className="text-slate-300 text-lg mb-6">{loadingMessage}</p>

            <div className="mb-6 flex justify-center">
              <Spinner size="lg" color="green" />
            </div>

            <div className="text-slate-400 text-sm">
              <p className="animate-pulse">
                {loadingMessage.includes("Redirecting") ? "✓ Taking you to your dashboard" : "● Authenticating your credentials"}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen w-full bg-[#0a0a0a] text-white relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-20 h-80 w-80 rounded-full bg-green-600/10 blur-[100px]" />
          <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-gray-600/10 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-gray-600/5 blur-[90px]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <img src={logo} alt="StudyBuddy" className="h-14 mx-auto mb-4" />
              <h1 className="text-3xl font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-neutral-400">Login to continue</p>
            </div>

            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-6 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/40 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_40px_-20px_rgba(0,0,0,0.6)]">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-neutral-300">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-neutral-700/70 bg-neutral-950 px-4 py-3 text-sm outline-none transition focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20 placeholder:text-neutral-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-neutral-300">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full rounded-xl border border-neutral-700/70 bg-neutral-950 px-4 py-3 text-sm outline-none transition focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20 placeholder:text-neutral-500"
                    required
                  />
                </div>

                {err && err !== "Unauthorized" && (
                  <p className="text-sm text-red-400">{err}</p>
                )}

                <button
                  disabled={loading}
                  type="submit"
                  className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-green-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Authenticating…" : "Login"}
                </button>

                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-neutral-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-neutral-900/50 text-neutral-400">Demo Account</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="w-full mt-3 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg text-sm flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>Try Demo Account</span>
                  </button>
                </div>
              </form>

              <p className="mt-6 text-center text-sm text-neutral-400">
                First time here?{" "}
                <Link to="/signup" className="text-green-400 hover:text-green-300">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
