'use client'

import { useActionState } from 'react'
import { updateProfile } from '@/app/actions'

// 1. Definisikan tipe data sesuai kolom di Supabase
interface Profile {
  id: string
  full_name: string | null
  address: string | null
  ktp_number: string | null
  avatar_url: string | null
  updated_at: string | null
}

// 2. Gunakan interface tersebut di props (ganti 'any')
// Kita tambahkan '| null' untuk berjaga-jaga jika data belum siap
export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const initialState = {
    message: '',
    error: '',
  }

  const [state, formAction, isPending] = useActionState(updateProfile, initialState)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <p className="text-red-500 text-sm text-center">{state.error}</p>}
      {state?.message && <p className="text-green-500 text-sm text-center">{state.message}</p>}

      <input type="hidden" name="current_avatar_url" value={profile?.avatar_url || ''} />
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
        <input 
          name="full_name" 
          defaultValue={profile?.full_name || ''} 
          className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm text-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Alamat</label>
        <textarea 
          name="address" 
          defaultValue={profile?.address || ''} 
          className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm text-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">No. KTP</label>
        <input 
          name="ktp_number" 
          defaultValue={profile?.ktp_number || ''} 
          className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm text-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Update Foto Profil</label>
        <input 
          type="file" 
          name="photo" 
          accept="image/*"
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div className="pt-4">
        <button disabled={isPending} type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 shadow transition disabled:opacity-50">
          {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  )
}