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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  Divider
} from '@mui/material'
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  CheckCircle as ApproveIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import api from '../../api/axios'
import Notification from '../../components/Notification/Notification'
import { purchaseOrdersStyles } from './PurchaseOrders.styles'
import { formatNumber, parseFormattedNumber } from '../../utils/formatters'

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' })
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    supplier: '',
    note: '',
    items: [{ product_variant: '', qty: 1, unit_cost: '' }]
  })

  const fetchOrders = async () => {
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

      if (statusFilter) {
        params.status = statusFilter
      }

      const response = await api.get('/purchase-orders/', { params })

      setOrders(response.data.results || response.data)
      setTotalCount(response.data.count || response.data.length)
    } catch (err) {
      console.error('Error fetching purchase orders:', err)
      setError('Không thể tải danh sách đơn đặt hàng.')
    } finally {
      setLoading(false)
    }
  }

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers/', { params: { is_active: true } })
      setSuppliers(response.data.results || response.data)
    } catch (err) {
      console.error('Error fetching suppliers:', err)
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

  useEffect(() => {
    fetchSuppliers()
    fetchProducts()
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [page, rowsPerPage, statusFilter])

  const handleSearch = () => {
    setPage(0)
    fetchOrders()
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleViewDetail = async (order) => {
    try {
      const response = await api.get(`/purchase-orders/${order.id}/`)
      setSelectedOrder(response.data)
      setDetailDialogOpen(true)
    } catch (err) {
      console.error('Error fetching order detail:', err)
      setNotification({
        open: true,
        message: 'Không thể tải chi tiết đơn hàng',
        severity: 'error'
      })
    }
  }

  const handleApprove = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn duyệt đơn đặt hàng này?')) {
      return
    }

    try {
      await api.post(`/purchase-orders/${id}/approve/`)
      setNotification({
        open: true,
        message: 'Duyệt đơn đặt hàng thành công',
        severity: 'success'
      })
      fetchOrders()
    } catch (err) {
      console.error('Error approving order:', err)
      setNotification({
        open: true,
        message: err.response?.data?.error || 'Không thể duyệt đơn đặt hàng',
        severity: 'error'
      })
    }
  }

  const handleAddNew = () => {
    setFormData({
      supplier: '',
      note: '',
      items: [{ product_variant: '', qty: 1, unit_cost: '' }]
    })
    setFormOpen(true)
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
      if (!formData.supplier) {
        setNotification({
          open: true,
          message: 'Vui lòng chọn nhà cung cấp',
          severity: 'error'
        })
        return
      }

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
        supplier: parseInt(formData.supplier),
        note: formData.note || '',
        items: formData.items.map(item => ({
          product_variant: parseInt(item.product_variant),
          unit_cost: parseInt(item.unit_cost) || 0,
          qty: parseInt(item.qty) || 1
        }))
      }

      console.log('Submitting purchase order data:', cleanedData)
      await api.post('/purchase-orders/', cleanedData)
      setNotification({
        open: true,
        message: 'Tạo đơn đặt hàng thành công',
        severity: 'success'
      })
      setFormOpen(false)
      fetchOrders()
    } catch (err) {
      console.error('Error creating purchase order:', err)
      console.error('Error response:', err.response?.data)
      setNotification({
        open: true,
        message: err.response?.data?.detail || err.response?.data?.error || JSON.stringify(err.response?.data) || 'Không thể tạo đơn đặt hàng',
        severity: 'error'
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'default'
      case 'approved': return 'success'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'draft': return 'Nháp'
      case 'approved': return 'Đã duyệt'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  return (
    <Box sx={purchaseOrdersStyles.container}>
      <Paper elevation={0} sx={purchaseOrdersStyles.header}>
        <Box sx={purchaseOrdersStyles.headerContent}>
          <Box>
            <Typography variant="h5" sx={purchaseOrdersStyles.title}>
              Quản lý đơn đặt hàng
            </Typography>
            <Typography variant="body2" sx={purchaseOrdersStyles.subtitle}>
              Quản lý đơn đặt hàng từ nhà cung cấp (Purchase Orders)
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={purchaseOrdersStyles.addButton}
          >
            Tạo đơn đặt hàng
          </Button>
        </Box>
      </Paper>

      <Paper elevation={0} sx={purchaseOrdersStyles.contentPaper}>
        <Box sx={purchaseOrdersStyles.toolbarContainer}>
          <TextField
            placeholder="Tìm kiếm đơn đặt hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={purchaseOrdersStyles.searchField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={purchaseOrdersStyles.searchIcon} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Trạng thái"
            >
              <SelectMenuItem value="">Tất cả</SelectMenuItem>
              <SelectMenuItem value="draft">Nháp</SelectMenuItem>
              <SelectMenuItem value="approved">Đã duyệt</SelectMenuItem>
              <SelectMenuItem value="cancelled">Đã hủy</SelectMenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            sx={purchaseOrdersStyles.searchButton}
          >
            Tìm kiếm
          </Button>
          <IconButton onClick={fetchOrders} sx={purchaseOrdersStyles.iconButton}>
            <RefreshIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={purchaseOrdersStyles.alert}>{error}</Alert>
        )}

        {loading ? (
          <Box sx={purchaseOrdersStyles.loadingContainer}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={purchaseOrdersStyles.tableHeaderCell}>Mã PO</TableCell>
                    <TableCell sx={purchaseOrdersStyles.tableHeaderCell}>Nhà cung cấp</TableCell>
                    <TableCell sx={purchaseOrdersStyles.tableHeaderCell}>Ngày tạo</TableCell>
                    <TableCell sx={purchaseOrdersStyles.tableHeaderCell}>Trạng thái</TableCell>
                    <TableCell sx={purchaseOrdersStyles.tableHeaderCell} align="right">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell sx={purchaseOrdersStyles.tableCell}>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#667eea' }}>
                          {order.code}
                        </Typography>
                      </TableCell>
                      <TableCell sx={purchaseOrdersStyles.tableCell}>
                        {order.supplier_name}
                      </TableCell>
                      <TableCell sx={purchaseOrdersStyles.tableCell}>
                        {new Date(order.created_at).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(order.status)}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleViewDetail(order)}
                          size="small"
                          sx={purchaseOrdersStyles.actionButton}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        {order.status === 'draft' && (
                          <IconButton
                            onClick={() => handleApprove(order.id)}
                            size="small"
                            sx={{ ...purchaseOrdersStyles.actionButton, color: '#4caf50' }}
                          >
                            <ApproveIcon fontSize="small" />
                          </IconButton>
                        )}
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
              sx={purchaseOrdersStyles.pagination}
            />
          </>
        )}
      </Paper>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết đơn đặt hàng</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Mã PO</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedOrder.code}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Nhà cung cấp</Typography>
                <Typography variant="body1">{selectedOrder.supplier_name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Trạng thái</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={getStatusLabel(selectedOrder.status)}
                    color={getStatusColor(selectedOrder.status)}
                    size="small"
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Ngày tạo</Typography>
                <Typography variant="body1">
                  {new Date(selectedOrder.created_at).toLocaleDateString('vi-VN')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>Danh sách sản phẩm</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Sản phẩm</TableCell>
                        <TableCell align="right">Số lượng</TableCell>
                        <TableCell align="right">Giá</TableCell>
                        <TableCell align="right">Thành tiền</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items?.map((item, index) => (
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
                <Typography variant="h6" align="right" sx={{ mt: 2 }}>
                  Tổng cộng: {parseInt(selectedOrder.total_amount || 0).toLocaleString('vi-VN')} ₫
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Create Form Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Tạo đơn đặt hàng mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Nhà cung cấp</InputLabel>
                <Select
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  label="Nhà cung cấp"
                >
                  {suppliers.map((supplier) => (
                    <SelectMenuItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
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
                      label="Giá"
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
          <Button onClick={handleFormSubmit} variant="contained">Tạo đơn</Button>
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

