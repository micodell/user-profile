import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from './actions'
import ProfileForm from '@/components/ProfileForm' // Import form yang baru dibuat
import Image from 'next/image'

export default async function Home() {
  const supabase = await createClient() // Tambahkan await

  // 1. Cek User Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Ambil Data Profil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Profil Diri</h1>
          <form action={signOut}>
            <button className="text-red-500 hover:underline">Logout</button>
          </form>
        </div>

        <div className="flex items-center gap-6 mb-8">
          {profile?.avatar_url ? (
            <Image 
              src={profile.avatar_url} width={30} height={30}
              alt="Avatar" 
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Foto
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-700">{user.email}</p>
            <p className="text-sm text-gray-500">ID: {user.id}</p>
          </div>
        </div>

        {/* Panggil Client Component di sini */}
        <ProfileForm profile={profile} />
        
      </div>
    </div>
  )
}