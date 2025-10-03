import { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Paper,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material'
import {
  TrendingUp,
  Inventory as InventoryIcon,
  ShoppingCart,
  Assessment
} from '@mui/icons-material'
import api from '../../api/axios'
import { reportsStyles } from './Reports.styles'

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={reportsStyles.tabPanel}>{children}</Box>}
    </div>
  )
}

export default function Reports() {
  const [tabValue, setTabValue] = useState(0)
  const [salesReport, setSalesReport] = useState(null)
  const [inventoryReport, setInventoryReport] = useState(null)
  const [topProducts, setTopProducts] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [salesRange, setSalesRange] = useState('day')
  const [topProductsPeriod, setTopProductsPeriod] = useState('month')

  useEffect(() => {
    if (tabValue === 0) {
      fetchSalesReport()
    } else if (tabValue === 1) {
      fetchInventoryReport()
    } else if (tabValue === 2) {
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
      currency: 'VND'
    }).format(amount)
  }

  return (
    <Box>
      <Typography {...reportsStyles.title}>
        Báo cáo & Thống kê
      </Typography>

      <Paper sx={reportsStyles.tabsPaper}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab icon={<ShoppingCart />} label="Doanh thu" iconPosition="start" />
          <Tab icon={<InventoryIcon />} label="Tồn kho" iconPosition="start" />
          <Tab icon={<TrendingUp />} label="Sản phẩm bán chạy" iconPosition="start" />
          <Tab icon={<Assessment />} label="Tổng hợp" iconPosition="start" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={reportsStyles.errorAlert}>
            {error}
          </Alert>
        )}

        {/* Tab Doanh thu */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={reportsStyles.tabContent}>
            <Box sx={reportsStyles.sectionHeader}>
              <Typography {...reportsStyles.sectionTitle}>Báo cáo Doanh thu</Typography>
              <FormControl size="small" sx={reportsStyles.filterControl}>
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

            {loading ? (
              <Box sx={reportsStyles.loadingContainer}>
                <CircularProgress />
              </Box>
            ) : salesReport ? (
              <>
                <Grid container spacing={3} sx={reportsStyles.statsGrid}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={reportsStyles.statCardPrimary}>
                      <Typography {...reportsStyles.statText}>Tổng doanh thu</Typography>
                      <Typography {...reportsStyles.statValue}>
                        {formatCurrency(salesReport.summary?.total_revenue || 0)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={reportsStyles.statCardSuccess}>
                      <Typography {...reportsStyles.statText}>Đơn hàng</Typography>
                      <Typography {...reportsStyles.statValue}>
                        {salesReport.summary?.total_orders || 0}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={reportsStyles.statCardInfo}>
                      <Typography {...reportsStyles.statText}>Đơn đã thanh toán</Typography>
                      <Typography {...reportsStyles.statValue}>
                        {salesReport.summary?.paid_orders || 0}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={reportsStyles.statCardWarning}>
                      <Typography {...reportsStyles.statText}>Giá trị TB</Typography>
                      <Typography {...reportsStyles.statValue}>
                        {formatCurrency(salesReport.summary?.average_order_value || 0)}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {salesReport.top_products?.length > 0 && (
                  <>
                    <Typography {...reportsStyles.chartTitle}>Top sản phẩm bán chạy</Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Sản phẩm</TableCell>
                            <TableCell align="right">Số lượng</TableCell>
                            <TableCell align="right">Doanh thu</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {salesReport.top_products.slice(0, 5).map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.product_name}</TableCell>
                              <TableCell align="right">{item.total_qty}</TableCell>
                              <TableCell align="right">
                                {formatCurrency(item.total_revenue)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </>
            ) : null}
          </Box>
        </TabPanel>

        {/* Tab Tồn kho */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={reportsStyles.tabContent}>
            <Typography {...reportsStyles.sectionTitle} sx={{ mb: 3 }}>Báo cáo Tồn kho</Typography>

            {loading ? (
              <Box sx={reportsStyles.loadingContainer}>
                <CircularProgress />
              </Box>
            ) : inventoryReport ? (
              <>
                <Grid container spacing={3} sx={reportsStyles.statsGrid}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={reportsStyles.statCard}>
                      <Typography {...reportsStyles.statText} color="text.secondary">
                        Tổng SKU
                      </Typography>
                      <Typography {...reportsStyles.statValue}>
                        {inventoryReport.summary?.total_items || 0}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={reportsStyles.statCard}>
                      <Typography {...reportsStyles.statText} color="text.secondary">
                        Giá trị tồn kho
                      </Typography>
                      <Typography {...reportsStyles.statValue}>
                        {formatCurrency(inventoryReport.summary?.total_stock_value || 0)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={reportsStyles.statCardError}>
                      <Typography {...reportsStyles.statText}>Hết hàng</Typography>
                      <Typography {...reportsStyles.statValue}>
                        {inventoryReport.summary?.out_of_stock_count || 0}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={reportsStyles.statCardWarning}>
                      <Typography {...reportsStyles.statText}>Sắp hết</Typography>
                      <Typography {...reportsStyles.statValue}>
                        {inventoryReport.summary?.low_stock_count || 0}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {inventoryReport.inventory?.length > 0 && (
                  <>
                    <Typography {...reportsStyles.chartTitle}>Chi tiết tồn kho</Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Sản phẩm</TableCell>
                            <TableCell>SKU</TableCell>
                            <TableCell align="right">Tồn kho</TableCell>
                            <TableCell align="right">Giá trị</TableCell>
                            <TableCell>Trạng thái</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {inventoryReport.inventory.slice(0, 10).map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.product_name}</TableCell>
                              <TableCell>{item.variant_sku}</TableCell>
                              <TableCell align="right">{item.on_hand}</TableCell>
                              <TableCell align="right">
                                {formatCurrency(item.stock_value)}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={
                                    item.status === 'out_of_stock'
                                      ? 'Hết hàng'
                                      : item.status === 'low_stock'
                                      ? 'Sắp hết'
                                      : 'Còn hàng'
                                  }
                                  color={
                                    item.status === 'out_of_stock'
                                      ? 'error'
                                      : item.status === 'low_stock'
                                      ? 'warning'
                                      : 'success'
                                  }
                                  {...reportsStyles.statusChip}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </>
            ) : null}
          </Box>
        </TabPanel>

        {/* Tab Sản phẩm bán chạy */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={reportsStyles.tabContent}>
            <Box sx={reportsStyles.sectionHeader}>
              <Typography {...reportsStyles.sectionTitle}>Top Sản phẩm bán chạy</Typography>
              <FormControl size="small" sx={reportsStyles.filterControl}>
                <InputLabel>Thời gian</InputLabel>
                <Select
                  value={topProductsPeriod}
                  label="Thời gian"
                  onChange={(e) => setTopProductsPeriod(e.target.value)}
                >
                  <MenuItem value="day">Hôm nay</MenuItem>
                  <MenuItem value="week">Tuần này</MenuItem>
                  <MenuItem value="month">Tháng này</MenuItem>
                  <MenuItem value="all">Toàn thời gian</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {loading ? (
              <Box sx={reportsStyles.loadingContainer}>
                <CircularProgress />
              </Box>
            ) : topProducts ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography {...reportsStyles.subtitle}>
                    Top theo Số lượng
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>Sản phẩm</TableCell>
                          <TableCell align="right">Đã bán</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topProducts.top_by_quantity?.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.product_name}</TableCell>
                            <TableCell align="right">{item.total_qty}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography {...reportsStyles.subtitle}>
                    Top theo Doanh thu
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>Sản phẩm</TableCell>
                          <TableCell align="right">Doanh thu</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topProducts.top_by_revenue?.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.product_name}</TableCell>
                            <TableCell align="right">
                              {formatCurrency(item.total_revenue)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            ) : null}
          </Box>
        </TabPanel>

        {/* Tab Tổng hợp */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={reportsStyles.tabContent}>
            <Typography {...reportsStyles.sectionTitle} sx={{ mb: 3 }}>
              Báo cáo Tổng hợp
            </Typography>
            <Alert severity="info">
              Báo cáo tổng hợp chi tiết sẽ được triển khai tại đây, bao gồm:
              <ul>
                <li>Biểu đồ doanh thu theo thời gian</li>
                <li>Phân tích xu hướng bán hàng</li>
                <li>So sánh hiệu suất theo tháng/quý</li>
                <li>Báo cáo lợi nhuận</li>
              </ul>
            </Alert>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  )
}
