import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  Typography,
  Chip,
  TablePagination,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

const OrderList = ({ 
  orders, 
  loading, 
  onStatusChange, 
  onViewDetails,
  formatDate,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const formatAddress = (shippingInfo) => {
    if (!shippingInfo) return 'N/A';
    return `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city}`;
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã đơn hàng</TableCell>
            <TableCell>Ngày đặt</TableCell>
            <TableCell>Khách hàng</TableCell>
            <TableCell align="right">Tổng tiền</TableCell>
            <TableCell>Thanh toán</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell align="center">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(orders) && orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
            <TableRow key={order?._id}>
              <TableCell>{order?._id}</TableCell>
              <TableCell>{order?.createdAt ? formatDate(order.createdAt) : 'N/A'}</TableCell>
              <TableCell>
                <Typography>
                  {order?.shippingInfo?.fullName || 'N/A'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {order?.shippingInfo?.phone || 'N/A'}
                </Typography>
                <Typography variant="caption" color="textSecondary" noWrap>
                  {formatAddress(order?.shippingInfo)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(order?.totalAmount || 0)}
              </TableCell>
              <TableCell>
                <Chip
                  label={order?.paymentMethod === 'vnpay' ? 'VNPay' : 'COD'}
                  size="small"
                  sx={{
                    mr: 1,
                    backgroundColor: order?.paymentMethod === 'vnpay' ? '#E3F2FD' : '#FFF3E0',
                    color: order?.paymentMethod === 'vnpay' ? '#1976D2' : '#E65100',
                  }}
                />
                <Chip
                  label={order?.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  size="small"
                  sx={{
                    backgroundColor: getPaymentStatusColor(order?.paymentStatus) + '20',
                    color: getPaymentStatusColor(order?.paymentStatus),
                  }}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={order?.status || 'pending'}
                  onChange={(e) => onStatusChange(order?._id, e.target.value)}
                  size="small"
                  sx={{
                    color: getStatusColor(order?.status),
                    '& .MuiSelect-select': {
                      py: 0.5,
                    },
                  }}
                >
                  <MenuItem value="pending">Chờ xử lý</MenuItem>
                  <MenuItem value="processing">Đang xử lý</MenuItem>
                  <MenuItem value="completed">Hoàn thành</MenuItem>
                  <MenuItem value="cancelled">Đã hủy</MenuItem>
                </Select>
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={() => onViewDetails(order)} color="primary">
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {(!Array.isArray(orders) || orders.length === 0) && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                {loading ? 'Đang tải...' : 'Không có đơn hàng nào'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default OrderList;