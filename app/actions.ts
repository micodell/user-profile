'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// State type definition
export type ActionState = {
  message?: string
  error?: string
}

export async function login(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient() // createClient sekarang async
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  // MANUAL INSERT: Jika user berhasil dibuat, kita paksa buat profilnya
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: '',
        avatar_url: ''
      })
      
    // Abaikan error duplicate key jika trigger ternyata jalan
    if (profileError && !profileError.message.includes('duplicate key')) {
       console.error('Gagal buat profil:', profileError)
    }
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function updateProfile(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const full_name = formData.get('full_name') as string
  const address = formData.get('address') as string
  const ktp_number = formData.get('ktp_number') as string
  const photoFile = formData.get('photo') as File

  let avatar_url = formData.get('current_avatar_url') as string

  if (photoFile && photoFile.size > 0) {
    const fileName = `${user.id}-${Date.now()}`
    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(fileName, photoFile)

    if (uploadError) {
      return { error: 'Gagal upload foto' }
    }
    
    const { data: { publicUrl } } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(fileName)
    
    avatar_url = publicUrl
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      full_name,
      address,
      ktp_number,
      avatar_url,
      updated_at: new Date().toISOString(),
    })

  if (error) return { error: error.message }

  revalidatePath('/')
  return { message: 'Profil berhasil diupdate!' }
}