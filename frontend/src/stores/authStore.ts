import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthResponse } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (authData: AuthResponse) => void
  logout: () => void
  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (authData: AuthResponse) =>
        set({
          user: authData.user,
          token: authData.token,
          isAuthenticated: true,
        }),
      
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
      
      updateUser: (user: User) =>
        set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
