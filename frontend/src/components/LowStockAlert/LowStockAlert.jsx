import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Box,
  IconButton,
  Alert,
  Checkbox
} from '@mui/material'
import {
  Warning as WarningIcon,
  Close as CloseIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { lowStockAlertStyles } from './LowStockAlert.styles'

export default function LowStockAlert({ open, onClose }) {
  const [lowStockItems, setLowStockItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const navigate = useNavigate()

  const fetchLowStockItems = async () => {
    try {
      setLoading(true)
      const response = await api.get('/inventory/', {
        params: {
          page_size: 100
        }
      })
      
      // Filter items with stock <= 10
      const items = (response.data.results || response.data).filter(
        item => item.on_hand <= 10 && item.on_hand >= 0
      )
      setLowStockItems(items)
    } catch (err) {
      console.error('Error fetching low stock items:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchLowStockItems()
      setSelectedItems([])
    }
  }, [open])

  const handleCreatePurchaseOrder = () => {
    onClose()
    navigate('/purchase-orders')
  }

  const handleCreateStockIn = () => {
    if (selectedItems.length === 0) {
      // Nếu không chọn gì, chỉ chuyển đến trang stock-in
      onClose()
      navigate('/stock-in')
      return
    }

    // Chuyển dữ liệu sản phẩm đã chọn qua state với đầy đủ thông tin
    const itemsToAdd = selectedItems.map(id => {
      const item = lowStockItems.find(i => i.id === id)
      return {
        product_variant: item.product_variant,
        product_name: item.product_name,
        variant_detail: item.variant_display || item.variant_detail,
        suggested_qty: Math.max(20 - item.on_hand, 10), // Gợi ý số lượng cần nhập
        price: item.price || 0 // Giá từ hệ thống
      }
    })

    onClose()
    navigate('/stock-in', { state: { preSelectedItems: itemsToAdd } })
  }

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === lowStockItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(lowStockItems.map(item => item.id))
    }
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Hết hàng', color: 'error' }
    if (stock <= 5) return { label: 'Rất thấp', color: 'error' }
    if (stock <= 10) return { label: 'Thấp', color: 'warning' }
    return { label: 'Bình thường', color: 'success' }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: lowStockAlertStyles.dialog
      }}
    >
      <DialogTitle sx={lowStockAlertStyles.title}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon sx={{ color: '#ff9800' }} />
          <Typography variant="h6">Cảnh báo sản phẩm sắp hết hàng</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={lowStockAlertStyles.content}>
        {loading ? (
          <Typography align="center" sx={{ py: 4 }}>Đang tải...</Typography>
        ) : lowStockItems.length === 0 ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Tất cả sản phẩm đều còn đủ hàng trong kho!
          </Alert>
        ) : (
          <>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Có <strong>{lowStockItems.length}</strong> sản phẩm sắp hết hàng hoặc đã hết hàng. 
              {selectedItems.length > 0 && (
                <> Đã chọn <strong>{selectedItems.length}</strong> sản phẩm để nhập kho.</>
              )}
            </Alert>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={lowStockAlertStyles.tableHeader} padding="checkbox">
                      <Checkbox
                        checked={selectedItems.length === lowStockItems.length && lowStockItems.length > 0}
                        indeterminate={selectedItems.length > 0 && selectedItems.length < lowStockItems.length}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell sx={lowStockAlertStyles.tableHeader}>Sản phẩm</TableCell>
                    <TableCell sx={lowStockAlertStyles.tableHeader}>Thương hiệu</TableCell>
                    <TableCell sx={lowStockAlertStyles.tableHeader} align="right">Tồn kho</TableCell>
                    <TableCell sx={lowStockAlertStyles.tableHeader} align="center">Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStockItems.map((item) => {
                    const status = getStockStatus(item.on_hand)
                    const isSelected = selectedItems.includes(item.id)
                    return (
                      <TableRow 
                        key={item.id} 
                        hover 
                        onClick={() => handleSelectItem(item.id)}
                        sx={{ 
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'rgba(102, 126, 234, 0.08)' : 'inherit'
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelectItem(item.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.product_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.variant_detail}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{item.brand_name}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 700,
                              color: item.on_hand === 0 ? '#f44336' : item.on_hand <= 5 ? '#ff9800' : '#fb8c00'
                            }}
                          >
                            {item.on_hand}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={status.label}
                            color={status.color}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>

      <DialogActions sx={lowStockAlertStyles.actions}>
        <Button onClick={onClose} color="inherit">
          Đóng
        </Button>
        <Button
          variant="outlined"
          startIcon={<ShoppingCartIcon />}
          onClick={handleCreatePurchaseOrder}
          color="primary"
        >
          Tạo đơn đặt hàng
        </Button>
        <Button
          variant="contained"
          startIcon={<ShoppingCartIcon />}
          onClick={handleCreateStockIn}
          color="success"
          disabled={loading}
        >
          Nhập kho ngay {selectedItems.length > 0 && `(${selectedItems.length})`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
