'use client'

import { useActionState } from 'react' // Gunakan 'react-dom' jika error, atau useFormState
import { login } from '../actions'
import Link from 'next/link'

const initialState = {
  message: '',
  error: '',
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form action={formAction} className="w-full max-w-md bg-white p-8 rounded shadow-md space-y-4">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Login</h1>
        
        {state?.error && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">
            {state.error}
          </div>
        )}

        <input name="email" type="email" placeholder="Email" required className="w-full p-2 border rounded text-gray-800" />
        <input name="password" type="password" placeholder="Password" required className="w-full p-2 border rounded text-gray-800" />
        
        <button disabled={isPending} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {isPending ? 'Loading...' : 'Masuk'}
        </button>
        
        <p className="text-center text-sm text-gray-600">
          Belum punya akun? <Link href="/signup" className="text-blue-500">Daftar</Link>
        </p>
      </form>
    </div>
  )
}