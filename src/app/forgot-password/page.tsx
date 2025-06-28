'use client'

import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/firebase/firebaseConfig'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    if (!email) {
      setError('Email is required.')
      return
    }
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setMessage('Password reset email sent. Please check your inbox.')
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-[var(--color-primary)] px-4">
      <form
        onSubmit={handleReset}
        className="bg-[var(--color-secondary)] w-full max-w-md p-8 rounded-3xl shadow-lg space-y-6 transition-colors duration-300"
        aria-labelledby="forgot-password-title"
      >
        <h2
          id="forgot-password-title"
          className="text-4xl font-extrabold text-center text-[var(--color-accent)] select-none"
        >
          Forgot Password
        </h2>

        {message && (
          <div
            className="text-green-500 text-center font-semibold bg-green-50 border border-green-200 rounded-lg py-2 px-4 mb-2"
            aria-live="polite"
          >
            {message}
          </div>
        )}
        {error && (
          <div
            className="text-[var(--color-warning)] text-center font-semibold bg-yellow-50 border border-yellow-200 rounded-lg py-2 px-4 mb-2"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="mb-2 text-xl text-[var(--color-accent)] font-medium"
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
            aria-label="Email address"
            required
            className="w-full p-4 rounded-lg border bg-[var(--color-primary)] text-[var(--color-text)] placeholder-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition duration-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-lg font-semibold text-xl text-[var(--color-primary)] shadow-md transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)] ${
            loading
              ? 'bg-[var(--color-primary)] cursor-not-allowed opacity-70'
              : 'bg-[var(--color-accent)] hover:brightness-110'
          }`}
          aria-busy={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Email'}
        </button>

        <div className="text-center">
          <Link href="/signin" className="text-[var(--color-primary)] text-md hover:underline">
            Back to Sign In
          </Link>
        </div>
      </form>
    </main>
  )
}
