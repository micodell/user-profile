'use client'

import { useActionState } from 'react'
import { signup } from '../actions'
import Link from 'next/link'

const initialState = {
  message: '',
  error: '',
}

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, initialState)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form action={formAction} className="w-full max-w-md bg-white p-8 rounded shadow-md space-y-4">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Daftar Akun</h1>
        
        {state?.error && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">
            {state.error}
          </div>
        )}

        <input name="email" type="email" placeholder="Email" required className="w-full p-2 border rounded text-gray-800" />
        <input name="password" type="password" placeholder="Password" required className="w-full p-2 border rounded text-gray-800" />
        
        <button disabled={isPending} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50">
          {isPending ? 'Mendaftar...' : 'Daftar'}
        </button>
        
        <p className="text-center text-sm text-gray-600">
          Sudah punya akun? <Link href="/login" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  )
}