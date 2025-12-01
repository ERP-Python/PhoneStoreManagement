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
  Avatar,
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
  Store as StoreIcon
} from '@mui/icons-material'
import api from '../../api/axios'
import Notification from '../../components/Notification/Notification'
import { brandsStyles } from './Brands.styles'

export default function Brands() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' })
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: null,
    is_active: true
  })

  const fetchBrands = async () => {
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

      const response = await api.get('/brands/', { params })

      setBrands(response.data.results || response.data)
      setTotalCount(response.data.count || response.data.length)
    } catch (err) {
      console.error('Error fetching brands:', err)
      setError('Không thể tải danh sách thương hiệu. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [page, rowsPerPage])

  const handleSearch = () => {
    setPage(0)
    fetchBrands()
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleAddNew = () => {
    setSelectedBrand(null)
    setFormData({
      name: '',
      description: '',
      logo: null,
      is_active: true
    })
    setFormOpen(true)
  }

  const handleEdit = (brand) => {
    setSelectedBrand(brand)
    setFormData({
      name: brand.name,
      description: brand.description || '',
      logo: null,
      is_active: brand.is_active
    })
    setFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      return
    }

    try {
      await api.delete(`/brands/${id}/`)
      setNotification({
        open: true,
        message: 'Xóa thương hiệu thành công',
        severity: 'success'
      })
      fetchBrands()
    } catch (err) {
      console.error('Error deleting brand:', err)
      setNotification({
        open: true,
        message: err.response?.data?.detail || 'Không thể xóa thương hiệu',
        severity: 'error'
      })
    }
  }

  const handleFormSubmit = async () => {
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('is_active', formData.is_active)
      
      if (formData.logo && typeof formData.logo !== 'string') {
        formDataToSend.append('logo', formData.logo)
      }

      if (selectedBrand) {
        await api.patch(`/brands/${selectedBrand.id}/`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setNotification({
          open: true,
          message: 'Cập nhật thương hiệu thành công',
          severity: 'success'
        })
      } else {
        await api.post('/brands/', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setNotification({
          open: true,
          message: 'Thêm thương hiệu thành công',
          severity: 'success'
        })
      }

      setFormOpen(false)
      fetchBrands()
    } catch (err) {
      console.error('Error saving brand:', err)
      setNotification({
        open: true,
        message: err.response?.data?.detail || 'Không thể lưu thương hiệu',
        severity: 'error'
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }))
  }

  return (
    <Box sx={brandsStyles.container}>
      <Paper elevation={0} sx={brandsStyles.header}>
        <Box sx={brandsStyles.headerContent}>
          <Box>
            <Typography variant="h5" sx={brandsStyles.title}>
              Quản lý thương hiệu
            </Typography>
            <Typography variant="body2" sx={brandsStyles.subtitle}>
              Quản lý thương hiệu điện thoại
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={brandsStyles.addButton}
          >
            Thêm thương hiệu
          </Button>
        </Box>
      </Paper>

      <Paper elevation={0} sx={brandsStyles.contentPaper}>
        <Box sx={brandsStyles.toolbarContainer}>
          <TextField
            placeholder="Tìm kiếm thương hiệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={brandsStyles.searchField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={brandsStyles.searchIcon} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            sx={brandsStyles.searchButton}
          >
            Tìm kiếm
          </Button>
          <IconButton onClick={fetchBrands} sx={brandsStyles.iconButton}>
            <RefreshIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={brandsStyles.alert}>{error}</Alert>
        )}

        {loading ? (
          <Box sx={brandsStyles.loadingContainer}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={brandsStyles.tableHeaderCell}>Logo</TableCell>
                    <TableCell sx={brandsStyles.tableHeaderCell}>Tên thương hiệu</TableCell>
                    <TableCell sx={brandsStyles.tableHeaderCell}>Mô tả</TableCell>
                    <TableCell sx={brandsStyles.tableHeaderCell}>Trạng thái</TableCell>
                    <TableCell sx={brandsStyles.tableHeaderCell} align="right">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {brands.map((brand) => (
                    <TableRow key={brand.id} hover>
                      <TableCell>
                        {brand.logo ? (
                          <Avatar
                            src={brand.logo}
                            alt={brand.name}
                            variant="rounded"
                            sx={{ width: 48, height: 48 }}
                          />
                        ) : (
                          <Avatar variant="rounded" sx={{ width: 48, height: 48, bgcolor: '#667eea' }}>
                            <StoreIcon />
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell sx={brandsStyles.tableCell}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {brand.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={brandsStyles.tableCell}>
                        {brand.description || '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={brand.is_active ? 'Hoạt động' : 'Không hoạt động'}
                          color={brand.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleEdit(brand)}
                          size="small"
                          sx={brandsStyles.actionButton}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(brand.id)}
                          size="small"
                          sx={{ ...brandsStyles.actionButton, color: '#f44336' }}
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
              sx={brandsStyles.pagination}
            />
          </>
        )}
      </Paper>

      {/* Form Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedBrand ? 'Sửa thương hiệu' : 'Thêm thương hiệu mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên thương hiệu"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
              >
                Upload Logo
                <input
                  type="file"
                  name="logo"
                  hidden
                  accept="image/*"
                  onChange={handleInputChange}
                />
              </Button>
              {formData.logo && (
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {typeof formData.logo === 'string' ? formData.logo : formData.logo.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Hủy</Button>
          <Button onClick={handleFormSubmit} variant="contained">
            {selectedBrand ? 'Cập nhật' : 'Thêm'}
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

