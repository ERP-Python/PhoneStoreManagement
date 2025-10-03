import { Snackbar, Alert } from '@mui/material'
import { notificationStyles } from './Notification.styles'

export default function Notification({ open, message, severity, onClose }) {
  return (
    <Snackbar
      open={open}
      {...notificationStyles.snackbar}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity={severity} sx={notificationStyles.alert}>
        {message}
      </Alert>
    </Snackbar>
  )
}
