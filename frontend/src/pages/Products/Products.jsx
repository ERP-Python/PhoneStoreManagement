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

  if (loading && products.length === 0) {
    return (
      <Box sx={productsStyles.loadingContainer}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={productsStyles.header}>
        <Typography variant="h4">
          Quản lý Sản phẩm
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={productsStyles.errorAlert} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={productsStyles.searchPaper}>
        <Box sx={productsStyles.searchBox}>
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm kiếm theo tên, SKU, barcode..."
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
          <IconButton onClick={fetchProducts} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
        <Box sx={productsStyles.filterBox}>
          <FormControl size="small" sx={productsStyles.filterControl}>
            <InputLabel>Lọc theo thương hiệu</InputLabel>
            <Select
              value={brandFilter}
              label="Lọc theo thương hiệu"
              onChange={(e) => {
                setBrandFilter(e.target.value)
                setPage(0)
              }}
            >
              <MenuItem value="">Tất cả thương hiệu</MenuItem>
              {brands.map(brand => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
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
                      src={product.images?.[0]?.image || product.primary_image}
                      alt={product.name}
                      variant="rounded"
                      sx={productsStyles.productAvatar}
                    />
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
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
        onClose={handleFormClose}
        product={selectedProduct}
        onSuccess={handleFormSuccess}
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
