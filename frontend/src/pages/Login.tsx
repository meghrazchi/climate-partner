import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
} from '@mui/material'
import { useState } from 'react'
import { useAuthStore } from '../store/auth'
import { useNavigate, Link } from 'react-router-dom'

// Validation schema with zod
const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormData = z.infer<typeof schema>

export default function Login() {
  console.log('login')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const [errMsg, setErrMsg] = useState<string>()
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const onSubmit = async (data: FormData) => {
    setErrMsg(undefined)
    try {
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (err: any) {
      setErrMsg(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 3,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight={700}>
              Sign in
            </Typography>

            {errMsg && <Alert severity="error">{errMsg}</Alert>}

            <TextField
              label="Email"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>

            <Typography variant="body2" textAlign="center" color="text.secondary">
              Don’t have an account?{' '}
              <Link to="/register" style={{ textDecoration: 'none' }}>
                Register
              </Link>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}
