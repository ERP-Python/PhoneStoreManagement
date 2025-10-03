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
  Chip
} from '@mui/material'
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon
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
      
      const response = await api.get('/inventory/', { params })
      
      setInventory(response.data.results || response.data)
      setTotalCount(response.data.count || response.data.length)
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

  const getStockStatus = (onHand, reorderLevel) => {
    if (onHand === 0) {
      return { label: 'Hết hàng', color: 'error' }
    }
    if (onHand <= reorderLevel) {
      return { label: 'Sắp hết', color: 'warning' }
    }
    return { label: 'Còn hàng', color: 'success' }
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
            label={`${inventory.filter(i => i.on_hand <= i.reorder_level).length} sản phẩm sắp hết`}
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
              <TableCell>Biến thể</TableCell>
              <TableCell align="right">Tồn kho</TableCell>
              <TableCell align="right">Đã đặt</TableCell>
              <TableCell align="right">Có thể bán</TableCell>
              <TableCell align="right">Mức cảnh báo</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : inventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Không tìm thấy dữ liệu tồn kho
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              inventory.map((item) => {
                const status = getStockStatus(item.on_hand, item.reorder_level)
                return (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.product_variant?.sku || item.sku || '-'}</TableCell>
                    <TableCell>
                      {item.product_variant?.product?.name || 
                       item.product_variant_name || 
                       item.product_name || '-'}
                    </TableCell>
                    <TableCell>
                      <Typography {...inventoryStyles.variantText}>
                        {item.product_variant?.ram && `${item.product_variant.ram} / `}
                        {item.product_variant?.rom && `${item.product_variant.rom}`}
                        {item.product_variant?.color && ` - ${item.product_variant.color}`}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        sx={item.on_hand === 0 ? inventoryStyles.stockTextError : inventoryStyles.stockText}
                      >
                        {item.on_hand || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{item.reserved || 0}</TableCell>
                    <TableCell align="right">
                      <Typography {...inventoryStyles.availableText}>
                        {(item.on_hand || 0) - (item.reserved || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{item.reorder_level || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={status.label}
                        color={status.color}
                        {...inventoryStyles.statusChip}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
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
    </Box>
  )
}
