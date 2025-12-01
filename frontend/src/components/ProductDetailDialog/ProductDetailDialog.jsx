import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Chip,
    Grid,
    Divider,
    CircularProgress,
    Button
} from '@mui/material'
import {
    Close as CloseIcon,
    NavigateBefore,
    NavigateNext
} from '@mui/icons-material'
import { formatCurrency } from '../../utils/formatters'
import api from '../../api/axios'

export default function ProductDetailDialog({ open, onClose, product: initialProduct }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(false)
    const [selectedRom, setSelectedRom] = useState(null)
    const [selectedColor, setSelectedColor] = useState(null)
    const [currentVariant, setCurrentVariant] = useState(null)

    const fetchProductDetail = async () => {
        if (!initialProduct) return

        try {
            setLoading(true)
            const response = await api.get(`/products/${initialProduct.id}/`)
            setProduct(response.data)

            // Set default variant (first active variant)
            const activeVariants = response.data.variants?.filter(v => v.is_active) || []
            if (activeVariants.length > 0) {
                const firstVariant = activeVariants[0]
                setCurrentVariant(firstVariant)
                setSelectedRom(firstVariant.rom)
                setSelectedColor(firstVariant.color)
            }
        } catch (error) {
            console.error('Error fetching product detail:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (open && initialProduct) {
            fetchProductDetail()
        }
    }, [open, initialProduct])

    // Update current variant when selection changes
    useEffect(() => {
        if (product && selectedRom && selectedColor) {
            const activeVariants = product.variants?.filter(v => v.is_active) || []
            const variant = activeVariants.find(v => v.rom === selectedRom && v.color === selectedColor)
            if (variant) {
                setCurrentVariant(variant)
            }
        }
    }, [selectedRom, selectedColor, product])

    const images = product?.images || []
    const variants = product?.variants?.filter(v => v.is_active) || []
    const hasImages = images.length > 0

    // Get unique ROM and Color options
    const romOptions = [...new Set(variants.map(v => v.rom))].filter(Boolean)
    const colorOptions = [...new Set(variants.map(v => v.color))].filter(Boolean)

    // Check if a color is available for selected ROM
    const isColorAvailable = (color) => {
        if (!selectedRom) return true
        return variants.some(v => v.rom === selectedRom && v.color === color)
    }

    // Auto-select first valid color when ROM changes
    useEffect(() => {
        if (!product || !selectedRom) return

        const activeVariants = product.variants?.filter(v => v.is_active) || []
        if (activeVariants.length === 0) return

        // If selected color is not available for selected ROM, find first valid color
        if (selectedColor && !isColorAvailable(selectedColor)) {
            const validColor = colorOptions.find(color =>
                activeVariants.some(v => v.rom === selectedRom && v.color === color)
            )
            if (validColor) {
                setSelectedColor(validColor)
            }
        }
    }, [selectedRom, product])

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const handleClose = () => {
        setCurrentImageIndex(0)
        setSelectedRom(null)
        setSelectedColor(null)
        setCurrentVariant(null)
        setProduct(null)
        onClose()
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e2e8f0',
                pb: 2
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Chi tiết sản phẩm
                </Typography>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                        <CircularProgress />
                    </Box>
                ) : product ? (
                    <Grid container spacing={3}>
                        {/* Left side - Images */}
                        <Grid item xs={12} md={5}>
                            <Box sx={{ position: 'relative' }}>
                                {hasImages ? (
                                    <>
                                        <Box
                                            component="img"
                                            src={images[currentImageIndex]?.image || '/assets/images/1.jpg'}
                                            alt={product.name}
                                            sx={{
                                                width: '100%',
                                                height: 400,
                                                objectFit: 'contain',
                                                borderRadius: 2,
                                                border: '1px solid #e2e8f0',
                                                backgroundColor: '#f8f9fa'
                                            }}
                                        />
                                        {images.length > 1 && (
                                            <>
                                                <IconButton
                                                    onClick={handlePrevImage}
                                                    sx={{
                                                        position: 'absolute',
                                                        left: 8,
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                                        '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                                                    }}
                                                >
                                                    <NavigateBefore />
                                                </IconButton>
                                                <IconButton
                                                    onClick={handleNextImage}
                                                    sx={{
                                                        position: 'absolute',
                                                        right: 8,
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                                        '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                                                    }}
                                                >
                                                    <NavigateNext />
                                                </IconButton>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 400,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 2,
                                            border: '1px solid #e2e8f0',
                                            backgroundColor: '#f8f9fa'
                                        }}
                                    >
                                        <Typography color="text.secondary">Không có hình ảnh</Typography>
                                    </Box>
                                )}

                                {/* Thumbnail images */}
                                {images.length > 1 && (
                                    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                        {images.map((img, index) => (
                                            <Box
                                                key={img.id}
                                                component="img"
                                                src={img.image}
                                                alt={`${product.name} ${index + 1}`}
                                                onClick={() => setCurrentImageIndex(index)}
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    objectFit: 'cover',
                                                    borderRadius: 1,
                                                    border: currentImageIndex === index ? '2px solid #667eea' : '1px solid #e2e8f0',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        borderColor: '#667eea'
                                                    }
                                                }}
                                            />
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        {/* Right side - Product Info */}
                        <Grid item xs={12} md={7}>
                            <Box>
                                {/* Product Title */}
                                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
                                    {product.name}
                                </Typography>

                                {/* Product Number */}
                                <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                                    No.{product.sku} {product.barcode && `| Barcode: ${product.barcode}`}
                                </Typography>

                                {/* Status and Brand */}
                                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                                    <Chip
                                        label={product.is_active ? 'Hoạt động' : 'Ngưng'}
                                        color={product.is_active ? 'success' : 'default'}
                                        size="small"
                                    />
                                    {product.brand?.name && (
                                        <Chip
                                            label={product.brand.name}
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                </Box>

                                {/* Price */}
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626', mb: 3 }}>
                                    {currentVariant ? formatCurrency(currentVariant.price) : 'Chưa có giá'}
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                {/* ROM Selection */}
                                {romOptions.length > 0 && (
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
                                            Dung lượng
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {romOptions.map((rom) => (
                                                <Button
                                                    key={rom}
                                                    variant={selectedRom === rom ? 'contained' : 'outlined'}
                                                    onClick={() => setSelectedRom(rom)}
                                                    sx={{
                                                        minWidth: 100,
                                                        height: 48,
                                                        borderRadius: 2,
                                                        borderColor: selectedRom === rom ? '#667eea' : '#e2e8f0',
                                                        backgroundColor: selectedRom === rom ? '#667eea' : '#fff',
                                                        color: selectedRom === rom ? '#fff' : '#1e293b',
                                                        fontWeight: 500,
                                                        textTransform: 'none',
                                                        '&:hover': {
                                                            borderColor: '#667eea',
                                                            backgroundColor: selectedRom === rom ? '#5a67d8' : 'rgba(102, 126, 234, 0.04)'
                                                        }
                                                    }}
                                                >
                                                    {rom}
                                                </Button>
                                            ))}
                                        </Box>
                                    </Box>
                                )}

                                {/* Color Selection */}
                                {colorOptions.length > 0 && (
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
                                            Màu sắc
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {colorOptions.map((color) => {
                                                const available = isColorAvailable(color)
                                                const variant = variants.find(v => v.color === color && v.rom === selectedRom)
                                                const colorImage = variant ? images.find(img => img.color === color) : null

                                                return (
                                                    <Button
                                                        key={color}
                                                        variant={selectedColor === color ? 'contained' : 'outlined'}
                                                        onClick={() => available && setSelectedColor(color)}
                                                        disabled={!available}
                                                        sx={{
                                                            minWidth: 140,
                                                            height: 64,
                                                            borderRadius: 2,
                                                            borderColor: selectedColor === color ? '#667eea' : '#e2e8f0',
                                                            backgroundColor: selectedColor === color ? '#667eea' : '#fff',
                                                            color: selectedColor === color ? '#fff' : '#1e293b',
                                                            fontWeight: 500,
                                                            textTransform: 'none',
                                                            display: 'flex',
                                                            gap: 1,
                                                            alignItems: 'center',
                                                            justifyContent: 'flex-start',
                                                            px: 2,
                                                            opacity: available ? 1 : 0.4,
                                                            cursor: available ? 'pointer' : 'not-allowed',
                                                            '&:hover': {
                                                                borderColor: available ? '#667eea' : '#e2e8f0',
                                                                backgroundColor: selectedColor === color ? '#5a67d8' : (available ? 'rgba(102, 126, 234, 0.04)' : '#fff')
                                                            },
                                                            '&.Mui-disabled': {
                                                                borderColor: '#e2e8f0',
                                                                color: '#94a3b8',
                                                                opacity: 0.4
                                                            }
                                                        }}
                                                    >
                                                        {colorImage && (
                                                            <Box
                                                                component="img"
                                                                src={colorImage.image}
                                                                alt={color}
                                                                sx={{
                                                                    width: 40,
                                                                    height: 40,
                                                                    objectFit: 'contain',
                                                                    opacity: available ? 1 : 0.5
                                                                }}
                                                            />
                                                        )}
                                                        {color}
                                                    </Button>
                                                )
                                            })}
                                        </Box>
                                    </Box>
                                )}

                                {/* Description */}
                                {product.description && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
                                            Mô tả
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                                            {product.description}
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}
