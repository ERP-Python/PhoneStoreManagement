export const loginStyles = {
  backgroundContainer: {
    minHeight: '100vh',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  paper: {
    p: { xs: 3, sm: 5 },
    width: '100%',
    maxWidth: 450,
    borderRadius: 3,
    background: '#EDF1F4',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 25px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4), 0 12px 35px rgba(0, 0, 0, 0.2)',
    },
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    mb: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: '2px solid rgba(102, 126, 234, 0.3)',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%': {
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
      },
      '50%': {
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.5)',
        transform: 'scale(1.05)',
      },
      '100%': {
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
      },
    },
  },
  avatarIcon: {
    fontSize: 40,
    color: 'white',
  },
  title: {
    component: 'h1',
    variant: 'h4',
    align: 'center',
    gutterBottom: true,
    sx: {
      fontWeight: 700,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      mb: 1,
    },
  },
  subtitle: {
    variant: 'h6',
    color: 'text.secondary',
    align: 'center',
    gutterBottom: true,
    sx: {
      mb: 4,
      fontWeight: 400,
      color: '#666',
    },
  },
  errorAlert: {
    mt: 2,
    mb: 2,
    borderRadius: 2,
    '& .MuiAlert-icon': {
      fontSize: 24,
    },
  },
  form: {
    mt: 2,
    width: '100%',
  },
  textField: {
    margin: 'normal',
    required: true,
    fullWidth: true,
    sx: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        backgroundColor: 'white',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#667eea',
          },
        },
        '&.Mui-focused': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#667eea',
            borderWidth: 2,
          },
        },
      },
      '& .MuiInputLabel-root': {
        fontWeight: 500,
        color: '#333',
        '&.Mui-focused': {
          color: '#667eea',
        },
      },
      '& .MuiInputAdornment-root .MuiSvgIcon-root': {
        transition: 'color 0.3s ease-in-out',
        color: '#667eea',
      },
    },
  },
  submitButton: {
    mt: 4,
    mb: 2,
    py: 1.5,
    borderRadius: 2,
    fontSize: 16,
    fontWeight: 600,
    textTransform: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
    },
    '&:disabled': {
      background: 'linear-gradient(135deg, #ccc 0%, #999 100%)',
      color: 'white',
      transform: 'none',
      boxShadow: 'none',
    },
  },
  footer: {
    mt: 3,
    textAlign: 'center',
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    pt: 2,
    '& .MuiTypography-root': {
      color: '#666',
    },
  },
}
