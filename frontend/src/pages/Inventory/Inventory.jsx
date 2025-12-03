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
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
    setCurrentImageIndex(0)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedProduct(null)
    setCurrentImageIndex(0)
  }

  const handlePreviousImage = () => {
    const images = selectedProduct?.images || []
    if (!images.length) return
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    const images = selectedProduct?.images || []
    if (!images.length) return
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
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
          labelRowsPerPage="Số hàng ở mỗi trang :"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count}`}
        />
      </TableContainer>

      {/* Product Detail Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sd"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            backgroundColor: '#ffffff'
          }
        }}
      >

        <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
            <Box flex={1}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5, color: '#1e293b' }}>
                {selectedProduct?.name}
              </Typography>
              <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                  {selectedProduct?.brand_name}
                </Typography>
                <Box sx={{ width: 1, height: 1, backgroundColor: '#cbd5e1', borderRadius: '50%' }} />
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  SKU: <span style={{ fontWeight: 600, color: '#1e293b' }}>{selectedProduct?.sku}</span>
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleCloseDialog} sx={{ mt: -1, mr: -1, color: '#94a3b8' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3, maxHeight: 'calc(100vh - 280px)', overflowY: 'auto', backgroundColor: '#fafbfc' }}>
          {/* Image Gallery */}
          {selectedProduct?.images && selectedProduct.images.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  mb: 2.5,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              >
                <img
                  src={selectedProduct.images[currentImageIndex]?.url}
                  alt={selectedProduct.images[currentImageIndex]?.alt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '20px'
                  }}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E'
                  }}
                />

                {selectedProduct.images.length > 1 && (
                  <>
                    <IconButton
                      onClick={handlePreviousImage}
                      sx={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        width: 44,
                        height: 44,
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.8)'
                        }
                      }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>

                    <IconButton
                      onClick={handleNextImage}
                      sx={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        width: 44,
                        height: 44,
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.8)'
                        }
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>

                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                        backgroundColor: 'rgba(0,0,0,0.75)',
                        color: '#fff',
                        px: 2,
                        py: 0.75,
                        borderRadius: 1,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      {currentImageIndex + 1} / {selectedProduct.images.length}
                    </Box>
                  </>
                )}
              </Box>

              {selectedProduct.images.length > 1 && (
                <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: 4 }, '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: 2 } }}>
                  {selectedProduct.images.map((image, index) => (
                    <Box
                      key={image.id || index}
                      onClick={() => setCurrentImageIndex(index)}
                      sx={{
                        width: 80,
                        height: 80,
                        minWidth: 80,
                        borderRadius: 1.5,
                        border: currentImageIndex === index ? '3px solid #667eea' : '2px solid #e2e8f0',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        backgroundColor: '#f8f9fa',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#667eea',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                        }
                      }}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          padding: 6
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Summary Stats */}
          <Box mb={4}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#1e293b' }}>
              Thống kê tồn kho
            </Typography>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap={2}>
              <Paper elevation={0} sx={{ p: 2.5, backgroundColor: '#f0f4ff', border: '2px solid #e0e7ff', borderRadius: 2, textAlign: 'center', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 4px 12px rgba(102,126,234,0.15)', transform: 'translateY(-2px)' } }}>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 700, color: '#667eea', display: 'block', mb: 1 }}>Tồn kho</Typography>
                <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b', mb: 0.5 }}>{selectedProduct?.total_on_hand || 0}</Typography>
                <Typography variant="caption" color="text.secondary">{selectedProduct?.variants_count || 0} biến thể</Typography>
              </Paper>

              <Paper elevation={0} sx={{ p: 2.5, backgroundColor: '#fff7ed', border: '2px solid #fed7aa', borderRadius: 2, textAlign: 'center', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 4px 12px rgba(234,88,12,0.15)', transform: 'translateY(-2px)' } }}>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 700, color: '#ea580c', display: 'block', mb: 1 }}>Đã đặt</Typography>
                <Typography variant="h4" fontWeight={700} sx={{ color: '#ea580c', mb: 0.5 }}>{selectedProduct?.total_reserved || 0}</Typography>
                <Typography variant="caption" color="text.secondary">Chờ xử lý</Typography>
              </Paper>

              <Paper elevation={0} sx={{ p: 2.5, backgroundColor: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: 2, textAlign: 'center', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 4px 12px rgba(22,163,74,0.15)', transform: 'translateY(-2px)' } }}>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 700, color: '#16a34a', display: 'block', mb: 1 }}>Có thể bán</Typography>
                <Typography variant="h4" fontWeight={700} sx={{ color: '#16a34a', mb: 0.5 }}>{selectedProduct?.total_available || 0}</Typography>
                <Typography variant="caption" color="text.secondary">Sẵn bán</Typography>
              </Paper>

              <Paper elevation={0} sx={{ p: 2.5, backgroundColor: '#fff5f5', border: '2px solid #fecaca', borderRadius: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 4px 12px rgba(220,38,38,0.15)', transform: 'translateY(-2px)' } }}>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 700, color: '#7c2d12', display: 'block', mb: 1 }}>Trạng thái</Typography>
                <Chip 
                  label={selectedProduct?.status?.label || 'N/A'} 
                  color={selectedProduct?.status?.color || 'default'} 
                  sx={{ fontWeight: 600, alignSelf: 'center', mb: 0.5 }}
                />
              </Paper>
            </Box>
          </Box>

          {/* Variants */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#1e293b' }}>
              Chi tiết biến thể ({selectedProduct?.variants_count || 0})
            </Typography>
            {selectedProduct?.variants && selectedProduct.variants.length > 0 ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                {selectedProduct.variants.map((variant) => (
                  <Paper 
                    key={variant.id} 
                    elevation={0}
                    sx={{
                      p: 2.5,
                      border: '1px solid #e2e8f0',
                      borderRadius: 2,
                      backgroundColor: '#fff',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#cbd5e1',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e2e8f0' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box flex={1}>
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#667eea', mb: 0.5 }}>
                            {variant.display || '-'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            SKU: {variant.sku}
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={700} sx={{ color: '#1e293b', textAlign: 'right' }}>
                          {formatCurrency(variant.price)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5, fontWeight: 500 }}>Tồn kho</Typography>
                        <Typography 
                          variant="h6" 
                          fontWeight={700}
                          sx={{
                            color: variant.on_hand === 0 ? '#dc2626' : '#1e293b'
                          }}
                        >
                          {variant.on_hand}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5, fontWeight: 500 }}>Đã đặt</Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#ea580c' }}>
                          {variant.reserved}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5, fontWeight: 500 }}>Có thể bán</Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#16a34a' }}>
                          {variant.available}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Paper elevation={0} sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: 2, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <Typography variant="body2" color="text.secondary">
                  Không có dữ liệu biến thể
                </Typography>
              </Paper>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained" sx={{ backgroundColor: '#667eea', color: '#fff' }}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
