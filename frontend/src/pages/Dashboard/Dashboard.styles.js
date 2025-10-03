export const dashboardStyles = {
  container: {
    // Main container styles
  },
  
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  
  header: {
    mb: 3,
  },
  
  title: {
    fontWeight: 700,
    color: '#1a202c',
    mb: 1,
  },
  
  errorAlert: {
    mb: 3,
    borderRadius: 2,
  },
  
  statsGrid: {
    mt: 1,
  },
  
  // Stat Card Styles
  statCard: {
    height: '100%',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    },
  },
  
  statCardContent: {
    p: 3,
    '&:last-child': {
      pb: 3,
    },
  },
  
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 2,
  },
  
  statIcon: {
    width: 48,
    height: 48,
    color: '#fff',
    fontSize: '1.5rem',
  },
  
  statBody: {
    textAlign: 'left',
  },
  
  statValue: {
    fontWeight: 700,
    color: '#1a202c',
    mb: 0.5,
  },
  
  statTitle: {
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontSize: '0.75rem',
  },
  
  // Chart Styles
  chartCard: {
    height: '100%',
    border: '1px solid #e2e8f0',
    overflow: 'visible',
    '& .MuiCardContent-root': {
      p: 2.5,
      overflow: 'visible',
      '&:last-child': {
        pb: 2.5,
      },
    },
  },
  
  chartTitle: {
    fontWeight: 600,
    color: '#1a202c',
  },
  
  // Activity Card Styles
  activityCard: {
    height: '100%',
    border: '1px solid #e2e8f0',
  },
  
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    py: 2,
    borderBottom: '1px solid #f7fafc',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  
  productItem: {
    py: 2,
    borderBottom: '1px solid #f7fafc',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
}
