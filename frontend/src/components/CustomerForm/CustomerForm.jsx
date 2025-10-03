import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  Alert
} from '@mui/material'
import api from '../../api/axios'
import { customerFormStyles } from './CustomerForm.styles'

export default function CustomerForm({ open, onClose, customer, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    note: '',
    is_active: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (open) {
      if (customer) {
        // Edit mode
        setFormData({
          name: customer.name || '',
          phone: customer.phone || '',
          email: customer.email || '',
          address: customer.address || '',
          note: customer.note || '',
          is_active: customer.is_active !== undefined ? customer.is_active : true
        })
      } else {
        // Add mode - reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: '',
          note: '',
          is_active: true
        })
      }
      setError(null)
    }
  }, [open, customer])

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (customer) {
        // Update
        await api.put(`/customers/${customer.id}/`, formData)
        onSuccess('Cập nhật khách hàng thành công!')
      } else {
        // Create
        await api.post('/customers/', formData)
        onSuccess('Thêm khách hàng thành công!')
      }
      onClose()
    } catch (err) {
      console.error('Error saving customer:', err)
      const errorMsg = err.response?.data?.phone?.[0] || err.response?.data?.detail || 'Có lỗi xảy ra khi lưu khách hàng'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} {...customerFormStyles.dialog}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {customer ? 'Chỉnh sửa Khách hàng' : 'Thêm Khách hàng mới'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={customerFormStyles.errorAlert}>
              {error}
            </Alert>
          )}

          <Grid container spacing={customerFormStyles.gridSpacing} sx={customerFormStyles.gridContainer}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Tên khách hàng"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="VD: Nguyễn Văn A"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="VD: 0901234567"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="VD: customer@email.com"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Ghi chú"
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Ghi chú về khách hàng..."
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
                label="Kích hoạt"
              />
            </Grid>
          </Grid>
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
