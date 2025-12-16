'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Tipe data standar untuk state form
export type FormState = {
  message?: string
  error?: string
}

// Login: (Opsional) Saya update juga agar konsisten jika nanti mau pakai useFormState
export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

// Signup: Ditambahkan parameter prevState
export async function signup(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: {
            name: name,
        }
    }
  })

  if (error) {
    console.error("❌ SIGNUP ERROR:", error.message)
    return { error: error.message }
  }

  // Insert profile logic bisa ditaruh di sini atau via Trigger di Database (disarankan trigger)
  
  revalidatePath('/', 'layout')
  redirect('/')
}

// Update Profile: Ditambahkan parameter prevState
export async function updateProfile(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const ktpNo = formData.get('ktpNo') as string
  const file = formData.get('avatar') as File
  let avatarUrl = formData.get('currentAvatarUrl') as string

  // Handle Upload Avatar
  if (file && file.size > 0) {
    const fileName = `${user.id}-${Date.now()}`
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file)

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)
      avatarUrl = publicUrl
    }
  }
  
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      name: name,
      address: address,
      ktp_no: ktpNo,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })

  if (error) {
     console.error(error)
     return { error: 'Failed to update profile' }
  }

  revalidatePath('/')
  return { message: 'Profile updated successfully' }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}