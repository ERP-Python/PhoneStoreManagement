import { styled } from '@mui/material/styles'
import { Alert, Snackbar } from '@mui/material'

export const StyledAlert = styled(Alert)(({ theme, severity }) => ({
  minWidth: '300px',
  maxWidth: '400px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  '& .MuiAlert-icon': {
    fontSize: '1.2rem',
  },
  '& .MuiAlert-message': {
    fontSize: '0.95rem',
    fontWeight: 500,
  },
  '& .MuiAlert-action': {
    padding: 0,
  },
  '& .MuiIconButton-root': {
    padding: '4px',
    color: 'inherit',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
}))

export const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  '& .MuiSnackbarContent-root': {
    padding: 0,
  },
  // Loại bỏ hiệu ứng giãn ra thu vào
  '&.MuiSnackbar-root': {
    transform: 'none !important',
    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
  },
  // Hiệu ứng hiện lên mượt mà
  '&.MuiSnackbar-anchorOriginBottomRight': {
    transform: 'translateX(0) translateY(0) !important',
  },
}))
