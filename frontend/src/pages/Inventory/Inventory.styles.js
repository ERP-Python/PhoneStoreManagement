export const inventoryStyles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3,
  },
  headerActions: {
    display: 'flex',
    gap: 1,
    alignItems: 'center',
  },
  warningChip: {
    size: 'small',
  },
  errorAlert: {
    mb: 2,
  },
  searchPaper: {
    mb: 2,
    p: 2,
  },
  searchBox: {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
  },
  variantText: {
    variant: 'body2',
    color: 'text.secondary',
  },
  stockText: {
    variant: 'body2',
    fontWeight: 'bold',
  },
  stockTextError: {
    variant: 'body2',
    fontWeight: 'bold',
    color: 'error',
  },
  availableText: {
    variant: 'body2',
    fontWeight: 'medium',
  },
  statusChip: {
    size: 'small',
  },
  pagination: {
    labelRowsPerPage: 'Số hàng mỗi trang:',
  },
}
