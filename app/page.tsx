import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from './actions'
import ProfileForm from './profile/profile-form'
import Image from 'next/image'

export default async function Home() {
  const supabase = await createClient()

  // 1. Cek apakah user sudah login?
  const { data: { user } } = await supabase.auth.getUser()

  // 2. Jika BELUM login, paksa pindah ke halaman /login
  if (!user) {
    redirect('/login')
  }

  // 3. Jika SUDAH login, ambil data profile user tersebut
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 4. Tampilkan Dashboard Profile
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        
        {/* Header Dashboard */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard Saya</h1>
              <p className="text-gray-500 text-sm mt-1">Kelola data diri anda di sini</p>
            </div>
            
            {/* Tombol Logout */}
            <form action={signOut}>
                <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition">
                  Keluar (Sign Out)
                </button>
            </form>
        </div>

        {/* Foto Profile Preview (Server Side Rendering) */}
        <div className="mb-8 flex flex-col items-center">
            <div className="relative group">
              {profile?.avatar_url ? (
              <Image 
                width={30} height={30}
                      src={profile.avatar_url} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
              ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl font-bold shadow-inner">
                      {profile?.name ? profile.name[0].toUpperCase() : '?'}
                  </div>
              )}
            </div>
            <p className="mt-4 text-lg font-medium text-gray-700">
              {profile?.name || 'User Tanpa Nama'}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        {/* 5. Render Form Client Component */}
        {/* pass data profile ke component form untuk diedit */}
        <ProfileForm profile={profile} />
        
      </div>
    </div>
  )
}