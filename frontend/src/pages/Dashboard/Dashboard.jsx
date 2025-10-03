import { useEffect, useState } from 'react'
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material'
import { 
  TrendingUp, 
  ShoppingCart, 
  Inventory, 
  People,
  AttachMoney,
  LocalShipping,
  Smartphone,
  TrendingDown
} from '@mui/icons-material'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from '../../api/axios'
import { dashboardStyles } from './Dashboard.styles'

function StatCard({ title, value, icon, color = 'primary', change, changeType }) {
  return (
    <Card sx={dashboardStyles.statCard} elevation={0}>
      <CardContent sx={dashboardStyles.statCardContent}>
        <Box sx={dashboardStyles.statHeader}>
          <Avatar sx={{ ...dashboardStyles.statIcon, backgroundColor: `${color}.main` }}>
            {icon}
          </Avatar>
          {change && (
            <Chip
              icon={changeType === 'increase' ? <TrendingUp /> : <TrendingDown />}
              label={`${change}%`}
              size="small"
              color={changeType === 'increase' ? 'success' : 'error'}
              variant="outlined"
            />
          )}
        </Box>
        <Box sx={dashboardStyles.statBody}>
          <Typography variant="h4" sx={dashboardStyles.statValue}>
            {value}
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={dashboardStyles.statTitle}>
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [salesData, setSalesData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
    fetchSalesChart()
    fetchTopProducts()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/reports/dashboard/')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setError('Không thể tải dữ liệu dashboard')
    } finally {
      setLoading(false)
    }
  }

  const fetchSalesChart = async () => {
    try {
      // Fetch real sales data for last 7 days from new endpoint
      const response = await api.get('/reports/daily-revenue/', { params: { days: 7 } })
      setSalesData(response.data.data || [])
    } catch (error) {
      console.error('Error fetching sales chart:', error)
      // Set empty data on error instead of random data
      setSalesData([])
    }
  }

  const fetchTopProducts = async () => {
    try {
      const response = await api.get('/reports/top-products/', { 
        params: { limit: 4, period: 'month' } 
      })
      setTopProducts(response.data.top_by_quantity || [])
    } catch (error) {
      console.error('Error fetching top products:', error)
      setTopProducts([])
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value)
  }

  if (loading) {
    return (
      <Box sx={dashboardStyles.loadingContainer}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Đang tải dữ liệu...
        </Typography>
      </Box>
    )
  }

  // Mock data for demo
  const mockStats = {
    today: { revenue: 15000000, orders_count: 45 },
    inventory: { low_stock_count: 8 },
    customers: { total_count: 1250 }
  }

  const mockSalesData = [
    { name: 'T2', doanhthu: 8500000, donhang: 25 },
    { name: 'T3', doanhthu: 12000000, donhang: 32 },
    { name: 'T4', doanhthu: 9800000, donhang: 28 },
    { name: 'T5', doanhthu: 15000000, donhang: 45 },
    { name: 'T6', doanhthu: 18200000, donhang: 52 },
    { name: 'T7', doanhthu: 16500000, donhang: 48 },
    { name: 'CN', doanhthu: 11200000, donhang: 35 }
  ]

  const pieData = [
    { name: 'iPhone', value: 35, color: '#667eea' },
    { name: 'Samsung', value: 30, color: '#764ba2' },
    { name: 'Xiaomi', value: 20, color: '#48bb78' },
    { name: 'Oppo', value: 15, color: '#ed8936' }
  ]

  return (
    <Box sx={dashboardStyles.container}>
      {/* Header */}
      <Box sx={dashboardStyles.header}>
        <Typography variant="h4" sx={dashboardStyles.title}>
          Chào mừng trở lại! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tổng quan về hoạt động kinh doanh hôm nay
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={dashboardStyles.errorAlert}>
          {error}
        </Alert>
      )}
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={dashboardStyles.statsGrid}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Doanh thu hôm nay"
            value={formatCurrency(stats?.today?.revenue || mockStats.today.revenue)}
            icon={<AttachMoney />}
            color="success"
            change={12.5}
            changeType="increase"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Đơn hàng hôm nay"
            value={stats?.today?.orders_count || mockStats.today.orders_count}
            icon={<ShoppingCart />}
            color="primary"
            change={8.2}
            changeType="increase"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Sản phẩm sắp hết"
            value={stats?.inventory?.low_stock_count || mockStats.inventory.low_stock_count}
            icon={<Inventory />}
            color="warning"
            change={3.1}
            changeType="decrease"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Tổng khách hàng"
            value={stats?.customers?.total_count || mockStats.customers.total_count}
            icon={<People />}
            color="info"
            change={15.3}
            changeType="increase"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Sales Chart */}
        <Grid item xs={12} lg={8}>
          <Card sx={dashboardStyles.chartCard} elevation={0}>
            <CardContent>
              <Typography variant="h6" sx={dashboardStyles.chartTitle}>
                Doanh thu 7 ngày qua
              </Typography>
              <Box sx={{ mt: 3, height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData.length ? salesData : mockSalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      labelStyle={{ color: '#1a202c' }}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="doanhthu" 
                      fill="url(#colorGradient)" 
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#667eea" />
                        <stop offset="100%" stopColor="#764ba2" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Product Distribution Pie Chart */}
        <Grid item xs={12} lg={4}>
          <Card sx={dashboardStyles.chartCard} elevation={0}>
            <CardContent>
              <Typography variant="h6" sx={dashboardStyles.chartTitle}>
                Phân bố sản phẩm
              </Typography>
              <Box sx={{ 
                mt: 2, 
                height: 350, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                '& .recharts-wrapper': {
                  outline: 'none !important',
                },
                '& *': {
                  outline: 'none !important',
                }
              }}>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      isAnimationActive={true}
                      activeIndex={null}
                      activeShape={null}
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          style={{ outline: 'none', cursor: 'default' }}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `${value}%`}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  justifyContent: 'center', 
                  gap: 2,
                  mt: 1,
                  px: 2
                }}>
                  {pieData.map((entry, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        backgroundColor: entry.color,
                        borderRadius: '2px'
                      }} />
                      <Typography variant="body2" sx={{ fontSize: '13px', color: '#4A5568' }}>
                        {entry.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activities */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card sx={dashboardStyles.activityCard} elevation={0}>
            <CardContent>
              <Typography variant="h6" sx={dashboardStyles.chartTitle}>
                Hoạt động gần đây
              </Typography>
              <Box sx={{ mt: 2 }}>
                {[
                  { action: 'Đơn hàng mới #1234', time: '5 phút trước', type: 'order' },
                  { action: 'Sản phẩm iPhone 15 sắp hết hàng', time: '15 phút trước', type: 'warning' },
                  { action: 'Khách hàng mới đăng ký', time: '30 phút trước', type: 'customer' },
                  { action: 'Thanh toán đơn hàng #1230', time: '1 giờ trước', type: 'payment' },
                ].map((activity, index) => (
                  <Box key={index} sx={dashboardStyles.activityItem}>
                    <Avatar sx={{ 
                      width: 32, 
                      height: 32, 
                      backgroundColor: activity.type === 'order' ? 'primary.main' :
                                     activity.type === 'warning' ? 'warning.main' :
                                     activity.type === 'customer' ? 'success.main' : 'info.main'
                    }}>
                      {activity.type === 'order' ? <ShoppingCart /> :
                       activity.type === 'warning' ? <Inventory /> :
                       activity.type === 'customer' ? <People /> : <AttachMoney />}
                    </Avatar>
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {activity.action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={dashboardStyles.activityCard} elevation={0}>
            <CardContent>
              <Typography variant="h6" sx={dashboardStyles.chartTitle}>
                Sản phẩm bán chạy
              </Typography>
              <Box sx={{ mt: 2 }}>
                {topProducts.length > 0 ? (
                  topProducts.map((product, index) => {
                    // Calculate progress based on max quantity
                    const maxQty = topProducts[0]?.total_qty || 1
                    const progress = (product.total_qty / maxQty) * 100
                    
                    return (
                      <Box key={product.product_id} sx={dashboardStyles.productItem}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight={500}>
                            {product.product_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {product.total_qty} đã bán • {formatCurrency(product.total_revenue)}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            sx={{ mt: 1, height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </Box>
                    )
                  })
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Chưa có dữ liệu sản phẩm bán chạy
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
