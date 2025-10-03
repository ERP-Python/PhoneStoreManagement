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
  InputAdornment
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material'
import api from '../../api/axios'
import CustomerForm from '../../components/CustomerForm/CustomerForm'
import Notification from '../../components/Notification/Notification'
import { customersStyles } from './Customers.styles'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' })

  const fetchCustomers = async () => {
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
      
      const response = await api.get('/customers/', { params })
      
      setCustomers(response.data.results || response.data)
      setTotalCount(response.data.count || response.data.length)
    } catch (err) {
      console.error('Error fetching customers:', err)
      setError('Không thể tải danh sách khách hàng. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [page, rowsPerPage])

  const handleSearch = () => {
    setPage(0)
    fetchCustomers()
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
    if (!window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      return
    }
    
    try {
      await api.delete(`/customers/${id}/`)
      fetchCustomers()
      setNotification({ open: true, message: 'Xóa khách hàng thành công!', severity: 'success' })
    } catch (err) {
      console.error('Error deleting customer:', err)
      setNotification({ open: true, message: 'Không thể xóa khách hàng. Vui lòng thử lại.', severity: 'error' })
    }
  }

  const handleAdd = () => {
    setSelectedCustomer(null)
    setFormOpen(true)
  }

  const handleEdit = (customer) => {
    setSelectedCustomer(customer)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setSelectedCustomer(null)
  }

  const handleFormSuccess = (message) => {
    fetchCustomers()
    setNotification({ open: true, message: message || 'Lưu khách hàng thành công!', severity: 'success' })
  }

  if (loading && customers.length === 0) {
    return (
      <Box sx={customersStyles.loadingContainer}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={customersStyles.header}>
        <Typography variant="h4">
          Quản lý Khách hàng
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Thêm khách hàng
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={customersStyles.errorAlert} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={customersStyles.searchPaper}>
        <Box sx={customersStyles.searchBox}>
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm kiếm theo tên, số điện thoại, email..."
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
          <IconButton onClick={fetchCustomers} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên khách hàng</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Không tìm thấy khách hàng nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>
                    <Box sx={customersStyles.contactBox}>
                      <PhoneIcon fontSize="small" color="action" />
                      {customer.phone || '-'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {customer.email ? (
                      <Box sx={customersStyles.contactBox}>
                        <EmailIcon fontSize="small" color="action" />
                        {customer.email}
                      </Box>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    {customer.address ? (
                      <Typography {...customersStyles.addressText}>
                        {customer.address}
                      </Typography>
                    ) : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(customer)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(customer.id)}
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

      <CustomerForm
        open={formOpen}
        onClose={handleFormClose}
        customer={selectedCustomer}
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
