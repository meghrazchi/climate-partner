import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'
import { login } from '../api/client'

type Decoded = { sub?: string; email?: string; exp?: number }

type AuthState = {
  token?: string
  user?: { id?: string; email?: string }
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const STORAGE_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || 'gt_access_token'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: undefined,
      user: undefined,
      isAuthenticated: false,
      async login(email, password) {
        const { accessToken } = await login(email, password)
        const decoded: Decoded = jwtDecode(accessToken)
        set({
          token: accessToken,
          user: { id: decoded.sub, email: decoded.email },
          isAuthenticated: true,
        })
      },
      logout() {
        set({ token: undefined, user: undefined, isAuthenticated: false })
      },
    }),
    { name: STORAGE_KEY }
  )
)
