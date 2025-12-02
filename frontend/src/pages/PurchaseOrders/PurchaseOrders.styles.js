export const purchaseOrdersStyles = {
  container: {
    maxWidth: 1400,
    margin: '0 auto',
  },
  header: {
    p: 3,
    mb: 3,
    borderRadius: 2,
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
    boxShadow: '0 4px 20px rgba(79, 172, 254, 0.3)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 700,
    mb: 0.5,
  },
  subtitle: {
    opacity: 0.9,
  },
  addButton: {
    backgroundColor: 'white',
    color: '#4facfe',
    '&:hover': {
      backgroundColor: '#f8f9fa',
    },
  },
  contentPaper: {
    p: 3,
    borderRadius: 2,
  },
  toolbarContainer: {
    display: 'flex',
    gap: 2,
    mb: 3,
    flexWrap: 'wrap',
  },
  searchField: {
    flex: 1,
    minWidth: 300,
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#f8f9fa',
    },
  },
  searchIcon: {
    color: '#94a3b8',
  },
  searchButton: {
    px: 3,
  },
  iconButton: {
    border: '1px solid #e2e8f0',
  },
  alert: {
    mb: 2,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    py: 8,
  },
  tableHeaderCell: {
    fontWeight: 700,
    backgroundColor: '#f8f9fa',
    color: '#475569',
    borderBottom: '2px solid #e2e8f0',
  },
  tableCell: {
    color: '#64748b',
  },
  actionButton: {
    color: '#667eea',
    mx: 0.5,
  },
  pagination: {
    borderTop: '1px solid #e2e8f0',
    pt: 2,
  },
}

