'use client'

import { useFormState } from 'react-dom'
import { updateProfile } from '../actions'


type Profile = {
    name: string | null
    address: string | null
    ktp_no: string | null
    avatar_url: string | null
}

const initialState = {
  message: '',
  error: '',
}

export default function ProfileForm({ profile }: { profile: Profile | null }) {
    const [state, formAction] = useFormState(updateProfile, initialState)
    return (
        <form action={formAction} className="space-y-6 text-gray-700">
            {state?.error && (
                <div className="rounded bg-red-100 p-3 text-red-700 border border-red-400">
                    {state.error}
                </div>
            )}
            {state?.message && (
                <div className="rounded bg-green-100 p-3 text-green-700 border border-green-400">
                    {state.message}
                </div>
            )}
            
            {/* Hidden input for avatar logic */}
            <input type="hidden" name="currentAvatarUrl" value={profile?.avatar_url || ''} />

            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input 
                    name="name" 
                    defaultValue={profile?.name || ''} 
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Address (Alamat)</label>
                <textarea 
                    name="address" 
                    defaultValue={profile?.address || ''} 
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">KTP Number</label>
                <input 
                    name="ktpNo" 
                    type="text"
                    inputMode="numeric"
                    minLength={16}
                    maxLength={16}
                    placeholder="16 Digit NIK"
                    defaultValue={profile?.ktp_no || ''} 
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                    onInput={(e) => {
                        // logicly strip non-numbers
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')
                    }}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Update Profile Photo</label>
                <input 
                    name="avatar"
                    type="file" 
                    accept="image/*"
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                />
            </div>

            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Save Changes
            </button>
        </form>
    )
}