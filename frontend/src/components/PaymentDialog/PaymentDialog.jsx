import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material'
import { Payment as PaymentIcon, Print as PrintIcon } from '@mui/icons-material'
import api from '../../api/axios'
import { paymentDialogStyles } from './PaymentDialog.styles'

export default function PaymentDialog({ open, onClose, order, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('vnpay')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handlePayment = async () => {
    setLoading(true)
    setError(null)

    try {
      if (paymentMethod === 'vnpay') {
        // Create VNPay payment
        console.log('Creating VNPay payment for order:', order.id)
        const response = await api.post(`/orders/${order.id}/create_vnpay_payment/`)
        
        console.log('=== VNPAY DEBUG ===')
        console.log('Full Response:', response.data)
        console.log('Payment URL:', response.data.payment_url)
        console.log('Payment URL Length:', response.data.payment_url?.length)
        console.log('Is Sandbox:', response.data.is_sandbox)
        console.log('==================')
        
        // Redirect to VNPay
        if (response.data.payment_url) {
          // Use window.location.href instead of window.open (more reliable)
          console.log('Redirecting to VNPay...')
          window.location.href = response.data.payment_url
          
          onSuccess('Đang chuyển đến VNPay...')
          onClose()
        } else {
          console.error('No payment_url in response:', response.data)
          setError('Không nhận được URL thanh toán từ server')
        }
      } else if (paymentMethod === 'cash') {
        // Mark as paid (cash payment)
        await api.patch(`/orders/${order.id}/`, { status: 'paid' })
        onSuccess('Thanh toán tiền mặt thành công!')
        onClose()
      }
    } catch (err) {
      console.error('Error processing payment:', err)
      console.error('Error details:', err.response?.data)
      setError(err.response?.data?.error || err.response?.data?.detail || 'Có lỗi xảy ra khi xử lý thanh toán')
    } finally {
      setLoading(false)
    }
  }

  const handlePrintInvoice = async () => {
    try {
      // Open invoice in new tab
      window.open(`${api.defaults.baseURL}/orders/${order.id}/invoice/`, '_blank')
    } catch (err) {
      console.error('Error printing invoice:', err)
      setError('Không thể in hóa đơn')
    }
  }

  if (!order) return null

  return (
    <Dialog open={open} onClose={onClose} {...paymentDialogStyles.dialog}>
      <DialogTitle>Thanh toán Đơn hàng</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={paymentDialogStyles.errorAlert} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={paymentDialogStyles.infoBox}>
          <Typography {...paymentDialogStyles.infoLabel}>
            Mã đơn hàng
          </Typography>
          <Typography {...paymentDialogStyles.infoValue}>{order.code}</Typography>
        </Box>

        <Box sx={paymentDialogStyles.infoBox}>
          <Typography {...paymentDialogStyles.infoLabel}>
            Khách hàng
          </Typography>
          <Typography {...paymentDialogStyles.infoValueBody}>
            {order.customer?.name || order.customer_name || 'Khách lẻ'}
          </Typography>
        </Box>

        <Divider sx={paymentDialogStyles.divider} />

        <Box sx={paymentDialogStyles.totalBox}>
          <Typography {...paymentDialogStyles.totalText}>
            Tổng tiền: {formatCurrency(order.total)}
          </Typography>
        </Box>

        <Divider sx={paymentDialogStyles.divider} />

        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend">Phương thức thanh toán</FormLabel>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel
              value="vnpay"
              control={<Radio />}
              label={
                <Box>
                  <Typography {...paymentDialogStyles.methodLabel}>VNPay</Typography>
                  <Typography {...paymentDialogStyles.methodCaption}>
                    Thanh toán qua cổng VNPay (ATM, QR Code, Ví điện tử)
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="cash"
              control={<Radio />}
              label={
                <Box>
                  <Typography {...paymentDialogStyles.methodLabel}>Tiền mặt</Typography>
                  <Typography {...paymentDialogStyles.methodCaption}>
                    Thanh toán trực tiếp bằng tiền mặt
                  </Typography>
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={handlePrintInvoice}
          disabled={loading}
        >
          In hóa đơn
        </Button>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <PaymentIcon />}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Thanh toán'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
