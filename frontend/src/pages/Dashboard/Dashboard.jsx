import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LowStockAlert from '../../components/LowStockAlert/LowStockAlert'
import {
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  IconButton,
  Badge
} from '@mui/material'
import {
  TrendingUp,
  ShoppingCart,
  Inventory,
  People,
  AttachMoney,
  TrendingDown,
  Refresh,
  NotificationsActive
} from '@mui/icons-material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from '../../api/axios'

// --- Style tùy chỉnh đã được FIX GỌN HƠN ---
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
    minHeight: 140,
    borderRadius: 3,
    boxShadow: '0px 2px 10px rgba(0,0,0,0.03)',
    transition: 'transform 0.2s',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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
  },
  notificationCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: 3,
    boxShadow: '0px 4px 20px rgba(102, 126, 234, 0.15)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0px 8px 30px rgba(102, 126, 234, 0.25)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: '120px',
      height: '120px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '50%',
      transform: 'translate(40px, -40px)',
      zIndex: 0
    }
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ff3b30',
    color: 'white',
    borderRadius: '50%',
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.75rem',
    border: '3px solid white',
    boxShadow: '0px 2px 8px rgba(255, 59, 48, 0.3)'
  }
}

const dashboardStyles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa'
  },
  container: styles.container,
  errorAlert: {
    mb: 3
  },
  statsGrid: {
    mb: 3
  },
  chartCard: styles.chartCard,
  chartTitle: {
    fontWeight: 600,
    fontSize: '1.1rem',
    color: '#1a202c'
  },
  activityCard: {
    borderRadius: 3,
    boxShadow: '0px 2px 10px rgba(0,0,0,0.03)'
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    py: 1.5,
    borderBottom: '1px solid #e2e8f0',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  productItem: {
    py: 1.5,
    borderBottom: '1px solid #e2e8f0',
    '&:last-child': {
      borderBottom: 'none'
    }
  }
}

function StatCard({ title, value, icon, color = 'primary', change, changeType, changeDescription, onClick }) {
  const bgColors = {
    primary: '#e3f2fd',
    success: '#e8f5e9',
    warning: '#fff3e0',
    info: '#e1f5fe',
    error: '#ffebee'
  };
  const textColors = {
    primary: '#1976d2',
    success: '#2e7d32',
    warning: '#ed6c02',
    info: '#0288d1',
    error: '#d32f2f'
  };

  return (
    <Card
      sx={{
        ...styles.statCard,
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {/* Đã sửa: Giảm padding mặc định của CardContent (p: 2) và padding dưới cùng */}
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            {/* Đã sửa: Giảm margin bottom xuống 0.5 để sát với số tiền */}
            <Typography color="text.secondary" variant="body2" fontWeight={600} sx={{ mb: 0.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>
              {title}
            </Typography>
            {/* Đã sửa: Giảm line-height để số trông gọn hơn */}
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

        {change && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
            <Chip
              icon={changeType === 'increase' ? <TrendingUp sx={{ fontSize: '0.9rem !important' }} /> : <TrendingDown sx={{ fontSize: '0.9rem !important' }} />}
              label={`${change}%`}
              size="small"
              color={changeType === 'increase' ? 'success' : 'error'}
              sx={{
                height: 22, 
                fontWeight: 600,
                fontSize: '0.75rem',
                backgroundColor: changeType === 'increase' ? '#e8f5e9' : '#ffebee',
                color: changeType === 'increase' ? '#2e7d32' : '#c62828',
                border: 'none',
                '& .MuiChip-label': { px: 0.8 }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1, fontSize: '0.7rem' }}>
              so với kỳ trước
            </Typography>
          </Box>
        )}
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
  const [lowStockAlertOpen, setLowStockAlertOpen] = useState(false)
  const [viewType, setViewType] = useState('daily')
  const [dailyStats, setDailyStats] = useState(null)
  const [monthlyStats, setMonthlyStats] = useState(null)
  const [yearlyStats, setYearlyStats] = useState(null)
  const [chartPeriod, setChartPeriod] = useState('7days')
  const [activities, setActivities] = useState([])
  const navigate = useNavigate()

  // --- Handlers ---
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewType(newView);
    }
  };

  const handleOrdersClick = () => navigate('/orders')
  const handleCustomersClick = () => navigate('/customers')

  useEffect(() => {
    fetchStats()
    fetchSalesChart()
    fetchTopProducts()
    fetchDailyStats()
    fetchMonthlyStats()
    fetchYearlyStats()
    fetchActivities()

    // Auto-refresh data mỗi 30 giây
    const interval = setInterval(() => {
      fetchStats()
      fetchSalesChart()
      fetchTopProducts()
      fetchDailyStats()
      fetchMonthlyStats()
      fetchYearlyStats()
      fetchActivities()
    }, 30000) // 30 giây

    return () => clearInterval(interval)
  }, [])

  // Refetch data khi viewType thay đổi
  useEffect(() => {
    if (viewType === 'daily') {
      fetchDailyStats()
    } else if (viewType === 'monthly') {
      fetchMonthlyStats()
    } else if (viewType === 'yearly') {
      fetchYearlyStats()
    }
  }, [viewType])

  // Refetch chart data khi chartPeriod thay đổi
  useEffect(() => {
    if (chartPeriod === '7days') {
      fetchSalesChart()
    } else if (chartPeriod === '12months') {
      fetchMonthlySalesChart()
    }
  }, [chartPeriod])

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

  const fetchDailyStats = async () => {
    try {
      const response = await api.get('/reports/daily-stats/')
      setDailyStats(response.data)
    } catch (error) {
      console.error('Error fetching daily stats:', error)
    }
  }

  const fetchMonthlyStats = async () => {
    try {
      const response = await api.get('/reports/monthly-stats/')
      setMonthlyStats(response.data)
    } catch (error) {
      console.error('Error fetching monthly stats:', error)
    }
  }

  const fetchYearlyStats = async () => {
    try {
      const response = await api.get('/reports/yearly-stats/')
      setYearlyStats(response.data)
    } catch (error) {
      console.error('Error fetching yearly stats:', error)
    }
  }

  const fetchSalesChart = async () => {
    try {
      const response = await api.get('/reports/daily-revenue/', { params: { days: 7 } })
      setSalesData(response.data.data || [])
    } catch (error) {
      console.error('Error fetching sales chart:', error)
      setSalesData([])
    }
  }

  const fetchMonthlySalesChart = async () => {
    try {
      const response = await api.get('/reports/monthly-revenue/', { params: { months: 12 } })
      setSalesData(response.data.data || [])
    } catch (error) {
      console.error('Error fetching monthly sales chart:', error)
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

  const fetchActivities = async () => {
    try {
      const response = await api.get('/reports/recent-activities/')
      setActivities(response.data || [])
    } catch (error) {
      console.error('Error fetching activities:', error)
      setActivities([])
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
  const mockStatsYesterday = {
    today: { revenue: 12000000, orders_count: 50 },
    inventory: { low_stock_count: 10 },
    customers: { total_count: 1235 }
  }

  const mockSalesData = [
    { name: 'Thứ 2', doanhthu: 4000000 },
    { name: 'Thứ 3', doanhthu: 3000000 },
    { name: 'Thứ 4', doanhthu: 2000000 },
    { name: 'Thứ 5', doanhthu: 2780000 },
    { name: 'Thứ 6', doanhthu: 1890000 },
    { name: 'Thứ 7', doanhthu: 2390000 },
    { name: 'Chủ nhật', doanhthu: 3490000 },
  ]

  const pieData = [
    { name: 'iPhone', value: 35, color: '#667eea' },
    { name: 'Samsung', value: 25, color: '#764ba2' },
    { name: 'Xiaomi', value: 20, color: '#f093fb' },
    { name: 'Khác', value: 20, color: '#4facfe' },
  ]

  const getChangeInfo = (today, previous) => {
    if (previous === 0) {
      return {
        change: 0,
        changeType: today > 0 ? 'increase' : 'decrease',
        description: 'Không có dữ liệu kỳ trước'
      };
    }
    const diff = today - previous;
    const percentChange = (diff / previous * 100).toFixed(1);

    let periodText = 'kỳ trước';
    if (viewType === 'daily') {
      periodText = 'hôm qua';
    } else if (viewType === 'monthly') {
      periodText = 'tháng trước';
    } else if (viewType === 'yearly') {
      periodText = 'năm trước';
    }

    return {
      change: Math.abs(percentChange),
      changeType: diff >= 0 ? 'increase' : 'decrease',
      description: `${diff >= 0 ? '↑ Tăng' : '↓ Giảm'} ${Math.abs(percentChange)}% so với ${periodText}`
    };
  };

  let currentRevenue = 0
  let currentOrders = 0
  let previousRevenue = 0
  let previousOrders = 0

  if (viewType === 'daily') {
    currentRevenue = dailyStats?.revenue || mockStats.today.revenue
    currentOrders = dailyStats?.orders_count || mockStats.today.orders_count
    previousRevenue = dailyStats?.yesterday_revenue || mockStatsYesterday.today.revenue
    previousOrders = dailyStats?.yesterday_orders_count || mockStatsYesterday.today.orders_count
  } else if (viewType === 'monthly') {
    currentRevenue = monthlyStats?.revenue || mockStats.today.revenue
    currentOrders = monthlyStats?.orders_count || mockStats.today.orders_count
    previousRevenue = monthlyStats?.previous_month_revenue || mockStatsYesterday.today.revenue
    previousOrders = monthlyStats?.previous_month_orders_count || mockStatsYesterday.today.orders_count
  } else if (viewType === 'yearly') {
    currentRevenue = yearlyStats?.revenue || mockStats.today.revenue
    currentOrders = yearlyStats?.orders_count || mockStats.today.orders_count
    previousRevenue = yearlyStats?.previous_year_revenue || mockStatsYesterday.today.revenue
    previousOrders = yearlyStats?.previous_year_orders_count || mockStatsYesterday.today.orders_count
  }

  const todayInventory = stats?.inventory?.low_stock_count ?? mockStats.inventory.low_stock_count
  const todayCustomers = stats?.customers?.total_count ?? mockStats.customers.total_count

  const revenueChange = getChangeInfo(currentRevenue, previousRevenue);
  const ordersChange = getChangeInfo(currentOrders, previousOrders);

  const getPeriodLabel = () => {
    if (viewType === 'daily') return 'Hôm Nay'
    if (viewType === 'monthly') return 'Tháng Này'
    if (viewType === 'yearly') return 'Năm Này'
    return ''
  }

  return (
    <Box sx={dashboardStyles.container}>
      {/* Header */}
      <Box sx={styles.headerContainer}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            📊 Bảng Điều Khiển
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thống kê kinh doanh {getPeriodLabel()}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <Tooltip title="Làm mới dữ liệu">
            <IconButton size="small" onClick={() => {
              fetchStats()
              fetchSalesChart()
              fetchTopProducts()
              fetchDailyStats()
              fetchMonthlyStats()
              fetchYearlyStats()
              fetchActivities()
            }} sx={{ bgcolor: 'white', border: '1px solid #e2e8f0' }}>
              <Refresh fontSize="small" />
            </IconButton>
          </Tooltip>

          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={handleViewChange}
            aria-label="time range"
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
            <ToggleButton value="daily">Hôm nay</ToggleButton>
            <ToggleButton value="monthly">Tháng này</ToggleButton>
            <ToggleButton value="yearly">Năm này</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
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
            title={
              viewType === 'daily' ? 'Doanh Thu' :
                viewType === 'monthly' ? 'Doanh Thu' :
                  'Doanh Thu'
            }
            value={formatCurrency(currentRevenue)}
            icon={<AttachMoney />}
            color="success"
            change={revenueChange.change}
            changeType={revenueChange.changeType}
            changeDescription={revenueChange.description}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Đơn Hàng"
            value={currentOrders}
            icon={<ShoppingCart />}
            color="primary"
            change={ordersChange.change}
            changeType={ordersChange.changeType}
            changeDescription={ordersChange.description}
            onClick={handleOrdersClick}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sắp hết hàng"
            value={todayInventory}
            icon={<Inventory />}
            color="warning"
            onClick={() => setLowStockAlertOpen(true)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Khách hàng"
            value={todayCustomers}
            icon={<People />}
            color="info"
            onClick={handleCustomersClick}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Sales Chart */}
        <Grid item xs={12} lg={8}>
          <Card sx={dashboardStyles.chartCard} elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, position: 'relative' }}>
                <Typography variant="h6" sx={{ ...dashboardStyles.chartTitle, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                  Doanh thu
                </Typography>
                <Box sx={{ ml: 'auto' }}>
                  <ToggleButtonGroup
                    value={chartPeriod}
                    exclusive
                    onChange={(event, newPeriod) => {
                      if (newPeriod !== null) {
                        setChartPeriod(newPeriod);
                      }
                    }}
                    aria-label="chart period"
                    size="small"
                    sx={{
                      backgroundColor: '#f5f5f5',
                      '& .MuiToggleButton-root': {
                        border: '1px solid #e2e8f0',
                        px: 1.5,
                        py: 0.4,
                        textTransform: 'none',
                        fontWeight: 500,
                        color: '#64748b',
                        fontSize: '0.85rem',
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
                    <ToggleButton value="7days">7 ngày qua</ToggleButton>
                    <ToggleButton value="12months">12 tháng qua</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Box>
              <Box sx={{ mt: 3, height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData.length ? salesData : mockSalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <RechartsTooltip
                      formatter={(value) => formatCurrency(value)}
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar
                      dataKey="doanhthu"
                      fill="#667eea"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
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
              <Typography variant="h6" sx={{ ...dashboardStyles.chartTitle, textAlign: 'center' }}>
                Phân bố sản phẩm
              </Typography>
              <Box sx={{
                mt: 2,
                height: 350,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value) => `${value}%`}
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 2,
                  mt: 0
                }}>
                  {pieData.map((entry, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{
                        width: 10,
                        height: 10,
                        backgroundColor: entry.color,
                        borderRadius: '50%'
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <NotificationsActive sx={{ fontSize: '1.8rem', color: '#667eea', mr: 1 }} />
                <Typography variant="h6" sx={{ ...dashboardStyles.chartTitle, textAlign: 'center', m: 0 }}>
                  Hoạt động gần đây
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                {activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <Box key={index} sx={dashboardStyles.activityItem}>
                      <Avatar sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: activity.type === 'order' ? 'primary.main' :
                          activity.type === 'low_stock' ? 'warning.main' :
                            activity.type === 'customer' ? 'success.main' : 'info.main'
                      }}>
                        {activity.type === 'order' ? <ShoppingCart sx={{ fontSize: '1rem' }} /> :
                          activity.type === 'low_stock' ? <Inventory sx={{ fontSize: '1rem' }} /> :
                            activity.type === 'customer' ? <People sx={{ fontSize: '1rem' }} /> : <AttachMoney sx={{ fontSize: '1rem' }} />}
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
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Chưa có hoạt động gần đây
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={dashboardStyles.activityCard} elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <TrendingUp sx={{ fontSize: '1.8rem', color: '#667eea', mr: 1 }} />
                <Typography variant="h6" sx={{ ...dashboardStyles.chartTitle, textAlign: 'center', m: 0 }}>
                  Sản phẩm bán chạy
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                {topProducts.length > 0 ? (
                  topProducts.map((product, index) => {
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

      <LowStockAlert
        open={lowStockAlertOpen}
        onClose={() => setLowStockAlertOpen(false)}
      />
    </Box>
  )
}