import * as React from 'react'

const AUTH_STORAGE_KEY = 'tw_mock_auth'

interface AuthContextValue {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

function loadAuth(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)

  React.useEffect(() => {
    setIsLoggedIn(loadAuth())
  }, [])

  const login = React.useCallback(() => {
    setIsLoggedIn(true)
    try {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true')
    } catch {}
  }, [])

  const logout = React.useCallback(() => {
    setIsLoggedIn(false)
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY)
    } catch {}
  }, [])

  const value = React.useMemo(
    () => ({ isLoggedIn, login, logout }),
    [isLoggedIn, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
