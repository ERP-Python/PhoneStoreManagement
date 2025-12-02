import React from 'react'
import { Alert, Snackbar, IconButton } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { styled } from '@mui/material/styles'

const StyledAlert = styled(Alert)(({ theme, severity }) => ({
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

const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  '& .MuiSnackbarContent-root': {
    padding: 0,
  },
}))

export default function AlertSystem({ 
  open, 
  message, 
  severity = 'info', 
  duration = 4000,
  onClose 
}) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    onClose()
  }

  const getAlertIcon = () => {
    switch (severity) {
      case 'error':
        return '!'
      case 'success':
        return '✓'
      case 'warning':
        return '!'
      case 'info':
      default:
        return 'i'
    }
  }

  const getAlertColor = () => {
    switch (severity) {
      case 'error':
        return '#f44336'
      case 'success':
        return '#4caf50'
      case 'warning':
        return '#ff9800'
      case 'info':
      default:
        return '#2196f3'
    }
  }

  return (
    <StyledSnackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      TransitionComponent={undefined}
      transitionDuration={{ enter: 300, exit: 300 }}
    >
      <StyledAlert
        severity={severity}
        onClose={handleClose}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={{
          backgroundColor: getAlertColor(),
          color: 'white',
          '& .MuiAlert-icon': {
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '2px solid white',
            marginRight: '12px',
          },
        }}
      >
        {message}
      </StyledAlert>
    </StyledSnackbar>
  )
}
