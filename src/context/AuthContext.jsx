import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  // 🔹 cargar token al iniciar la app
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      setUser({ token: storedToken }) // opcional
    }
  }, [])

  // 🔹 login
  const login = (newToken) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
    setUser({ token: newToken })
  }

  // 🔹 logout
  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
