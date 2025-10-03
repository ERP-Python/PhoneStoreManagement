import React, { createContext, useContext, useState } from 'react'
import AlertSystem from '../components/AlertSystem/AlertSystem'

const AlertContext = createContext()

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'info',
    duration: 2000,
  })

  const showAlert = (message, severity = 'info', duration = 2000) => {
    setAlert({
      open: true,
      message,
      severity,
      duration,
    })
  }

  const showSuccess = (message, duration = 2000) => {
    showAlert(message, 'success', duration)
  }

  const showError = (message, duration = 2000) => {
    showAlert(message, 'error', duration)
  }

  const showWarning = (message, duration = 2000) => {
    showAlert(message, 'warning', duration)
  }

  const showInfo = (message, duration = 2000) => {
    showAlert(message, 'info', duration)
  }

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, open: false }))
  }

  const value = {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideAlert,
  }

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertSystem
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        duration={alert.duration}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  )
}
