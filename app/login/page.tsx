import Link from 'next/link'
import { login } from '@/app/actions'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
        
        <form action={login} className="space-y-4 text-gray-700">
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

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
            Masuk
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