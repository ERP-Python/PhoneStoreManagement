export const productsStyles = {
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
    mb: 2,
  },
  filterBox: {
    display: 'flex',
    gap: 2,
  },
  filterControl: {
    minWidth: 200,
  },
  productAvatar: {
    width: 56,
    height: 56,
  },
  productNameCell: {
    fontWeight: 'medium',
  },
  priceText: {
    variant: 'body2',
    fontWeight: 'medium',
    color: 'primary',
  },
  variantChip: {
    size: 'small',
    variant: 'outlined',
  },
  statusChip: {
    size: 'small',
  },
  pagination: {
    labelRowsPerPage: 'Số hàng mỗi trang:',
  },
}
