'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
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

export async function signup(formData: FormData) {
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

  // if (data.user) {
  //   const { error: profileError } = await supabase
  //       .from('profiles')
  //       .insert({
  //           id: data.user.id,
  //           name: name,
  //       })
    
  //   if (profileError) {
  //       console.error('Profile Insert Error:', profileError)
  //   }
  // }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/')

  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const ktpNo = formData.get('ktpNo') as string
  const file = formData.get('avatar') as File
  let avatarUrl = formData.get('currentAvatarUrl') as string

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
  return { message: 'Success' }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}