'use client'

import Link from 'next/link'
import { useFormState } from 'react-dom'
import { signup } from '@/app/actions'

export const initialState = {
  message: '',
  error: '',
}

export default function SignupPage() {
  // Gunakan useFormState agar error dari server bisa muncul
  const [state, formAction] = useFormState(signup, initialState)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Registrasi Akun</h1>
        
        {/* Menampilkan Error Pesan (misal: Email sudah terdaftar) */}
        {state?.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                {state.error}
            </div>
        )}

        <form action={formAction} className="space-y-4 text-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              name="email" 
              type="email" 
              placeholder="johndoe@example.com" 
              required 
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              name="password" 
              type="password" 
              placeholder="" 
              required 
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <input 
              name="name" 
              type="text" 
              placeholder="John Doe" 
              required 
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition">
            Daftar Sekarang
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login di sini
          </Link>
        </div>
      </div>
    </main>
  )
}   