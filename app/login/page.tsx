'use client'

import Link from 'next/link'
import { login } from '@/app/actions'
// 1. Import dari 'react', bukan 'react-dom'
import { useActionState } from 'react'

const initialState = {
  message: '',
  error: '',
}

export default function LoginPage() {
  // 2. Gunakan useActionState
  // Return value ke-3 adalah 'isPending' (boolean) yang otomatis true saat action berjalan
  const [state, formAction, isPending] = useActionState(login, initialState)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
              
        {/* Error Feedback */}
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

          {/* 3. Gunakan isPending untuk disable button dan ubah teks loading */}
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isPending ? (
              <>
                {/* Simple SVG Spinner */}
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Daftar di sini
          </Link>
        </div>
      </div>
    </main>
  )
}