import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
      <div className="max-w-md w-full bg-neutral-card rounded-xl p-8 shadow-soft text-center">
        <h1 className="text-2xl font-semibold text-text mb-4">
          Authentication Error
        </h1>
        <p className="text-text-muted mb-6">
          Sorry, we couldn't complete your sign-in. Please try again.
        </p>
        <Link
          href="/"
          className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover-darken transition-colors-smooth"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
} 