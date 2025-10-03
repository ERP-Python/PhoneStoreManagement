import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Box, TextField, Button, Typography, Alert, Paper } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { loginStyles } from './Login.styles'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={loginStyles.container}>
        <Paper elevation={3} sx={loginStyles.paper}>
          <Typography {...loginStyles.title}>
            Phone Store Management
          </Typography>
          <Typography {...loginStyles.subtitle}>
            Sign in to continue
          </Typography>
          
          {error && <Alert severity="error" sx={loginStyles.errorAlert}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} sx={loginStyles.form}>
            <TextField
              {...loginStyles.textField}
              label="Username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              {...loginStyles.textField}
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={loginStyles.submitButton}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
