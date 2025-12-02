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
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import api from '../../api/axios'
import ProductForm from '../../components/ProductForm/ProductForm'
import ProductDetailDialog from '../../components/ProductDetailDialog/ProductDetailDialog'
import Notification from '../../components/Notification/Notification'
import { productsStyles } from './Products.styles'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' })
  const [brands, setBrands] = useState([])
  const [brandFilter, setBrandFilter] = useState('')
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedProductDetail, setSelectedProductDetail] = useState(null)

  const fetchProducts = async () => {
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

      if (brandFilter) {
        params.brand = brandFilter
      }

      const response = await api.get('/products/', { params })

      setProducts(response.data.results || response.data)
      setTotalCount(response.data.count || response.data.length)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await api.get('/brands/')
      setBrands(response.data.results || response.data)
    } catch (err) {
      console.error('Error fetching brands:', err)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [page, rowsPerPage, brandFilter])

  const handleSearch = () => {
    setPage(0)
    fetchProducts()
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

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return
    }

    try {
      await api.delete(`/products/${id}/`)
      fetchProducts()
      setNotification({ open: true, message: 'Xóa sản phẩm thành công!', severity: 'success' })
    } catch (err) {
      console.error('Error deleting product:', err)
      setNotification({ open: true, message: 'Không thể xóa sản phẩm. Vui lòng thử lại.', severity: 'error' })
    }
  }

  const handleAdd = () => {
    setSelectedProduct(null)
    setFormOpen(true)
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setSelectedProduct(null)
  }

  const handleFormSuccess = (message) => {
    fetchProducts()
    setNotification({ open: true, message: message || 'Lưu sản phẩm thành công!', severity: 'success' })
  }

  const handleViewDetail = (product) => {
    setSelectedProductDetail(product)
    setDetailDialogOpen(true)
  }

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false)
    setSelectedProductDetail(null)
  }

  if (loading && products.length === 0) {
    return (
      <Box sx={productsStyles.loadingContainer}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h5"
          sx={{
            m: 0,
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.4,
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            color: '#1e293b'
          }}
        >
          Quản lý Sản phẩm
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
          Quản lý danh sách sản phẩm và kho hàng
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={productsStyles.errorAlert} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2, border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Tìm kiếm theo tên, SKU, barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleSearchKeyPress}
          size="small"
          sx={{
            flex: 1,
            minWidth: '200px',
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#f8f9fa',
              borderRadius: 1,
              '& fieldset': {
                borderColor: '#e2e8f0',
              },
              '&:hover fieldset': {
                borderColor: '#cbd5e1',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#667eea',
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select
            value={brandFilter}
            displayEmpty
            onChange={(e) => {
              setBrandFilter(e.target.value)
              setPage(0)
            }}
            sx={{
              backgroundColor: '#fff',
              borderRadius: 1,
              height: 40,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e2e8f0',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#cbd5e1',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#667eea',
              }
            }}
          >
            <MenuItem value="">
              <span style={{ color: '#94a3b8' }}>Lọc theo thương hiệu</span>
            </MenuItem>
            <MenuItem value="">Tất cả thương hiệu</MenuItem>
            {brands.map(brand => (
              <MenuItem key={brand.id} value={brand.id}>
                {brand.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            backgroundColor: '#667eea',
            color: '#fff',
            height: 40,
            px: 3,
            borderRadius: 1,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#5a67d8',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }}
        >
          Tìm kiếm
        </Button>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            height: 40,
            px: 2,
            borderRadius: 1,
            borderColor: '#667eea',
            color: '#667eea',
            textTransform: 'none',
            whiteSpace: 'nowrap',
            '&:hover': {
              borderColor: '#5a67d8',
              backgroundColor: 'rgba(102, 126, 234, 0.04)'
            },
          }}
        >
          Thêm sản phẩm
        </Button>

        <IconButton
          onClick={fetchProducts}
          sx={{
            border: '1px solid #e2e8f0',
            borderRadius: 1,
            color: '#64748b',
            height: 40,
            width: 40,
            '&:hover': {
              backgroundColor: '#f8f9fa',
              color: '#667eea',
              borderColor: '#667eea'
            }
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Thương hiệu</TableCell>
              <TableCell>Giá bán</TableCell>
              <TableCell>Số biến thể</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Không tìm thấy sản phẩm nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Avatar
                      src={product.primary_image?.image || product.images?.[0]?.image || '/assets/images/1.jpg'}
                      alt={product.name}
                      variant="rounded"
                      sx={productsStyles.productAvatar}
                    />
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        cursor: 'pointer',
                        color: '#667eea',
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline',
                          color: '#5a67d8'
                        }
                      }}
                      onClick={() => handleViewDetail(product)}
                    >
                      {product.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{product.brand?.name || product.brand_name || '-'}</TableCell>
                  <TableCell>
                    <Typography {...productsStyles.priceText}>
                      {product.price_range?.display || 'Chưa có giá'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.variants_count || product.variants?.length || 0}
                      {...productsStyles.variantChip}
                      color={product.variants_count > 0 ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.is_active ? 'Hoạt động' : 'Ngưng'}
                      color={product.is_active ? 'success' : 'default'}
                      {...productsStyles.statusChip}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(product)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(product.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
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

      <ProductForm
        open={formOpen}
        onClose={() => { handleFormClose(); handleChangePage(); }}
        product={selectedProduct}
        onSuccess={handleFormSuccess}
      />

      <ProductDetailDialog
        open={detailDialogOpen}
        onClose={handleDetailDialogClose}
        product={selectedProductDetail}
      />

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </Box>
  )
}
