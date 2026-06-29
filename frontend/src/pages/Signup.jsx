import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store.js'
import Spinner from '../components/Spinner.jsx'
import logo from '../assets/logo.png'

const Signup = () => {
  const navigate = useNavigate()
  const { signup, err, loading, stopLoading } = useAuthStore()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [loadingMessage, setLoadingMessage] = useState("Creating your account...");

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoadingMessage("Setting up your study space...");
      const res = await signup({
        name: form.name,
        email: form.email,
        password: form.password
      })
      if (res) {
        setLoadingMessage("Welcome! Redirecting to your dashboard...");
        setTimeout(() => {
          navigate("/")
          setTimeout(() => stopLoading(), 100);
        }, 500);
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <img src={logo} alt="StudyBuddy" className="h-20 mx-auto mb-6" />

            <h1 className="text-4xl font-bold text-white mb-2">
              Study<span className="text-green-500">Buddy</span>
            </h1>

            <p className="text-slate-300 text-lg mb-6">{loadingMessage}</p>

            <div className="mb-6">
              <Spinner size="lg" color="gray" className="mx-auto" />
            </div>

            <div className="text-slate-400 text-sm">
              <p>🚀 {loadingMessage.includes("Welcome") ? "Welcome to StudyBuddy!" : "Setting up your study space"}</p>
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
              <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
              <p className="mt-2 text-sm text-neutral-400">Join StudyBuddy and get started</p>
            </div>

            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-6 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/40 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_40px_-20px_rgba(0,0,0,0.6)]">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-neutral-300">Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-neutral-700/70 bg-neutral-950 px-4 py-3 text-sm outline-none transition focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20 placeholder:text-neutral-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-neutral-300">Email</label>
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
                  <label className="mb-1 block text-sm text-neutral-300">Password</label>
                  <input
                    type="password"
                    placeholder="Enter a strong password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded-xl border border-neutral-700/70 bg-neutral-950 px-4 py-3 text-sm outline-none transition focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20 placeholder:text-neutral-500"
                    required
                  />
                </div>

                {err && err !== "Unauthorized" && (
                  <p className="text-sm text-red-400">{err}</p>
                )}

                <button
                  disabled={loading}
                  type='submit'
                  className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-green-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-neutral-400">
                Already have an account?{' '}
                <Link to="/login" className="text-green-400 hover:text-green-300">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup