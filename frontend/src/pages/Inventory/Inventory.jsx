import { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link
} from '@mui/material'
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import api from '../../api/axios'
import { inventoryStyles } from './Inventory.styles'

export default function Inventory() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [lowStockCount, setLowStockCount] = useState(0)
  
  // Dialog state
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchInventory = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = {
        page: page + 1,
        page_size: rowsPerPage,
      }
      
      if (searchTerm) {
        params.search = searchTerm
      }
      
      // Use new by_product endpoint
      const response = await api.get('/inventory/by_product/', { params })
      
      const inventoryData = response.data.results || response.data
      setInventory(inventoryData)
      setTotalCount(response.data.count || inventoryData.length)
      
      // Count low stock items
      const lowStock = inventoryData.filter(item => 
        item.status?.value === 'low_stock' || item.status?.value === 'out_of_stock'
      ).length
      setLowStockCount(lowStock)
      
    } catch (err) {
      console.error('Error fetching inventory:', err)
      setError('Không thể tải dữ liệu tồn kho. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [page, rowsPerPage])

  const handleSearch = () => {
    setPage(0)
    fetchInventory()
  }

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedProduct(null)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value)
  }

  if (loading && inventory.length === 0) {
    return (
      <Box sx={inventoryStyles.loadingContainer}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={inventoryStyles.header}>
        <Typography variant="h4">
          Quản lý Tồn kho
        </Typography>
        <Box sx={inventoryStyles.headerActions}>
          <Chip 
            icon={<WarningIcon />} 
            label={`${lowStockCount} sản phẩm sắp hết`}
            color="warning"
            {...inventoryStyles.warningChip}
          />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={inventoryStyles.errorAlert} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={inventoryStyles.searchPaper}>
        <Box sx={inventoryStyles.searchBox}>
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm kiếm theo tên sản phẩm, SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
          >
            Tìm
          </Button>
          <IconButton onClick={fetchInventory} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell align="right">Tồn kho</TableCell>
              <TableCell align="right">Đã đặt</TableCell>
              <TableCell align="right">Có thể bán</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : inventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Không tìm thấy dữ liệu tồn kho
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              inventory.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {item.sku || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => handleProductClick(item)}
                      sx={{ 
                        textAlign: 'left',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: 'primary.dark'
                        }
                      }}
                    >
                      {item.name || '-'}
                    </Link>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {item.brand_name || ''} • {item.variants_count} biến thể
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography 
                      variant="body2"
                      fontWeight="bold"
                      color={item.total_on_hand === 0 ? 'error.main' : 'text.primary'}
                    >
                      {item.total_on_hand || 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="warning.main">
                      {item.total_reserved || 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography 
                      variant="body2" 
                      fontWeight="medium"
                      color="success.main"
                    >
                      {item.total_available || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.status?.label || 'N/A'}
                      color={item.status?.color || 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count}`}
        />
      </TableContainer>

      {/* Variant Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6">
                {selectedProduct?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedProduct?.brand_name} • SKU: {selectedProduct?.sku}
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Tổng quan
            </Typography>
            <Box display="flex" gap={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Tổng tồn kho
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {selectedProduct?.total_on_hand || 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Đã đặt
                </Typography>
                <Typography variant="h6" color="warning.main">
                  {selectedProduct?.total_reserved || 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Có thể bán
                </Typography>
                <Typography variant="h6" color="success.main">
                  {selectedProduct?.total_available || 0}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography variant="subtitle2" color="text.secondary" gutterBottom mt={3}>
            Chi tiết biến thể ({selectedProduct?.variants_count || 0})
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell>Biến thể</TableCell>
                  <TableCell align="right">Giá</TableCell>
                  <TableCell align="right">Tồn kho</TableCell>
                  <TableCell align="right">Đã đặt</TableCell>
                  <TableCell align="right">Có thể bán</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedProduct?.variants?.map((variant) => (
                  <TableRow key={variant.id}>
                    <TableCell>
                      <Typography variant="body2" fontSize="0.875rem">
                        {variant.sku}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {variant.display}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {formatCurrency(variant.price)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        fontWeight="bold"
                        color={variant.on_hand === 0 ? 'error.main' : 'text.primary'}
                      >
                        {variant.on_hand}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="warning.main">
                        {variant.reserved}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="success.main">
                        {variant.available}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
