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
  Paper,
  Card,
  CardMedia,
  CardActions
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon, CloudUpload, Star, StarBorder } from '@mui/icons-material'
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
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

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
        
        // Load images if available
        if (product.images && product.images.length > 0) {
          setImagePreviews(product.images.map(img => ({
            id: img.id,
            url: img.image,
            isPrimary: img.is_primary,
            existing: true
          })))
        } else {
          setImagePreviews([])
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
        setImagePreviews([])
      }
      setImages([])
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const newImages = []
    const newPreviews = []

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        newImages.push(file)
        
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviews.push({
            url: reader.result,
            isPrimary: imagePreviews.length === 0 && newPreviews.length === 0,
            file: file,
            existing: false
          })
          
          if (newPreviews.length === files.length) {
            setImages(prev => [...prev, ...newImages])
            setImagePreviews(prev => [...prev, ...newPreviews])
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleRemoveImage = (index) => {
    const imageToRemove = imagePreviews[index]
    
    if (!imageToRemove.existing) {
      // Remove new image from files
      const imageFileIndex = images.findIndex(img => img === imageToRemove.file)
      if (imageFileIndex !== -1) {
        setImages(prev => prev.filter((_, i) => i !== imageFileIndex))
      }
    }
    
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSetPrimaryImage = (index) => {
    setImagePreviews(prev => prev.map((img, i) => ({
      ...img,
      isPrimary: i === index
    })))
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

      let productId
      
      if (product) {
        // Update product
        await api.put(`/products/${product.id}/`, formData)
        productId = product.id
        
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
      } else {
        // Create product first
        const productResponse = await api.post('/products/', formData)
        productId = productResponse.data.id
        
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
      }
      
      // Upload images if any
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const formDataImage = new FormData()
          formDataImage.append('product', productId)
          formDataImage.append('image', images[i])
          
          // Find corresponding preview to check if it's primary
          const previewIndex = imagePreviews.findIndex(p => p.file === images[i])
          if (previewIndex !== -1 && imagePreviews[previewIndex].isPrimary) {
            formDataImage.append('is_primary', 'true')
          } else {
            formDataImage.append('is_primary', 'false')
          }
          formDataImage.append('sort_order', i)
          
          await api.post('/products/images/', formDataImage, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        }
      }
      
      // Update existing images' primary status if changed
      for (let i = 0; i < imagePreviews.length; i++) {
        const preview = imagePreviews[i]
        if (preview.existing && preview.id) {
          // Check if primary status needs update
          const originalImage = product?.images?.find(img => img.id === preview.id)
          if (originalImage && originalImage.is_primary !== preview.isPrimary) {
            await api.patch(`/products/images/${preview.id}/`, {
              is_primary: preview.isPrimary
            })
          }
        }
      }
      
      onSuccess(product ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!')
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

          {/* Product Images */}
          <Divider sx={productFormStyles.divider} />
          <Box sx={productFormStyles.variantHeader}>
            <Typography {...productFormStyles.variantTitle}>
              Hình ảnh sản phẩm
            </Typography>
            <Button
              component="label"
              startIcon={<CloudUpload />}
              variant="outlined"
              size="small"
            >
              Tải ảnh lên
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </Button>
          </Box>
          
          {imagePreviews.length > 0 && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {imagePreviews.map((preview, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Card sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={preview.url}
                      alt={`Preview ${index + 1}`}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardActions sx={{ 
                      padding: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      backgroundColor: 'rgba(0,0,0,0.03)'
                    }}>
                      <IconButton
                        size="small"
                        onClick={() => handleSetPrimaryImage(index)}
                        color={preview.isPrimary ? 'warning' : 'default'}
                        title={preview.isPrimary ? 'Ảnh chính' : 'Đặt làm ảnh chính'}
                      >
                        {preview.isPrimary ? <Star /> : <StarBorder />}
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveImage(index)}
                        title="Xóa ảnh"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

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
