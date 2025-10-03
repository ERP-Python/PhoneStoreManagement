export const orderDetailStyles = {
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: 2,
      maxHeight: '90vh'
    }
  },

  title: {
    padding: '16px 24px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#f5f5f5'
  },

  titleContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  content: {
    padding: '24px',
    '&::-webkit-scrollbar': {
      width: '6px'
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#c1c1c1',
      borderRadius: '3px'
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#a8a8a8'
    }
  },

  section: {
    marginBottom: '24px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },

  sectionTitle: {
    marginBottom: '16px',
    color: '#1976d2',
    fontWeight: '600',
    borderBottom: '2px solid #e3f2fd',
    paddingBottom: '8px'
  },

  infoItem: {
    marginBottom: '12px',
    '&:last-child': {
      marginBottom: 0
    }
  },

  totalSection: {
    padding: '16px 0'
  },

  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    '&:last-child': {
      marginBottom: 0
    }
  },

  divider: {
    margin: '12px 0'
  },

  paymentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
    '&:last-child': {
      borderBottom: 'none'
    }
  },

  paymentInfo: {
    flex: 1
  },

  paymentAmount: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px'
  },

  actions: {
    padding: '16px 24px',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#f5f5f5',
    gap: '8px'
  }
}
