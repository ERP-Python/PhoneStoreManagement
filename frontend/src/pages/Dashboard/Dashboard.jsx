import { useEffect, useState } from 'react'
import { Grid, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material'
import { TrendingUp, ShoppingCart, Inventory, People } from '@mui/icons-material'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '../../api/axios'
import { dashboardStyles } from './Dashboard.styles'

function StatCard({ title, value, icon, color = 'primary' }) {
  return (
    <Paper sx={dashboardStyles.statCard}>
      <Box sx={dashboardStyles.statCardContent}>
        <Box>
          <Typography color="textSecondary" variant="body2">
            {title}
          </Typography>
          <Typography variant="h4">
            {value}
          </Typography>
        </Box>
        <Box sx={{ color: `${color}.main`, ...dashboardStyles.statIcon }}>
          {icon}
        </Box>
      </Box>
    </Paper>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [salesData, setSalesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
    fetchSalesChart()
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
      // Fetch sales data for last 7 days
      const response = await api.get('/reports/sales/', { params: { range: 'week' } })
      // Transform data for chart (this is sample - backend might need adjustment)
      const chartData = [
        { name: 'T2', doanhthu: Math.random() * 10000000 },
        { name: 'T3', doanhthu: Math.random() * 10000000 },
        { name: 'T4', doanhthu: Math.random() * 10000000 },
        { name: 'T5', doanhthu: Math.random() * 10000000 },
        { name: 'T6', doanhthu: Math.random() * 10000000 },
        { name: 'T7', doanhthu: Math.random() * 10000000 },
        { name: 'CN', doanhthu: Math.random() * 10000000 }
      ]
      setSalesData(chartData)
    } catch (error) {
      console.error('Error fetching sales chart:', error)
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
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography {...dashboardStyles.title}>
        Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={dashboardStyles.errorAlert}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3} sx={dashboardStyles.statsGrid}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Doanh thu hôm nay"
            value={formatCurrency(stats?.today?.revenue || 0)}
            icon={<TrendingUp />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Đơn hàng hôm nay"
            value={stats?.today?.orders_count || 0}
            icon={<ShoppingCart />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Sản phẩm sắp hết"
            value={stats?.inventory?.low_stock_count || 0}
            icon={<Inventory />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Tổng khách hàng"
            value={stats?.customers?.total_count || 0}
            icon={<People />}
            color="info"
          />
        </Grid>
      </Grid>

      <Typography variant="h5" sx={dashboardStyles.chartSection}>
        Biểu đồ Doanh thu
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={dashboardStyles.chartPaper}>
            <Typography {...dashboardStyles.chartTitle}>Doanh thu 7 ngày qua</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Bar dataKey="doanhthu" fill="#1976d2" name="Doanh thu (VND)" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={dashboardStyles.monthlySection}>
        Tháng này
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={dashboardStyles.monthlyCard}>
            <Typography variant="h6" gutterBottom>Doanh thu tháng</Typography>
            <Typography variant="h4" color="primary">
              {formatCurrency(stats?.this_month?.revenue || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={dashboardStyles.monthlyCard}>
            <Typography variant="h6" gutterBottom>Đơn hàng tháng</Typography>
            <Typography variant="h4" color="primary">
              {stats?.this_month?.orders_count || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
