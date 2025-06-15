import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return (
    <div className="flex w-full flex-col items-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back, {user.email}!
        </p>

        {/* Placeholder for mind map creation UI */}
        <div className="mt-8 rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
          <h2 className="text-xl font-semibold">Create a new Mind Map</h2>
          <p className="mt-2 text-sm text-gray-500">
            This is where the form to generate a mind map will go. You can
            input a comic URL or upload a file to start.
          </p>
        </div>
      </div>
    </div>
  )
} 