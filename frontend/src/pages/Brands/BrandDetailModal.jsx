import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Chip,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Close as CloseIcon,
  PhoneAndroid as PhoneIcon,
  Store as StoreIcon
} from '@mui/icons-material'
import api from '../../api/axios'

const BrandDetailModal = ({ open, onClose, brand }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    if (open && brand) {
      fetchBrandProducts()
    }
  }, [open, brand])

  const fetchBrandProducts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/products/', {
        params: {
          brand: brand.id,
          page_size: 100 // Get all or many products
        }
      })
      setProducts(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching brand products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!brand) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          overflow: 'hidden'
        }
      }}
    >
      {/* Header with gradient background */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 3,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 3
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'white',
            bgcolor: 'rgba(255,255,255,0.1)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.2)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            width: 100,
            height: 100,
            bgcolor: 'white',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          {brand.logo ? (
            <img
              src={brand.logo}
              alt={brand.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }}
            />
          ) : (
            <StoreIcon sx={{ fontSize: 50, color: '#667eea' }} />
          )}
        </Box>

        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {brand.name}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
            {brand.description || 'Chưa có mô tả cho thương hiệu này.'}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Chip
              icon={<PhoneIcon sx={{ color: 'white !important' }} />}
              label={`${products.length} Sản phẩm`}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none'
              }}
            />
            <Chip
              label={brand.is_active ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
              color={brand.is_active ? 'success' : 'default'}
              sx={{
                bgcolor: brand.is_active ? '#4caf50' : 'rgba(255,255,255,0.2)',
                color: 'white'
              }}
            />
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ p: 3, bgcolor: '#f8f9fa' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#1e293b' }}>
          Danh sách sản phẩm
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : products.length > 0 ? (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', pt: '100%' }}>
                    {product.primary_image ? (
                      <CardMedia
                        component="img"
                        image={product.primary_image.image}
                        alt={product.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          p: 2
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: '#f1f5f9',
                          color: '#94a3b8'
                        }}
                      >
                        <PhoneIcon sx={{ fontSize: 48 }} />
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="600"
                      sx={{
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        height: 48
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      SKU: {product.sku}
                    </Typography>
                    {/* We could show price range here if we fetch variants */}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              color: '#64748b'
            }}
          >
            <Typography variant="body1">
              Chưa có sản phẩm nào thuộc thương hiệu này.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BrandDetailModal
