import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'  // ← THÊM DÒNG NÀY
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
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import { useAlert } from '../../context/AlertContext'
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  Payment as PaymentIcon
} from '@mui/icons-material'
import api from '../../api/axios'
import OrderForm from '../../components/OrderForm/OrderForm'
import Notification from '../../components/Notification/Notification'
import PaymentDialog from '../../components/PaymentDialog/PaymentDialog'
import OrderDetailDialog from '../../components/OrderDetailDialog/OrderDetailDialog'
import { ordersStyles, statusColors, statusLabels } from './Orders.styles'

export default function Orders() {
  const { showInfo } = useAlert()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' })
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState(null)

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
      
      const response = await api.get('/orders/', { params })
      
      setOrders(response.data.results || response.data)
      setTotalCount(response.data.count || response.data.length)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // Handle VNPay payment callback
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const paymentStatus = params.get('payment_status')
    
    if (paymentStatus === 'success') {
      setNotification({
        open: true,
        message: '✅ Thanh toán VNPay thành công!',
        severity: 'success'
      })
      fetchOrders()
      navigate('/orders', { replace: true })
    } else if (paymentStatus === 'failed') {
      setNotification({
        open: true,
        message: '❌ Thanh toán VNPay thất bại. Vui lòng thử lại.',
        severity: 'error'
      })
      fetchOrders()
      navigate('/orders', { replace: true })
    }
  }, [location.search, navigate])

  useEffect(() => {
    fetchOrders()
  }, [page, rowsPerPage, statusFilter])

  const handleSearch = () => {
    setPage(0)
    fetchOrders()
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const handleAdd = () => {
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
  }

  const handleFormSuccess = (message) => {
    fetchOrders()
    setNotification({ open: true, message: message || 'Thao tác thành công!', severity: 'success' })
  }

  const handlePayment = (order) => {
    setSelectedOrder(order)
    setPaymentDialogOpen(true)
  }

  const handlePaymentSuccess = (message) => {
    fetchOrders()
    setNotification({ open: true, message, severity: 'success' })
  }

  const handleViewDetail = (order) => {
    setSelectedOrderForDetail(order)
    setDetailDialogOpen(true)
  }

  const handleDetailClose = () => {
    setDetailDialogOpen(false)
    setSelectedOrderForDetail(null)
  }

  const handlePrint = (order) => {
    // TODO: Implement print functionality
    showInfo(`In hóa đơn #${order.code}`)
  }

  if (loading && orders.length === 0) {
    return (
      <Box sx={ordersStyles.loadingContainer}>
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
          Quản lý Đơn hàng
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
          Quản lý danh sách đơn hàng và thanh toán
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={ordersStyles.errorAlert} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2, border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
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
            value={statusFilter}
            displayEmpty
            onChange={(e) => {
              setStatusFilter(e.target.value)
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
              <span style={{ color: '#94a3b8' }}>Trạng thái</span>
            </MenuItem>
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="pending">Chờ thanh toán</MenuItem>
            <MenuItem value="paid">Đã thanh toán</MenuItem>
            <MenuItem value="cancelled">Đã hủy</MenuItem>
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
          Tìm
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
          Tạo đơn hàng
        </Button>

        <IconButton 
          onClick={fetchOrders} 
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
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Tên khách hàng</TableCell>
              <TableCell align="right">Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Không tìm thấy đơn hàng nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>{order.code}</TableCell>
                  <TableCell>
                    {order.customer?.name || order.customer_name || 'Khách lẻ'}
                  </TableCell>
                  <TableCell align="right">
                    <Typography {...ordersStyles.totalText}>
                      {formatCurrency(order.total)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[order.status] || order.status}
                      color={statusColors[order.status] || 'default'}
                      {...ordersStyles.statusChip}
                    />
                  </TableCell>
                  <TableCell>{formatDateTime(order.created_at)}</TableCell>
                  <TableCell align="right">
                    {order.status === 'pending' && (
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handlePayment(order)}
                        title="Thanh toán"
                      >
                        <PaymentIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewDetail(order)}
                      title="Xem chi tiết"
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => handlePrint(order)}
                      title="In hóa đơn"
                    >
                      <PrintIcon fontSize="small" />
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

      <OrderForm
        open={formOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />

      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        order={selectedOrder}
        onSuccess={handlePaymentSuccess}
      />

      <OrderDetailDialog
        open={detailDialogOpen}
        onClose={handleDetailClose}
        order={selectedOrderForDetail}
        onPrint={handlePrint}
        onPayment={handlePayment}
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