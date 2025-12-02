import { createContext, useState, useEffect, useContext } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get CSRF token first
    const getCsrfToken = async () => {
      try {
        await api.get('/auth/csrf/')
      } catch (error) {
        console.error('Error getting CSRF token:', error)
      }
    }
    
    getCsrfToken()
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me/')
      setUser(response.data)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login/', { username, password })
      setUser(response.data.user)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      let errorMessage = 'Đăng nhập thất bại'
      
      if (error.response) {
        const data = error.response.data
        if (data.message) {
          errorMessage = data.message
        } else if (data.detail) {
          errorMessage = data.detail
        } else if (data.non_field_errors) {
          errorMessage = data.non_field_errors[0]
        } else if (data.username) {
          errorMessage = `Tên đăng nhập: ${data.username[0]}`
        } else if (data.password) {
          errorMessage = `Mật khẩu: ${data.password[0]}`
        }
      } else if (error.request) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.'
      }
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout/')
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 