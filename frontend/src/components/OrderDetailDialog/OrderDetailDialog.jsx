import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Chip,
  Grid,
  IconButton
} from '@mui/material'
import {
  Close as CloseIcon,
  Print as PrintIcon,
  Payment as PaymentIcon
} from '@mui/icons-material'
import { orderDetailStyles } from './OrderDetailDialog.styles'

export default function OrderDetailDialog({ 
  open, 
  onClose, 
  order, 
  onPrint,
  onPayment 
}) {
  if (!order) return null

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'warning',
      'paid': 'success',
      'cancelled': 'error'
    }
    return colors[status] || 'default'
  }

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Chờ thanh toán',
      'paid': 'Đã thanh toán',
      'cancelled': 'Đã hủy'
    }
    return labels[status] || status
  }

  const getPaymentMethodLabel = (method) => {
    const labels = {
      'cash': 'Tiền mặt',
      'vnpay': 'VNPay',
      'bank_transfer': 'Chuyển khoản'
    }
    return labels[method] || method
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: orderDetailStyles.dialog }}
    >
      <DialogTitle sx={orderDetailStyles.title}>
        <Box sx={orderDetailStyles.titleContent}>
          <Typography variant="h5" component="div">
            Chi tiết đơn hàng
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={orderDetailStyles.content}>
        {/* Thông tin đơn hàng */}
        <Paper sx={orderDetailStyles.section}>
          <Typography variant="h6" sx={orderDetailStyles.sectionTitle}>
            Thông tin đơn hàng
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={orderDetailStyles.infoItem}>
                <Typography variant="body2" color="text.secondary">
                  Mã đơn hàng:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {order.code}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={orderDetailStyles.infoItem}>
                <Typography variant="body2" color="text.secondary">
                  Ngày tạo:
                </Typography>
                <Typography variant="body1">
                  {formatDateTime(order.created_at)}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={orderDetailStyles.infoItem}>
                <Typography variant="body2" color="text.secondary">
                  Trạng thái:
                </Typography>
                <Chip 
                  label={getStatusLabel(order.status)}
                  color={getStatusColor(order.status)}
                  size="small"
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={orderDetailStyles.infoItem}>
                <Typography variant="body2" color="text.secondary">
                  Nhân viên tạo:
                </Typography>
                <Typography variant="body1">
                  {order.created_by_name || 'N/A'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Thông tin khách hàng */}
        <Paper sx={orderDetailStyles.section}>
          <Typography variant="h6" sx={orderDetailStyles.sectionTitle}>
            Thông tin khách hàng
          </Typography>
          
          {order.customer_details ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={orderDetailStyles.infoItem}>
                  <Typography variant="body2" color="text.secondary">
                    Tên khách hàng:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {order.customer_details.name}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={orderDetailStyles.infoItem}>
                  <Typography variant="body2" color="text.secondary">
                    Số điện thoại:
                  </Typography>
                  <Typography variant="body1">
                    {order.customer_details.phone}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={orderDetailStyles.infoItem}>
                  <Typography variant="body2" color="text.secondary">
                    Địa chỉ:
                  </Typography>
                  <Typography variant="body1">
                    {order.customer_details.address || 'Không có địa chỉ'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Khách lẻ
            </Typography>
          )}
        </Paper>

        {/* Danh sách sản phẩm */}
        <Paper sx={orderDetailStyles.section}>
          <Typography variant="h6" sx={orderDetailStyles.sectionTitle}>
            Danh sách sản phẩm
          </Typography>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell align="center">Số lượng</TableCell>
                  <TableCell align="right">Đơn giá</TableCell>
                  <TableCell align="right">Thành tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items?.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {item.product_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          SKU: {item.variant_sku}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">{item.qty}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.unit_price)}
                    </TableCell>
                    <TableCell align="right" fontWeight="medium">
                      {formatCurrency(item.line_total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Tổng tiền */}
        <Paper sx={orderDetailStyles.section}>
          <Typography variant="h6" sx={orderDetailStyles.sectionTitle}>
            Tổng tiền
          </Typography>
          
          <Box sx={orderDetailStyles.totalSection}>
            <Box sx={orderDetailStyles.totalRow}>
              <Typography variant="body1">
                Tạm tính:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatCurrency(order.subtotal)}
              </Typography>
            </Box>
            
            <Divider sx={orderDetailStyles.divider} />
            
            <Box sx={orderDetailStyles.totalRow}>
              <Typography variant="h6">
                Tổng cộng:
              </Typography>
              <Typography variant="h6" color="primary" fontWeight="bold">
                {formatCurrency(order.total)}
              </Typography>
            </Box>
            
            {order.paid_total > 0 && (
              <>
                <Box sx={orderDetailStyles.totalRow}>
                  <Typography variant="body1">
                    Đã thanh toán:
                  </Typography>
                  <Typography variant="body1" color="success.main" fontWeight="medium">
                    {formatCurrency(order.paid_total)}
                  </Typography>
                </Box>
                
                {order.total > order.paid_total && (
                  <Box sx={orderDetailStyles.totalRow}>
                    <Typography variant="body1">
                      Còn lại:
                    </Typography>
                    <Typography variant="body1" color="error.main" fontWeight="medium">
                      {formatCurrency(order.total - order.paid_total)}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Paper>

        {/* Ghi chú */}
        {order.note && (
          <Paper sx={orderDetailStyles.section}>
            <Typography variant="h6" sx={orderDetailStyles.sectionTitle}>
              Ghi chú
            </Typography>
            <Typography variant="body1">
              {order.note}
            </Typography>
          </Paper>
        )}

        {/* Thông tin thanh toán */}
        {order.payments && order.payments.length > 0 && (
          <Paper sx={orderDetailStyles.section}>
            <Typography variant="h6" sx={orderDetailStyles.sectionTitle}>
              Lịch sử thanh toán
            </Typography>
            
            {order.payments.map((payment, index) => (
              <Box key={payment.id} sx={orderDetailStyles.paymentItem}>
                <Box sx={orderDetailStyles.paymentInfo}>
                  <Typography variant="body2" fontWeight="medium">
                    {getPaymentMethodLabel(payment.method_display)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDateTime(payment.created_at)}
                  </Typography>
                </Box>
                <Box sx={orderDetailStyles.paymentAmount}>
                  <Typography variant="body1" fontWeight="medium">
                    {formatCurrency(payment.amount)}
                  </Typography>
                  <Chip 
                    label={payment.status_display}
                    color={payment.status === 'success' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Box>
            ))}
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={orderDetailStyles.actions}>
        <Button onClick={onClose} color="inherit">
          Đóng
        </Button>
        
        {onPrint && (
          <Button
            startIcon={<PrintIcon />}
            onClick={() => onPrint(order)}
            color="info"
          >
            In hóa đơn
          </Button>
        )}
        
        {order.status === 'pending' && onPayment && (
          <Button
            startIcon={<PaymentIcon />}
            onClick={() => onPayment(order)}
            color="success"
            variant="contained"
          >
            Thanh toán
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
