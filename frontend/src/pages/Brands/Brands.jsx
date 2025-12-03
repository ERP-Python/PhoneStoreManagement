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
import BrandDetailModal from './BrandDetailModal'

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
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedBrandForDetail, setSelectedBrandForDetail] = useState(null)
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' })
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true
  })
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)

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
      is_active: true
    })
    setLogoFile(null)
    setLogoPreview(null)
    setFormOpen(true)
  }

  const handleEdit = (brand) => {
    setSelectedBrand(brand)
    setFormData({
      name: brand.name,
      description: brand.description || '',
      is_active: brand.is_active
    })
    setLogoFile(null)
    setLogoPreview(brand.logo || null)
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

  const handleViewDetail = (brand) => {
    setSelectedBrandForDetail(brand)
    setDetailModalOpen(true)
  }

  const handleFormSubmit = async () => {
    try {
      // First, create or update the brand with text data only
      let brand
      if (selectedBrand) {
        const response = await api.patch(`/brands/${selectedBrand.id}/`, {
          name: formData.name,
          description: formData.description,
          is_active: formData.is_active
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        brand = response.data
      } else {
        const response = await api.post('/brands/', {
          name: formData.name,
          description: formData.description,
          is_active: formData.is_active
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        brand = response.data
      }

      // Upload logo if a file was selected
      if (logoFile && brand.id) {
        const logoFormData = new FormData()
        logoFormData.append('logo', logoFile)
        
        try {
          await api.post(`/brands/${brand.id}/upload_logo/`, logoFormData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          setNotification({
            open: true,
            message: selectedBrand ? 'Cập nhật thương hiệu và logo thành công' : 'Thêm thương hiệu và logo thành công',
            severity: 'success'
          })
        } catch (err) {
          console.error('Error uploading logo:', err)
          setNotification({
            open: true,
            message: 'Thương hiệu đã lưu nhưng không thể tải logo lên',
            severity: 'warning'
          })
        }
      } else {
        setNotification({
          open: true,
          message: selectedBrand ? 'Cập nhật thương hiệu thành công' : 'Thêm thương hiệu thành công',
          severity: 'success'
        })
      }

      setFormOpen(false)
      fetchBrands()
    } catch (err) {
      console.error('Error saving brand:', err)
      setNotification({
        open: true,
        message: err.response?.data?.detail || err.response?.data?.name?.[0] || 'Không thể lưu thương hiệu',
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

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogoFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = async () => {
    if (selectedBrand && selectedBrand.logo) {
      try {
        await api.delete(`/brands/${selectedBrand.id}/delete_logo/`)
        setLogoPreview(null)
        setNotification({
          open: true,
          message: 'Xóa logo thành công',
          severity: 'success'
        })
        fetchBrands()
      } catch (err) {
        console.error('Error deleting logo:', err)
        setNotification({
          open: true,
          message: 'Không thể xóa logo',
          severity: 'error'
        })
      }
    } else {
      setLogoFile(null)
      setLogoPreview(null)
    }
  }

  return (
    <Box sx={brandsStyles.container}>
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
          Quản lý thương hiệu
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
          Quản lý thương hiệu điện thoại
        </Typography>
      </Box>

      {/* Toolbar Section */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2, border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Tìm kiếm thương hiệu..."
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
          Thêm thương hiệu
        </Button>

        <IconButton 
          onClick={fetchBrands} 
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

      {/* Table Section */}
      <Paper elevation={0} sx={{ ...brandsStyles.contentPaper, border: '1px solid #e2e8f0', borderRadius: 2 }}>
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
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 600,
                            cursor: 'pointer',
                            color: '#667eea',
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          }}
                          onClick={() => handleViewDetail(brand)}
                        >
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
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Logo thương hiệu
                </Typography>
                {logoPreview ? (
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                      src={logoPreview}
                      alt="Logo preview"
                      variant="rounded"
                      sx={{ width: 120, height: 120, mb: 1 }}
                    />
                    <IconButton
                      size="small"
                      onClick={handleRemoveLogo}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AddIcon />}
                    fullWidth
                  >
                    Tải lên Logo
                    <input
                      type="file"
                      hidden
                      accept="image/jpeg,image/jpg,image/svg+xml"
                      onChange={handleLogoChange}
                    />
                  </Button>
                )}
              </Box>
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

      <BrandDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        brand={selectedBrandForDetail}
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

