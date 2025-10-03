import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Box,
  Typography,
  IconButton,
  Autocomplete,
  Chip,
  Divider
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon, Warning as WarningIcon } from '@mui/icons-material'
import api from '../../api/axios'
import { orderFormStyles } from './OrderForm.styles'

export default function OrderForm({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    code: '',
    customer: null,
    status: 'pending',
    note: ''
  })
  const [items, setItems] = useState([{ product_variant: null, qty: 1, unit_price: 0, available_stock: 0 }])
  const [customers, setCustomers] = useState([])
  const [productVariants, setProductVariants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (open) {
      fetchCustomers()
      fetchProductVariants()
      // Generate order code
      const code = 'ORD-' + Date.now().toString().slice(-8)
      setFormData(prev => ({ ...prev, code }))
      setItems([{ product_variant: null, qty: 1, unit_price: 0, available_stock: 0 }])
      setError(null)
    }
  }, [open])

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers/')
      setCustomers(response.data.results || response.data)
    } catch (err) {
      console.error('Error fetching customers:', err)
    }
  }

  const fetchProductVariants = async () => {
    try {
      const response = await api.get('/products/variants/')
      setProductVariants(response.data.results || response.data)
    } catch (err) {
      console.error('Error fetching variants:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleItemChange = async (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value

    // If product variant changed, fetch stock info and set price
    if (field === 'product_variant' && value) {
      const variant = productVariants.find(v => v.id === value)
      if (variant) {
        newItems[index].unit_price = variant.price
        
        // Fetch current stock
        try {
          const response = await api.get(`/inventory/?product_variant=${value}`)
          const inventoryData = response.data.results || response.data
          if (inventoryData.length > 0) {
            const availableStock = inventoryData[0].on_hand - (inventoryData[0].reserved || 0)
            newItems[index].available_stock = Math.max(0, availableStock)
          } else {
            newItems[index].available_stock = 0
          }
        } catch (err) {
          console.error('Error fetching stock:', err)
          newItems[index].available_stock = 0
        }
      }
    }

    setItems(newItems)
  }

  const handleAddItem = () => {
    setItems([...items, { product_variant: null, qty: 1, unit_price: 0, available_stock: 0 }])
  }

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const calculateItemTotal = (item) => {
    return (item.qty || 0) * (item.unit_price || 0)
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + calculateItemTotal(item)
    }, 0)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const validateItems = () => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item.product_variant) {
        setError(`Vui lòng chọn sản phẩm cho dòng ${i + 1}`)
        return false
      }
      if (!item.qty || item.qty <= 0) {
        setError(`Số lượng sản phẩm dòng ${i + 1} phải lớn hơn 0`)
        return false
      }
      if (item.qty > item.available_stock) {
        setError(`Sản phẩm dòng ${i + 1}: Chỉ còn ${item.available_stock} sản phẩm trong kho`)
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!validateItems()) {
      return
    }

    setLoading(true)

    try {
      const orderData = {
        code: formData.code,
        customer: formData.customer,
        status: formData.status,
        note: formData.note,
        items: items.map(item => ({
          product_variant: item.product_variant,
          qty: parseInt(item.qty)
        }))
      }

      await api.post('/orders/', orderData)
      onSuccess('Tạo đơn hàng thành công!')
      onClose()
    } catch (err) {
      console.error('Error creating order:', err)
      setError(err.response?.data?.detail || err.response?.data?.error || 'Có lỗi xảy ra khi tạo đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} {...orderFormStyles.dialog}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Tạo Đơn hàng mới</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={orderFormStyles.errorAlert} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Grid container spacing={orderFormStyles.gridSpacing} sx={orderFormStyles.gridContainer}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Mã đơn hàng"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Nhập mã đơn hàng"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Autocomplete
                  options={customers}
                  getOptionLabel={(option) => `${option.name} - ${option.phone}`}
                  value={customers.find(c => c.id === formData.customer) || null}
                  onChange={(_, newValue) => {
                    setFormData(prev => ({ ...prev, customer: newValue?.id || null }))
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Khách hàng" placeholder="Tìm khách hàng..." />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Trạng thái"
                >
                  <MenuItem value="pending">Chờ thanh toán</MenuItem>
                  <MenuItem value="paid">Đã thanh toán</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ghi chú"
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Ghi chú đơn hàng..."
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={orderFormStyles.divider} />
              <Box sx={orderFormStyles.itemsHeader}>
                <Typography {...orderFormStyles.itemsTitle}>Sản phẩm</Typography>
                <Button startIcon={<AddIcon />} onClick={handleAddItem} variant="outlined">
                  Thêm sản phẩm
                </Button>
              </Box>

              {items.map((item, index) => {
                const itemTotal = calculateItemTotal(item)
                const isLowStock = item.available_stock > 0 && item.available_stock <= 10
                const isOutOfStock = item.available_stock === 0
                
                return (
                  <Box key={index} sx={orderFormStyles.itemBox}>
                    <Grid container spacing={orderFormStyles.gridSpacing} alignItems="center">
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                          <Autocomplete
                            options={productVariants}
                            getOptionLabel={(option) => {
                              const parts = []
                              // Dùng product_detail thay vì product
                              if (option.product_detail?.name) parts.push(option.product_detail.name)
                              if (option.ram) parts.push(option.ram)
                              if (option.rom) parts.push(option.rom)
                              if (option.color) parts.push(option.color)
                              return parts.join(' - ')
                            }}
                            value={productVariants.find(v => v.id === item.product_variant) || null}
                            onChange={(_, newValue) => {
                              handleItemChange(index, 'product_variant', newValue?.id || null)
                            }}
                            renderInput={(params) => (
                              <TextField {...params} label="Sản phẩm" required placeholder="Chọn sản phẩm..." />
                            )}
                          />
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={6} sm={2}>
                        <TextField
                          fullWidth
                          required
                          type="number"
                          label="Số lượng"
                          value={item.qty}
                          onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                          inputProps={{ min: 1, max: item.available_stock }}
                          placeholder="SL"
                          error={item.qty > item.available_stock}
                        />
                      </Grid>

                      <Grid item xs={6} sm={2}>
                        <TextField
                          fullWidth
                          label="Đơn giá"
                          value={formatCurrency(item.unit_price)}
                          InputProps={{ readOnly: true }}
                          disabled
                        />
                      </Grid>

                      <Grid item xs={10} sm={1}>
                        <Box sx={orderFormStyles.itemTotal}>
                          <Typography {...orderFormStyles.itemTotalCaption}>Thành tiền</Typography>
                          <Typography {...orderFormStyles.itemTotalValue}>
                            {formatCurrency(itemTotal)}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={2} sm={1}>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(index)}
                          disabled={items.length === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>

                      {item.product_variant && (
                        <Grid item xs={12}>
                          <Box sx={orderFormStyles.stockChipBox}>
                            {isOutOfStock ? (
                              <Chip 
                                icon={<WarningIcon />} 
                                label="Hết hàng" 
                                color="error" 
                                size="small" 
                              />
                            ) : isLowStock ? (
                              <Chip 
                                icon={<WarningIcon />} 
                                label={`Còn ${item.available_stock} sản phẩm`} 
                                color="warning" 
                                size="small" 
                              />
                            ) : (
                              <Chip 
                                label={`Còn ${item.available_stock} sản phẩm`} 
                                color="success" 
                                size="small" 
                              />
                            )}
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )
              })}

              <Box sx={orderFormStyles.totalBox}>
                <Grid container spacing={orderFormStyles.gridSpacing}>
                  <Grid item xs={6}>
                    <Typography {...orderFormStyles.totalLabel}>
                      Tổng số lượng:
                    </Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography {...orderFormStyles.totalValue}>
                      {items.reduce((sum, item) => sum + (parseInt(item.qty) || 0), 0)} sản phẩm
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography {...orderFormStyles.totalLabelLarge}>
                      TỔNG TIỀN:
                    </Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography {...orderFormStyles.totalValueLarge}>
                      {formatCurrency(calculateTotal())}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Đang tạo...' : 'Tạo đơn hàng'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
