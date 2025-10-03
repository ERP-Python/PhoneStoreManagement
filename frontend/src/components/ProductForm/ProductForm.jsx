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
  Autocomplete,
  InputAdornment
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
  const [productSuggestions, setProductSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})

  // Utility function to get first character of color and uppercase it
  const getColorCode = (color) => {
    if (!color) return ''
    // Normalize Vietnamese characters and get first character uppercase
    const normalized = color.trim().charAt(0).toUpperCase()
    return normalized
  }

  // Utility function to format price with thousand separators
  const formatPrice = (value) => {
    if (!value) return ''
    // Remove all non-digit characters
    const numValue = value.toString().replace(/\D/g, '')
    // Add thousand separators
    return numValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  // Utility function to parse formatted price back to number
  const parsePrice = (value) => {
    if (!value) return ''
    return value.toString().replace(/\./g, '')
  }

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
            displayPrice: formatPrice(v.price || ''),
            is_active: v.is_active !== undefined ? v.is_active : true,
            skuManuallySet: true // SKU from DB is considered manually set
          })))
        } else {
          setVariants([{ ram: '', rom: '', color: '', sku: '', price: '', displayPrice: '', is_active: true }])
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
        setVariants([{ ram: '', rom: '', color: '', sku: '', price: '', displayPrice: '', is_active: true }])
        setProductSuggestions([])
      }
      setError(null)
      setValidationErrors({})
    }
  }, [open, product])

  // Fetch products when brand changes
  useEffect(() => {
    if (formData.brand && !product) {
      fetchProductsByBrand(formData.brand)
    }
  }, [formData.brand, product])

  // Auto-update variant SKUs when product SKU changes
  useEffect(() => {
    if (formData.sku && !product) {
      const newVariants = variants.map(variant => {
        // Only update if variant hasn't been manually set
        if (!variant.id && !variant.skuManuallySet && (variant.ram || variant.rom || variant.color)) {
          const parts = [formData.sku]
          if (variant.ram) parts.push(variant.ram.replace(/GB|gb|TB|tb/gi, ''))
          if (variant.rom) parts.push(variant.rom.replace(/GB|gb|TB|tb/gi, ''))
          if (variant.color) parts.push(getColorCode(variant.color))
          return { ...variant, sku: parts.join('-') }
        }
        return variant
      })
      setVariants(newVariants)
    }
  }, [formData.sku])

  const fetchBrands = async () => {
    try {
      const response = await api.get('/brands/')
      setBrands(response.data.results || response.data)
    } catch (err) {
      console.error('Error fetching brands:', err)
    }
  }

  const fetchProductsByBrand = async (brandId) => {
    try {
      const response = await api.get('/products/', {
        params: { brand: brandId, page_size: 100 }
      })
      setProductSuggestions(response.data.results || response.data)
    } catch (err) {
      console.error('Error fetching products:', err)
      setProductSuggestions([])
    }
  }

  const validateField = (field, value, variantIndex = null) => {
    const errors = { ...validationErrors }
    const key = variantIndex !== null ? `variant_${variantIndex}_${field}` : field

    switch (field) {
      case 'name':
        if (value && value.length < 2) {
          errors[key] = 'Tên sản phẩm phải có ít nhất 2 ký tự'
        } else {
          delete errors[key]
        }
        break

      case 'sku':
        if (value && !/^[A-Za-z0-9\-_]+$/.test(value)) {
          errors[key] = 'SKU chỉ được chứa chữ, số, dấu gạch ngang và gạch dưới'
        } else if (value && value.length < 2) {
          errors[key] = 'SKU phải có ít nhất 2 ký tự'
        } else {
          delete errors[key]
        }
        break

      case 'ram':
      case 'rom':
        if (value && !/^\d+\s?(GB|TB|gb|tb)?$/i.test(value)) {
          errors[key] = `${field.toUpperCase()} phải có định dạng: 8GB, 256GB, 1TB...`
        } else {
          delete errors[key]
        }
        break

      case 'color':
        if (value && value.length < 2) {
          errors[key] = 'Màu sắc phải có ít nhất 2 ký tự'
        } else if (value && !/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) {
          errors[key] = 'Màu sắc chỉ được chứa chữ cái'
        } else {
          delete errors[key]
        }
        break

      case 'price':
        const numValue = parseFloat(parsePrice(value))
        if (value && (isNaN(numValue) || numValue < 0)) {
          errors[key] = 'Giá phải là số dương'
        } else if (value && numValue < 1000) {
          errors[key] = 'Giá phải lớn hơn 1,000 VNĐ'
        } else if (value && numValue > 999999999) {
          errors[key] = 'Giá không được vượt quá 999,999,999 VNĐ'
        } else {
          delete errors[key]
        }
        break

      case 'barcode':
        if (value && !/^\d+$/.test(value)) {
          errors[key] = 'Barcode chỉ được chứa số'
        } else if (value && (value.length < 8 || value.length > 13)) {
          errors[key] = 'Barcode phải có từ 8-13 ký tự'
        } else {
          delete errors[key]
        }
        break

      default:
        delete errors[key]
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    const newValue = type === 'checkbox' ? checked : value
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    // Validate on change
    if (type !== 'checkbox') {
      validateField(name, newValue)
    }
  }

  const handleProductSelect = (event, selectedProduct) => {
    if (selectedProduct && typeof selectedProduct === 'object') {
      // User selected an existing product from suggestions
      setFormData(prev => ({
        ...prev,
        name: selectedProduct.name,
        sku: selectedProduct.sku,
        barcode: selectedProduct.barcode || '',
        description: selectedProduct.description || ''
      }))
    } else if (typeof selectedProduct === 'string') {
      // User typed a new product name
      setFormData(prev => ({
        ...prev,
        name: selectedProduct
      }))
    }
  }

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants]
    
    // Handle price separately to format it
    if (field === 'price') {
      const rawValue = parsePrice(value)
      newVariants[index].price = rawValue
      newVariants[index].displayPrice = formatPrice(rawValue)
      validateField(field, rawValue, index)
    } else {
      newVariants[index][field] = value
      // Validate variant field
      validateField(field, value, index)
    }
    
    // If user is manually editing SKU field, mark it as manually set
    if (field === 'sku') {
      newVariants[index].skuManuallySet = true
    }
    
    // Auto-generate SKU only if:
    // 1. It's a new variant (no id from DB)
    // 2. AND user hasn't manually set the SKU
    // 3. AND we're changing ram/rom/color fields
    if (['ram', 'rom', 'color'].includes(field) && 
        formData.sku && 
        !newVariants[index].id && 
        !newVariants[index].skuManuallySet) {
      const v = newVariants[index]
      if (v.ram || v.rom || v.color) {
        const parts = [formData.sku]
        if (v.ram) parts.push(v.ram.replace(/GB|gb|TB|tb/gi, ''))
        if (v.rom) parts.push(v.rom.replace(/GB|gb|TB|tb/gi, ''))
        if (v.color) parts.push(getColorCode(v.color))
        newVariants[index].sku = parts.join('-')
      }
    }
    
    setVariants(newVariants)
  }

  const handleAddVariant = () => {
    setVariants([...variants, { ram: '', rom: '', color: '', sku: '', price: '', displayPrice: '', is_active: true }])
  }

  const handleRemoveVariant = (index) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index))
      
      // Remove validation errors for this variant
      const newErrors = { ...validationErrors }
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`variant_${index}_`)) {
          delete newErrors[key]
        }
      })
      setValidationErrors(newErrors)
    }
  }

  const validateForm = () => {
    let isValid = true
    const errors = {}

    // Validate product fields
    if (!formData.name || formData.name.length < 2) {
      errors.name = 'Tên sản phẩm phải có ít nhất 2 ký tự'
      isValid = false
    }

    if (!formData.sku || formData.sku.length < 2) {
      errors.sku = 'SKU phải có ít nhất 2 ký tự'
      isValid = false
    } else if (!/^[A-Za-z0-9\-_]+$/.test(formData.sku)) {
      errors.sku = 'SKU chỉ được chứa chữ, số, dấu gạch ngang và gạch dưới'
      isValid = false
    }

    if (!formData.brand) {
      errors.brand = 'Vui lòng chọn thương hiệu'
      isValid = false
    }

    // Validate variants
    variants.forEach((variant, index) => {
      if (!variant.sku) {
        errors[`variant_${index}_sku`] = 'SKU biến thể là bắt buộc'
        isValid = false
      } else if (!/^[A-Za-z0-9\-_]+$/.test(variant.sku)) {
        errors[`variant_${index}_sku`] = 'SKU chỉ được chứa chữ, số, dấu gạch ngang và gạch dưới'
        isValid = false
      }

      const priceValue = parseFloat(variant.price)
      if (!variant.price || priceValue < 1000) {
        errors[`variant_${index}_price`] = 'Giá phải lớn hơn 1,000 VNĐ'
        isValid = false
      } else if (priceValue > 999999999) {
        errors[`variant_${index}_price`] = 'Giá không được vượt quá 999,999,999 VNĐ'
        isValid = false
      }

      // Validate RAM format if provided
      if (variant.ram && !/^\d+\s?(GB|TB|gb|tb)?$/i.test(variant.ram)) {
        errors[`variant_${index}_ram`] = 'RAM phải có định dạng: 8GB, 16GB...'
        isValid = false
      }

      // Validate ROM format if provided
      if (variant.rom && !/^\d+\s?(GB|TB|gb|tb)?$/i.test(variant.rom)) {
        errors[`variant_${index}_rom`] = 'ROM phải có định dạng: 256GB, 512GB, 1TB...'
        isValid = false
      }

      // Validate color if provided
      if (variant.color && !/^[a-zA-ZÀ-ỹ\s]+$/.test(variant.color)) {
        errors[`variant_${index}_color`] = 'Màu sắc chỉ được chứa chữ cái'
        isValid = false
      }
    })

    setValidationErrors(errors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form before submitting
    if (!validateForm()) {
      setError('Vui lòng kiểm tra lại các trường thông tin')
      return
    }

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

  const getErrorMessage = (field, variantIndex = null) => {
    const key = variantIndex !== null ? `variant_${variantIndex}_${field}` : field
    return validationErrors[key] || ''
  }

  const hasError = (field, variantIndex = null) => {
    const key = variantIndex !== null ? `variant_${variantIndex}_${field}` : field
    return !!validationErrors[key]
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
              <FormControl fullWidth required error={hasError('brand')}>
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
              <Autocomplete
                freeSolo
                options={productSuggestions}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                value={formData.name}
                onChange={handleProductSelect}
                onInputChange={(event, newInputValue) => {
                  setFormData(prev => ({ ...prev, name: newInputValue }))
                  validateField('name', newInputValue)
                }}
                disabled={!formData.brand || !!product}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Tên sản phẩm"
                    placeholder="VD: iPhone 15 Pro Max"
                    error={hasError('name')}
                    helperText={getErrorMessage('name') || (!formData.brand ? "Vui lòng chọn thương hiệu trước" : "")}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <Box>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        SKU: {option.sku}
                      </Typography>
                    </Box>
                  </li>
                )}
              />
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
                error={hasError('sku')}
                helperText={getErrorMessage('sku') || "Mã SKU duy nhất cho sản phẩm"}
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
                error={hasError('barcode')}
                helperText={getErrorMessage('barcode') || "8-13 chữ số"}
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
                    error={hasError('ram', index)}
                    helperText={getErrorMessage('ram', index)}
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
                    error={hasError('rom', index)}
                    helperText={getErrorMessage('rom', index)}
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
                    error={hasError('color', index)}
                    helperText={getErrorMessage('color', index)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    required
                    label="SKU Biến thể"
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                    placeholder="SS24U-23-225-Đ"
                    size="small"
                    error={hasError('sku', index)}
                    helperText={getErrorMessage('sku', index)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    required
                    label="Giá"
                    value={variant.displayPrice || ''}
                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                    placeholder="34.990.000"
                    size="small"
                    error={hasError('price', index)}
                    helperText={getErrorMessage('price', index)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                    }}
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
