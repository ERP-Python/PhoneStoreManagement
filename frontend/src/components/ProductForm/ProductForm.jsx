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
  FormControlLabel,
  Checkbox,
  Grid,
  Alert,
  Box,
  Typography,
  IconButton,
  Divider,
  Paper
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import api from '../../api/axios'
import { productFormStyles } from './ProductForm.styles'

export default function ProductForm({ open, onClose, product, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    brand: '',
    description: '',
    is_active: true
  })
  const [variants, setVariants] = useState([
    { ram: '', rom: '', color: '', sku: '', price: '', is_active: true }
  ])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (open) {
      fetchBrands()
      if (product) {
        // Edit mode
        setFormData({
          name: product.name || '',
          sku: product.sku || '',
          barcode: product.barcode || '',
          brand: product.brand?.id || product.brand || '',
          description: product.description || '',
          is_active: product.is_active !== undefined ? product.is_active : true
        })
        
        // Load variants if available
        if (product.variants && product.variants.length > 0) {
          setVariants(product.variants.map(v => ({
            id: v.id,
            ram: v.ram || '',
            rom: v.rom || '',
            color: v.color || '',
            sku: v.sku || '',
            price: v.price || '',
            is_active: v.is_active !== undefined ? v.is_active : true
          })))
        } else {
          setVariants([{ ram: '', rom: '', color: '', sku: '', price: '', is_active: true }])
        }
      } else {
        // Add mode - reset form
        setFormData({
          name: '',
          sku: '',
          barcode: '',
          brand: '',
          description: '',
          is_active: true
        })
        setVariants([{ ram: '', rom: '', color: '', sku: '', price: '', is_active: true }])
      }
      setError(null)
    }
  }, [open, product])

  const fetchBrands = async () => {
    try {
      const response = await api.get('/brands/')
      setBrands(response.data.results || response.data)
    } catch (err) {
      console.error('Error fetching brands:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants]
    newVariants[index][field] = value
    
    // Auto-generate SKU if fields are filled
    if (['ram', 'rom', 'color'].includes(field) && formData.sku) {
      const v = newVariants[index]
      if (v.ram || v.rom || v.color) {
        const parts = [formData.sku]
        if (v.ram) parts.push(v.ram.replace(/GB|gb/gi, ''))
        if (v.rom) parts.push(v.rom.replace(/GB|gb/gi, ''))
        if (v.color) parts.push(v.color.substring(0, 1).toUpperCase())
        newVariants[index].sku = parts.join('-')
      }
    }
    
    setVariants(newVariants)
  }

  const handleAddVariant = () => {
    setVariants([...variants, { ram: '', rom: '', color: '', sku: '', price: '', is_active: true }])
  }

  const handleRemoveVariant = (index) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate variants
      const validVariants = variants.filter(v => v.sku && v.price)
      if (validVariants.length === 0) {
        setError('Vui lòng thêm ít nhất một biến thể với SKU và giá')
        setLoading(false)
        return
      }

      if (product) {
        // Update product
        await api.put(`/products/${product.id}/`, formData)
        
        // Update/Create/Delete variants
        for (const variant of validVariants) {
          const variantData = {
            product: product.id,
            ram: variant.ram || null,
            rom: variant.rom || null,
            color: variant.color || null,
            sku: variant.sku,
            price: parseFloat(variant.price),
            is_active: variant.is_active
          }
          
          if (variant.id) {
            // Update existing variant
            await api.put(`/products/variants/${variant.id}/`, variantData)
          } else {
            // Create new variant
            await api.post('/products/variants/', variantData)
          }
        }
        
        onSuccess('Cập nhật sản phẩm và biến thể thành công!')
      } else {
        // Create product first
        const productResponse = await api.post('/products/', formData)
        const productId = productResponse.data.id
        
        // Then create variants
        for (const variant of validVariants) {
          const variantData = {
            product: productId,
            ram: variant.ram || null,
            rom: variant.rom || null,
            color: variant.color || null,
            sku: variant.sku,
            price: parseFloat(variant.price),
            is_active: variant.is_active
          }
          await api.post('/products/variants/', variantData)
        }
        
        onSuccess('Thêm sản phẩm và biến thể thành công!')
      }
      onClose()
    } catch (err) {
      console.error('Error saving product:', err)
      const errorMsg = err.response?.data?.sku?.[0] || err.response?.data?.detail || 'Có lỗi xảy ra khi lưu sản phẩm'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} {...productFormStyles.dialog}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {product ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm mới'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={productFormStyles.errorAlert}>
              {error}
            </Alert>
          )}

          {/* Product Base Information */}
          <Typography {...productFormStyles.sectionTitle}>
            Thông tin cơ bản
          </Typography>
          <Grid container spacing={productFormStyles.gridSpacing}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Tên sản phẩm"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="VD: iPhone 15 Pro Max"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Thương hiệu</InputLabel>
                <Select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  label="Thương hiệu"
                >
                  {brands.map(brand => (
                    <MenuItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="VD: IP15PM"
                {...productFormStyles.helperText}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="VD: 1234567890123"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Mô tả"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả chi tiết về sản phẩm..."
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />
                }
                label="Kích hoạt sản phẩm"
              />
            </Grid>
          </Grid>

          {/* Product Variants */}
          <Divider sx={productFormStyles.divider} />
          <Box sx={productFormStyles.variantHeader}>
            <Typography {...productFormStyles.variantTitle}>
              Biến thể sản phẩm (RAM, ROM, Màu sắc)
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddVariant}
              variant="outlined"
              size="small"
            >
              Thêm biến thể
            </Button>
          </Box>

          {variants.map((variant, index) => (
            <Paper key={index} sx={productFormStyles.variantPaper}>
              <Grid container spacing={productFormStyles.gridSpacing}>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="RAM"
                    value={variant.ram}
                    onChange={(e) => handleVariantChange(index, 'ram', e.target.value)}
                    placeholder="8GB"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="ROM"
                    value={variant.rom}
                    onChange={(e) => handleVariantChange(index, 'rom', e.target.value)}
                    placeholder="256GB"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="Màu sắc"
                    value={variant.color}
                    onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                    placeholder="Đen"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    required
                    label="SKU Biến thể"
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                    placeholder="IP15PM-8-256-D"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Giá (VNĐ)"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                    placeholder="34990000"
                    size="small"
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveVariant(index)}
                    disabled={variants.length === 1}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
