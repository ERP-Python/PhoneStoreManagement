export const ordersStyles = {
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
  filterControl: {
    minWidth: 150,
  },
  totalText: {
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

export const statusColors = {
  pending: 'warning',
  paid: 'success',
  cancelled: 'error',
}

export const statusLabels = {
  pending: 'Chờ thanh toán',
  paid: 'Đã thanh toán',
  cancelled: 'Đã hủy',
}
