import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from '../actions'
import ProfileForm from './profile-form'
import Image from 'next/image'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <form action={signOut}>
                <button className="text-red-500 hover:text-red-700 font-semibold">Sign Out</button>
            </form>
        </div>

        <div className="mb-6 flex justify-center">
            {profile?.avatar_url ? (
                <Image 
                    src={profile.avatar_url} 
                    alt="Profile" width="32" height="32"
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                />
            ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Photo
                </div>
            )}
        </div>

        <ProfileForm profile={profile} />
        
      </div>
    </div>
  )
}