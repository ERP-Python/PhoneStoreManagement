import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  Chip
} from '@mui/material'
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import api from '../../api/axios'
import Notification from '../../components/Notification/Notification'
import { stockInStyles } from './StockIn.styles'
import { formatNumber, parseFormattedNumber } from '../../utils/formatters'

export default function StockIn() {
  const location = useLocation()
  const [stockIns, setStockIns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' })
  const [formOpen, setFormOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedStockIn, setSelectedStockIn] = useState(null)
  const [products, setProducts] = useState([])
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [formData, setFormData] = useState({
    source: 'MANUAL',
    reference_id: null,
    note: '',
    items: [{ product_variant: '', qty: 1, unit_cost: '' }]
  })

  const fetchStockIns = async () => {
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

      const response = await api.get('/stock-in/', { params })

      setStockIns(response.data.results || response.data)
      setTotalCount(response.data.count || response.data.length)
    } catch (err) {
      console.error('Error fetching stock ins:', err)
      setError('Không thể tải danh sách phiếu nhập kho.')
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/variants/')
      setProducts(response.data.results || response.data)
    } catch (err) {
      console.error('Error fetching products:', err)
    }
  }

  const fetchPurchaseOrders = async () => {
    try {
      const response = await api.get('/purchase-orders/', { params: { status: 'approved' } })
      setPurchaseOrders(response.data.results || response.data)
    } catch (err) {
      console.error('Error fetching purchase orders:', err)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchPurchaseOrders()
  }, [])

  // Handle pre-selected items from LowStockAlert
  useEffect(() => {
    if (location.state?.preSelectedItems && products.length > 0) {
      const preSelectedItems = location.state.preSelectedItems
      const items = preSelectedItems.map(item => {
        // Tìm product trong danh sách để lấy giá
        const product = products.find(p => p.id === item.product_variant)
        const unit_cost = product?.price || item.price || ''
        
        return {
          product_variant: item.product_variant,
          qty: item.suggested_qty,
          unit_cost: unit_cost
        }
      })
      
      setFormData({
        source: 'MANUAL',
        reference_id: null,
        note: 'Nhập kho cho sản phẩm sắp hết hàng',
        items: items
      })
      
      setFormOpen(true)
      
      // Clear state after using
      window.history.replaceState({}, document.title)
    }
  }, [location.state, products])

  useEffect(() => {
    fetchStockIns()
  }, [page, rowsPerPage])

  const handleSearch = () => {
    setPage(0)
    fetchStockIns()
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleAddNew = () => {
    setFormData({
      source: 'MANUAL',
      reference_id: null,
      note: '',
      items: [{ product_variant: '', qty: 1, unit_cost: '' }]
    })
    setFormOpen(true)
  }

  const handleViewDetail = async (stockIn) => {
    try {
      const response = await api.get(`/stock-in/${stockIn.id}/`)
      setSelectedStockIn(response.data)
      setDetailOpen(true)
    } catch (err) {
      console.error('Error fetching stock in detail:', err)
      setNotification({
        open: true,
        message: 'Không thể tải chi tiết phiếu nhập kho',
        severity: 'error'
      })
    }
  }

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product_variant: '', qty: 1, unit_cost: '' }]
    }))
  }

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const handleItemChange = (index, field, value) => {
    let processedValue = value

    if (field === 'unit_cost') {
      // Remove all dots and keep only numbers
      const cleanValue = value.toString().replace(/\./g, '').replace(/[^0-9]/g, '')
      processedValue = cleanValue === '' ? '' : parseInt(cleanValue) || 0
    } else if (field === 'qty') {
      processedValue = parseInt(value) || 1
    } else if (field === 'product_variant') {
      // Tự động điền giá khi chọn sản phẩm
      const selectedProduct = products.find(p => p.id === value)
      if (selectedProduct && selectedProduct.price) {
        setFormData(prev => ({
          ...prev,
          items: prev.items.map((item, i) => 
            i === index ? { ...item, product_variant: value, unit_cost: selectedProduct.price } : item
          )
        }))
        return
      }
      processedValue = value
    }

    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: processedValue } : item
      )
    }))
  }

  const handleFormSubmit = async () => {
    try {
      // Validate
      if (!formData.items || formData.items.length === 0) {
        setNotification({
          open: true,
          message: 'Vui lòng thêm ít nhất một sản phẩm',
          severity: 'error'
        })
        return
      }

      // Check if all items have product_variant
      const invalidItems = formData.items.filter(item => !item.product_variant)
      if (invalidItems.length > 0) {
        setNotification({
          open: true,
          message: 'Vui lòng chọn sản phẩm cho tất cả các mục',
          severity: 'error'
        })
        return
      }

      // Validate and clean data
      const cleanedData = {
        ...formData,
        items: formData.items.map(item => ({
          product_variant: parseInt(item.product_variant),
          unit_cost: parseInt(item.unit_cost) || 0,
          qty: parseInt(item.qty) || 1
        }))
      }

      console.log('Submitting stock in data:', cleanedData)
      await api.post('/stock-in/', cleanedData)
      setNotification({
        open: true,
        message: 'Tạo phiếu nhập kho thành công',
        severity: 'success'
      })
      setFormOpen(false)
      fetchStockIns()
    } catch (err) {
      console.error('Error creating stock in:', err)
      console.error('Error response:', err.response?.data)
      setNotification({
        open: true,
        message: err.response?.data?.detail || err.response?.data?.error || JSON.stringify(err.response?.data) || 'Không thể tạo phiếu nhập kho',
        severity: 'error'
      })
    }
  }

  return (
    <Box sx={stockInStyles.container}>
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
          Nhập kho
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
          Quản lý phiếu nhập kho và lịch sử nhập hàng
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2, border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Tìm kiếm phiếu nhập kho..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
          onClick={handleAddNew}
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
          Tạo phiếu nhập kho
        </Button>

        <IconButton 
          onClick={fetchStockIns} 
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

        {error && (
          <Alert severity="error" sx={stockInStyles.alert}>{error}</Alert>
        )}

        {loading ? (
          <Box sx={stockInStyles.loadingContainer}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={stockInStyles.tableHeaderCell}>Mã phiếu</TableCell>
                    <TableCell sx={stockInStyles.tableHeaderCell}>Nguồn</TableCell>
                    <TableCell sx={stockInStyles.tableHeaderCell}>Người tạo</TableCell>
                    <TableCell sx={stockInStyles.tableHeaderCell}>Ngày tạo</TableCell>
                    <TableCell sx={stockInStyles.tableHeaderCell} align="right">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockIns.map((stockIn) => (
                    <TableRow key={stockIn.id} hover>
                      <TableCell sx={stockInStyles.tableCell}>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#667eea' }}>
                          {stockIn.code}
                        </Typography>
                      </TableCell>
                      <TableCell sx={stockInStyles.tableCell}>
                        <Chip
                          label={stockIn.source === 'PO' ? 'Từ PO' : 'Thủ công'}
                          size="small"
                          color={stockIn.source === 'PO' ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell sx={stockInStyles.tableCell}>
                        {stockIn.created_by_name}
                      </TableCell>
                      <TableCell sx={stockInStyles.tableCell}>
                        {new Date(stockIn.created_at).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleViewDetail(stockIn)}
                          size="small"
                          sx={stockInStyles.actionButton}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Số hàng mỗi trang:"
              sx={stockInStyles.pagination}
            />
          </>
        )}


      {/* Create Form Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Tạo phiếu nhập kho mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Nguồn nhập</InputLabel>
                <Select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  label="Nguồn nhập"
                >
                  <SelectMenuItem value="MANUAL">Nhập thủ công</SelectMenuItem>
                  <SelectMenuItem value="PO">Từ đơn đặt hàng</SelectMenuItem>
                </Select>
              </FormControl>
            </Grid>
            {formData.source === 'PO' && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Đơn đặt hàng</InputLabel>
                  <Select
                    value={formData.reference_id || ''}
                    onChange={(e) => setFormData({ ...formData, reference_id: e.target.value })}
                    label="Đơn đặt hàng"
                  >
                    {purchaseOrders.map((po) => (
                      <SelectMenuItem key={po.id} value={po.id}>
                        {po.code} - {po.supplier_name}
                      </SelectMenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1 }}>Danh sách sản phẩm</Typography>
              {formData.items.map((item, index) => (
                <Grid container spacing={1} key={index} sx={{ mb: 2 }}>
                  <Grid item xs={5}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Sản phẩm</InputLabel>
                      <Select
                        value={item.product_variant}
                        onChange={(e) => handleItemChange(index, 'product_variant', e.target.value)}
                        label="Sản phẩm"
                      >
                        {products.map((product) => (
                          <SelectMenuItem key={product.id} value={product.id}>
                            {product.product_detail?.name} - {product.ram} {product.rom}
                          </SelectMenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Số lượng"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Giá nhập"
                      value={item.unit_cost ? formatNumber(item.unit_cost) : ''}
                      onChange={(e) => handleItemChange(index, 'unit_cost', e.target.value)}
                      placeholder="Nhập giá..."
                      InputProps={{
                        inputProps: {
                          style: { textAlign: 'right' }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={() => handleRemoveItem(index)} color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button startIcon={<AddIcon />} onClick={handleAddItem} size="small">
                Thêm sản phẩm
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Hủy</Button>
          <Button onClick={handleFormSubmit} variant="contained">Tạo phiếu</Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết phiếu nhập kho</DialogTitle>
        <DialogContent>
          {selectedStockIn && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Mã phiếu</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedStockIn.code}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Nguồn</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={selectedStockIn.source === 'PO' ? 'Từ PO' : 'Thủ công'}
                    size="small"
                    color={selectedStockIn.source === 'PO' ? 'primary' : 'default'}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Danh sách sản phẩm</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Sản phẩm</TableCell>
                        <TableCell align="right">Số lượng</TableCell>
                        <TableCell align="right">Giá nhập</TableCell>
                        <TableCell align="right">Thành tiền</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedStockIn.items?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.product_variant_name}</TableCell>
                          <TableCell align="right">{item.qty}</TableCell>
                          <TableCell align="right">{parseInt(item.unit_cost).toLocaleString('vi-VN')} ₫</TableCell>
                          <TableCell align="right">{parseInt(item.line_total).toLocaleString('vi-VN')} ₫</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </Box>
  )
}

