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
  Grid
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Business as BusinessIcon
} from '@mui/icons-material'
import api from '../../api/axios'
import Notification from '../../components/Notification/Notification'
import { suppliersStyles } from './Suppliers.styles'

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' })
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    address: '',
    note: '',
    is_active: true
  })

  const fetchSuppliers = async () => {
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

      const response = await api.get('/suppliers/', { params })

      setSuppliers(response.data.results || response.data)
      setTotalCount(response.data.count || response.data.length)
    } catch (err) {
      console.error('Error fetching suppliers:', err)
      setError('Không thể tải danh sách nhà cung cấp. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [page, rowsPerPage])

  const handleSearch = () => {
    setPage(0)
    fetchSuppliers()
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleAddNew = () => {
    setSelectedSupplier(null)
    setFormData({
      name: '',
      contact: '',
      phone: '',
      email: '',
      address: '',
      note: '',
      is_active: true
    })
    setFormOpen(true)
  }

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier)
    setFormData({
      name: supplier.name,
      contact: supplier.contact || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      note: supplier.note || '',
      is_active: supplier.is_active
    })
    setFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?')) {
      return
    }

    try {
      await api.delete(`/suppliers/${id}/`)
      setNotification({
        open: true,
        message: 'Xóa nhà cung cấp thành công !',
        severity: 'success'
      })
      fetchSuppliers()
    } catch (err) {
      console.error('Error deleting supplier:', err)
      setNotification({
        open: true,
        message: err.response?.data?.detail || 'Không thể xóa nhà cung cấp',
        severity: 'error'
      })
    }
  }

  const handleFormSubmit = async () => {
    try {
      if (selectedSupplier) {
        await api.patch(`/suppliers/${selectedSupplier.id}/`, formData)
        setNotification({
          open: true,
          message: 'Cập nhật nhà cung cấp thành công',
          severity: 'success'
        })
      } else {
        await api.post('/suppliers/', formData)
        setNotification({
          open: true,
          message: 'Thêm nhà cung cấp thành công',
          severity: 'success'
        })
      }

      setFormOpen(false)
      fetchSuppliers()
    } catch (err) {
      console.error('Error saving supplier:', err)
      setNotification({
        open: true,
        message: err.response?.data?.detail || 'Không thể lưu nhà cung cấp',
        severity: 'error'
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <Box sx={suppliersStyles.container}>
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
          Quản lý nhà cung cấp
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
          Quản lý thông tin nhà cung cấp sản phẩm
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2, border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Tìm kiếm nhà cung cấp..."
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
          Thêm nhà cung cấp
        </Button>

        <IconButton 
          onClick={fetchSuppliers} 
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
          <Alert severity="error" sx={suppliersStyles.alert}>{error}</Alert>
        )}

        {loading ? (
          <Box sx={suppliersStyles.loadingContainer}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={suppliersStyles.tableHeaderCell}>Tên NCC</TableCell>
                    <TableCell sx={suppliersStyles.tableHeaderCell}>Người liên hệ</TableCell>
                    <TableCell sx={suppliersStyles.tableHeaderCell}>SĐT</TableCell>
                    <TableCell sx={suppliersStyles.tableHeaderCell}>Email</TableCell>
                    <TableCell sx={suppliersStyles.tableHeaderCell}>Trạng thái</TableCell>
                    <TableCell sx={suppliersStyles.tableHeaderCell} align="right">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id} hover>
                      <TableCell sx={suppliersStyles.tableCell}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BusinessIcon sx={{ color: '#667eea' }} />
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {supplier.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={suppliersStyles.tableCell}>
                        {supplier.contact || '-'}
                      </TableCell>
                      <TableCell sx={suppliersStyles.tableCell}>
                        {supplier.phone || '-'}
                      </TableCell>
                      <TableCell sx={suppliersStyles.tableCell}>
                        {supplier.email || '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={supplier.is_active ? 'Hoạt động' : 'Không hoạt động'}
                          color={supplier.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleEdit(supplier)}
                          size="small"
                          sx={suppliersStyles.actionButton}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(supplier.id)}
                          size="small"
                          sx={{ ...suppliersStyles.actionButton, color: '#f44336' }}
                        >
                          <DeleteIcon fontSize="small" />
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
              sx={suppliersStyles.pagination}
            />
          </>
        )}


      {/* Form Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedSupplier ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên nhà cung cấp"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Người liên hệ"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Hủy</Button>
          <Button onClick={handleFormSubmit} variant="contained">
            {selectedSupplier ? 'Cập nhật' : 'Thêm'}
          </Button>
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

