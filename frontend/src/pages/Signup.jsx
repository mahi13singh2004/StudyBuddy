import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store.js'

const Signup = () => {
  const navigate = useNavigate()
  const { signup, err, loading } = useAuthStore()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await signup({
      name: form.name,
      email: form.email,
      password: form.password
    })
    if (res) {
      navigate("/")
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-20 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-[100px]" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-indigo-600/10 blur-[90px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-cyan-400 p-[2px]">
              <div className="h-full w-full rounded-2xl bg-neutral-950 grid place-items-center text-2xl font-semibold">
                SB
              </div>
            </div>
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
                  className="w-full rounded-xl border border-neutral-700/70 bg-neutral-950 px-4 py-3 text-sm outline-none transition focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 placeholder:text-neutral-500"
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
                  className="w-full rounded-xl border border-neutral-700/70 bg-neutral-950 px-4 py-3 text-sm outline-none transition focus:border-fuchsia-500/60 focus:ring-2 focus:ring-fuchsia-500/20 placeholder:text-neutral-500"
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
                  className="w-full rounded-xl border border-neutral-700/70 bg-neutral-950 px-4 py-3 text-sm outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-neutral-500"
                  required
                />
              </div>

              {err && err !== "Unauthorized" && (
                <p className="text-sm text-red-400">{err}</p>
              )}

              <button
                disabled={loading}
                type='submit'
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-4 py-3 text-sm font-medium text-white transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_120%,rgba(255,255,255,0.25),rgba(255,255,255,0)40%),radial-gradient(circle_at_90%_-10%,rgba(255,255,255,0.25),rgba(255,255,255,0)40%)] opacity-0 transition group-hover:opacity-100" />
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-400">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup