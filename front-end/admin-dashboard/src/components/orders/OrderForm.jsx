import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Divider,
  Box,
  Chip,
} from '@mui/material';

const OrderForm = ({ order, open, onClose, formatDate }) => {
  if (!order) return null;

  const formatAddress = (shippingInfo) => {
    if (!shippingInfo) return 'N/A';
    return `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city}`;
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return '#43A047';
      case 'pending':
        return '#FFA726';
      case 'failed':
        return '#EF5350';
      default:
        return '#757575';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFA726';
      case 'processing':
        return '#29B6F6';
      case 'completed':
        return '#66BB6A';
      case 'cancelled':
        return '#EF5350';
      default:
        return '#757575';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Chi tiết đơn hàng #{order._id}
        <Box sx={{ mt: 1 }}>
          <Chip
            label={order.status === 'pending' ? 'Chờ xử lý' : 
                  order.status === 'processing' ? 'Đang xử lý' :
                  order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
            size="small"
            sx={{
              backgroundColor: getStatusColor(order.status) + '20',
              color: getStatusColor(order.status),
              mr: 1
            }}
          />
          <Chip
            label={order.paymentMethod === 'vnpay' ? 'VNPay' : 'COD'}
            size="small"
            sx={{
              mr: 1,
              backgroundColor: order.paymentMethod === 'vnpay' ? '#E3F2FD' : '#FFF3E0',
              color: order.paymentMethod === 'vnpay' ? '#1976D2' : '#E65100',
            }}
          />
          <Chip
            label={order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
            size="small"
            sx={{
              backgroundColor: getPaymentStatusColor(order.paymentStatus) + '20',
              color: getPaymentStatusColor(order.paymentStatus),
            }}
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Thông tin khách hàng
            </Typography>
            <Typography>
              Họ tên: {order.shippingInfo?.fullName || 'N/A'}
            </Typography>
            <Typography>
              Email: {order.shippingInfo?.email || 'N/A'}
            </Typography>
            <Typography>
              Số điện thoại: {order.shippingInfo?.phone || 'N/A'}
            </Typography>
            <Typography>
              Địa chỉ: {formatAddress(order.shippingInfo)}
            </Typography>
            {order.shippingInfo?.note && (
              <Typography>
                Ghi chú: {order.shippingInfo.note}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Thông tin đơn hàng
            </Typography>
            <Typography>
              Ngày đặt: {formatDate(order.createdAt)}
            </Typography>
            {order.paymentMethod === 'vnpay' && order.vnpayTxnRef && (
              <>
                <Typography>
                  Mã giao dịch VNPay: {order.vnpayTxnRef}
                </Typography>
                <Typography>
                  Ngân hàng: {order.vnpayBankCode || 'N/A'}
                </Typography>
                {order.vnpayTransactionDate && (
                  <Typography>
                    Thời gian thanh toán: {formatDate(order.vnpayTransactionDate)}
                  </Typography>
                )}
              </>
            )}
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Sản phẩm
            </Typography>
            {order.items?.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Kích thước: {item.size} | Số lượng: {item.quantity}
                </Typography>
                <Typography variant="body2">
                  Đơn giá: {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(item.price)}
                </Typography>
                <Typography variant="body2">
                  Thành tiền: {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(item.price * item.quantity)}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" align="right">
              Tổng tiền: {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(order.totalAmount)}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderForm;
