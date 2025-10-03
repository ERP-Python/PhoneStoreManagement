import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Paper,
  Avatar,
  InputAdornment,
  IconButton,
  Fade,
  Slide
} from '@mui/material'
import {
  Person,
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import { loginStyles } from './Login.styles'
import logo from '../../assets/images/logo.png'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box sx={loginStyles.backgroundContainer}>
      <Container component="main" maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Box sx={loginStyles.container}>
            <Slide direction="down" in={true} timeout={600}>
              <Paper elevation={12} sx={loginStyles.paper}>
                {/* Avatar Logo */}
                <Box sx={loginStyles.avatarContainer}>
                    <img 
                      src={logo} 
                      alt="Phone Store Logo" 
                      style={{ width: '70%', height: '50%%', objectFit: 'contain' }}
                    />
                </Box>
                
                {/* Title */}
                <Typography {...loginStyles.title}>
                  Phone Store Management
                </Typography>
                <Typography {...loginStyles.subtitle}>
                  Đăng nhập để tiếp tục
                </Typography>
                
                {/* Error Alert */}
                {error && (
                  <Fade in={!!error}>
                    <Alert severity="error" sx={loginStyles.errorAlert}>
                      {error}
                    </Alert>
                  </Fade>
                )}
                
                {/* Login Form */}
                <Box component="form" onSubmit={handleSubmit} sx={loginStyles.form}>
                  <TextField
                    {...loginStyles.textField}
                    label="Tên đăng nhập"
                    placeholder="Nhập tên đăng nhập"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    {...loginStyles.textField}
                    label="Mật khẩu"
                    placeholder="Nhập mật khẩu"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={loginStyles.submitButton}
                    disabled={loading || !username || !password}
                  >
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </Box>
                
                {/* Footer */}
                <Box sx={loginStyles.footer}>
                  <Typography variant="body2" color="text.secondary">
                    © 2025 Phone Store Management System
                  </Typography>
                </Box>
              </Paper>
            </Slide>
          </Box>
        </Fade>
      </Container>
    </Box>
  )
}
