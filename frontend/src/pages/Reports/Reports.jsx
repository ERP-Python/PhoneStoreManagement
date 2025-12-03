import { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  LinearProgress,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material'
import {
  TrendingUp,
  Inventory as InventoryIcon,
  ShoppingCart,
  Assessment,
  Refresh
} from '@mui/icons-material'
import api from '../../api/axios'

// Styles object
const styles = {
  container: {
    p: 3,
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3,
    flexWrap: 'wrap',
    gap: 2
  },
  statCard: {
    height: '100%',
    borderRadius: 3,
    boxShadow: '0px 2px 10px rgba(0,0,0,0.03)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0px 8px 20px rgba(0,0,0,0.06)',
    }
  },
  chartCard: {
    borderRadius: 3,
    boxShadow: '0px 2px 10px rgba(0,0,0,0.03)',
    height: '100%'
  },
  iconAvatar: {
    width: 42,
    height: 42, 
    borderRadius: 2
  }
}

// StatCard Component
function StatCard({ title, value, icon, color = 'primary' }) {
  const bgColors = {
    primary: '#e3f2fd',
    success: '#e8f5e9',
    warning: '#fff3e0',
    info: '#e1f5fe',
    error: '#ffebee'
  }
  const textColors = {
    primary: '#1976d2',
    success: '#2e7d32',
    warning: '#ed6c02',
    info: '#0288d1',
    error: '#d32f2f'
  }

  return (
    <Card sx={styles.statCard}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2" fontWeight={600} sx={{ mb: 0.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ color: '#2d3748', lineHeight: 1.2 }}>
              {value}
            </Typography>
          </Box>
          <Avatar variant="rounded" sx={{ 
            ...styles.iconAvatar, 
            backgroundColor: bgColors[color] || bgColors.primary, 
            color: textColors[color] || textColors.primary,
            ml: 2,
            flexShrink: 0
          }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function Reports() {
  const [tabValue, setTabValue] = useState('sales')
  const [salesReport, setSalesReport] = useState(null)
  const [inventoryReport, setInventoryReport] = useState(null)
  const [topProducts, setTopProducts] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [salesRange, setSalesRange] = useState('month')
  const [topProductsPeriod, setTopProductsPeriod] = useState('month')

  useEffect(() => {
    if (tabValue === 'sales') {
      fetchSalesReport()
    } else if (tabValue === 'inventory') {
      fetchInventoryReport()
    } else if (tabValue === 'topproducts') {
      fetchTopProducts()
    }
  }, [tabValue, salesRange, topProductsPeriod])

  const fetchSalesReport = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/reports/sales/', {
        params: { range: salesRange }
      })
      setSalesReport(response.data)
    } catch (err) {
      console.error('Error fetching sales report:', err)
      setError('Không thể tải báo cáo doanh thu')
    } finally {
      setLoading(false)
    }
  }

  const fetchInventoryReport = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/reports/inventory/')
      setInventoryReport(response.data)
    } catch (err) {
      console.error('Error fetching inventory report:', err)
      setError('Không thể tải báo cáo tồn kho')
    } finally {
      setLoading(false)
    }
  }

  const fetchTopProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/reports/top-products/', {
        params: { period: topProductsPeriod, limit: 10 }
      })
      setTopProducts(response.data)
    } catch (err) {
      console.error('Error fetching top products:', err)
      setError('Không thể tải báo cáo sản phẩm bán chạy')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleRefresh = () => {
    if (tabValue === 'sales') {
      fetchSalesReport()
    } else if (tabValue === 'inventory') {
      fetchInventoryReport()
    } else if (tabValue === 'topproducts') {
      fetchTopProducts()
    }
  }

  return (
    <Box sx={styles.container}>
      {/* Header */}
      <Box sx={styles.headerContainer}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Báo cáo & Thống kê
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Xem chi tiết thống kê kinh doanh
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <Tooltip title="Làm mới dữ liệu">
            <IconButton size="small" onClick={handleRefresh} sx={{ bgcolor: 'white', border: '1px solid #e2e8f0' }}>
              <Refresh fontSize="small"/>
            </IconButton>
          </Tooltip>
          
          <ToggleButtonGroup
            value={tabValue}
            exclusive
            onChange={(event, newValue) => {
              if (newValue !== null) setTabValue(newValue)
            }}
            aria-label="report type"
            size="small"
            sx={{ 
              backgroundColor: 'white',
              '& .MuiToggleButton-root': {
                border: '1px solid #e2e8f0',
                px: 2,
                py: 0.5,
                textTransform: 'none',
                fontWeight: 500,
                color: '#64748b',
                '&.Mui-selected': {
                  backgroundColor: '#667eea',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#5a67d8',
                  }
                }
              }
            }}
          >
            <ToggleButton value="sales">Doanh Thu</ToggleButton>
            <ToggleButton value="inventory">Tồn Kho</ToggleButton>
            <ToggleButton value="topproducts">Sản Phẩm Bán Chạy</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Tab: Doanh Thu */}
          {tabValue === 'sales' && salesReport && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Báo cáo Doanh thu
                </Typography>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Thời gian</InputLabel>
                  <Select
                    value={salesRange}
                    label="Thời gian"
                    onChange={(e) => setSalesRange(e.target.value)}
                  >
                    <MenuItem value="day">Hôm nay</MenuItem>
                    <MenuItem value="week">7 ngày qua</MenuItem>
                    <MenuItem value="month">30 ngày qua</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard 
                    title="Tổng Doanh Thu"
                    value={formatCurrency(salesReport.summary?.total_revenue || 0)}
                    icon={<ShoppingCart />}
                    color="primary"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard 
                    title="Tổng Đơn Hàng"
                    value={salesReport.summary?.total_orders || 0}
                    icon={<Assessment />}
                    color="success"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard 
                    title="Đơn Đã Thanh Toán"
                    value={salesReport.summary?.paid_orders || 0}
                    icon={<TrendingUp />}
                    color="info"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard 
                    title="Giá Trị Trung Bình"
                    value={formatCurrency(salesReport.summary?.average_order_value || 0)}
                    icon={<ShoppingCart />}
                    color="warning"
                  />
                </Grid>
              </Grid>

              {salesReport.top_products?.length > 0 && (
                <Card sx={styles.chartCard} elevation={0}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
                      Top Sản Phẩm Bán Chạy
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                            <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Sản Phẩm</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Số Lượng</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Doanh Thu</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {salesReport.top_products.slice(0, 10).map((item, index) => (
                            <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell sx={{ fontWeight: 500 }}>{item.product_name}</TableCell>
                              <TableCell align="right">{item.total_qty}</TableCell>
                              <TableCell align="right">{formatCurrency(item.total_revenue)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Tab: Tồn Kho */}
          {tabValue === 'inventory' && inventoryReport && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Báo cáo Tồn Kho
              </Typography>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard 
                    title="Tổng SKU"
                    value={inventoryReport.summary?.total_items || 0}
                    icon={<InventoryIcon />}
                    color="primary"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard 
                    title="Giá Trị Tồn Kho"
                    value={formatCurrency(inventoryReport.summary?.total_stock_value || 0)}
                    icon={<ShoppingCart />}
                    color="success"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard 
                    title="Sắp Hết Hàng"
                    value={inventoryReport.summary?.low_stock_count || 0}
                    icon={<TrendingUp />}
                    color="warning"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard 
                    title="Hết Hàng"
                    value={inventoryReport.summary?.out_of_stock_count || 0}
                    icon={<Assessment />}
                    color="error"
                  />
                </Grid>
              </Grid>

              {inventoryReport.inventory?.length > 0 && (
                <Card sx={styles.chartCard} elevation={0}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
                      Chi Tiết Tồn Kho
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                            <TableCell sx={{ fontWeight: 600 }}>Sản Phẩm</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Tồn Kho</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Giá Trị</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Trạng Thái</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {inventoryReport.inventory.slice(0, 10).map((item, index) => (
                            <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                              <TableCell sx={{ fontWeight: 500 }}>{item.product_name}</TableCell>
                              <TableCell align="right">{item.on_hand}</TableCell>
                              <TableCell align="right">{formatCurrency(item.stock_value || 0)}</TableCell>
                              <TableCell>
                                <Box sx={{
                                  display: 'inline-block',
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 1,
                                  backgroundColor: item.on_hand === 0 ? '#ffebee' : item.on_hand < 10 ? '#fff3e0' : '#e8f5e9',
                                  color: item.on_hand === 0 ? '#c62828' : item.on_hand < 10 ? '#ed6c02' : '#2e7d32',
                                  fontSize: '0.75rem',
                                  fontWeight: 600
                                }}>
                                  {item.on_hand === 0 ? 'Hết Hàng' : item.on_hand < 10 ? 'Sắp Hết' : 'Bình Thường'}
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Tab: Sản Phẩm Bán Chạy */}
          {tabValue === 'topproducts' && topProducts && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 0.5 }}>
                    🔥 Sản Phẩm Bán Chạy Nhất
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Top sản phẩm được khách hàng ưa chuộng nhất
                  </Typography>
                </Box>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Thời Gian</InputLabel>
                  <Select
                    value={topProductsPeriod}
                    label="Thời Gian"
                    onChange={(e) => setTopProductsPeriod(e.target.value)}
                  >
                    <MenuItem value="week">7 ngày</MenuItem>
                    <MenuItem value="month">Tháng này</MenuItem>
                    <MenuItem value="year">Năm này</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* <Grid container spacing={3} sx={{ mb: 4 }}>
                {topProducts.top_by_quantity?.slice(0, 4).map((product, index) => {
                  const medals = ['🥇', '🥈', '🥉', '⭐']
                  const bgGradients = [
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                  ]
                  
                  return (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card sx={{
                        ...styles.statCard,
                        background: bgGradients[index],
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '100px',
                          height: '100px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '50%',
                          transform: 'translate(30%, -30%)'
                        }
                      }}>
                        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, position: 'relative', zIndex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                            <Typography variant="h3" sx={{ fontWeight: 700, fontSize: '2rem', lineHeight: 1 }}>
                              {medals[index]}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              fontWeight: 700, 
                              fontSize: '0.65rem',
                              textTransform: 'uppercase',
                              backgroundColor: 'rgba(255, 255, 255, 0.3)',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              backdropFilter: 'blur(10px)'
                            }}>
                              Top {index + 1}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, fontSize: '0.95rem', lineHeight: 1.3 }}>
                            {product.product_name}
                          </Typography>
                          
                          <Box sx={{ mb: 1.5, pb: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                              {product.total_qty}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500 }}>
                              sản phẩm đã bán
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 500 }}>
                              Doanh Thu
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.3 }}>
                              {formatCurrency(product.total_revenue)}
                            </Typography>
                          </Box>
                          
                          <LinearProgress 
                            variant="determinate" 
                            value={(product.total_qty / (topProducts.top_by_quantity[0]?.total_qty || 1)) * 100}
                            sx={{ 
                              mt: 2,
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: 1
                              }
                            }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid> */}

              {topProducts.top_by_revenue?.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Card sx={{
                    ...styles.chartCard,
                    elevation: 0,
                    border: '2px solid #667eea',
                    backgroundColor: '#f5f8ff'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                        <Box sx={{
                          width: 4,
                          height: 24,
                          backgroundColor: '#667eea',
                          borderRadius: 1,
                          mr: 1.5
                        }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', m: 0 }}>
                          💰 Ranking Theo Doanh Thu
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, ml: 3.5 }}>
                        Danh sách sản phẩm mang lại doanh thu cao nhất
                      </Typography>

                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ 
                              backgroundColor: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                              '& .MuiTableCell-head': {
                                color: 'black',
                                fontWeight: 700,
                                borderBottom: 'none'
                              }
                            }}>
                              <TableCell sx={{ fontWeight: 700, color: 'black' }}>🏆</TableCell>
                              <TableCell sx={{ fontWeight: 700, color: 'black' }}>Sản Phẩm</TableCell>
                              <TableCell align="center" sx={{ fontWeight: 700, color: 'black' }}>Số Lượng</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: 'black' }}>Doanh Thu</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {topProducts.top_by_revenue.slice(0, 10).map((item, index) => (
                              <TableRow key={index} sx={{ 
                                '&:hover': { 
                                  backgroundColor: '#e8ecff',
                                  transition: 'all 0.2s ease'
                                },
                                borderBottom: index === topProducts.top_by_revenue.length - 1 ? 'none' : '1px solid #e2e8f0'
                              }}>
                                <TableCell sx={{ 
                                  fontWeight: 700, 
                                  width: 50,
                                  textAlign: 'center',
                                  fontSize: '1.2rem'
                                }}>
                                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#2d3748' }}>
                                  {item.product_name}
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 500 }}>
                                  <Box sx={{
                                    display: 'inline-block',
                                    px: 1.5,
                                    py: 0.5,
                                    backgroundColor: '#e3f2fd',
                                    color: '#1976d2',
                                    borderRadius: 1,
                                    fontWeight: 600,
                                    fontSize: '0.875rem'
                                  }}>
                                    {item.total_qty}
                                  </Box>
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: '#667eea', fontSize: '1rem' }}>
                                  {formatCurrency(item.total_revenue)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  )
}
