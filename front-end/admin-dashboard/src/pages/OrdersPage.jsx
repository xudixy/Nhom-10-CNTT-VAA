import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import axios from 'axios';
import OrderList from '../components/orders/OrderList';
import OrderForm from '../components/orders/OrderForm';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      };
      const response = await axios.get('http://localhost:5000/api/orders/admin/all', { headers });
      
      // Get orders from response
      const ordersData = response.data?.orders || [];
      
      // Map the data to match our component structure
      const processedData = ordersData.map(order => ({
        _id: order._id,
        createdAt: order.createdAt,
        status: order.status,
        shippingInfo: order.shippingInfo,
        items: order.items.map(item => ({
          productId: item.productId._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size
        })),
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        vnpayInfo: order.paymentMethod === 'vnpay' ? {
          txnRef: order.vnpayTxnRef,
          transactionNo: order.vnpayTransactionNo,
          transactionDate: order.vnpayTransactionDate,
          bankCode: order.vnpayBankCode
        } : null
      }));

      setOrders(processedData);
      setFilteredOrders(processedData);
    } catch (error) {
      console.error('Error details:', error.response || error);
      setSnackbar({
        open: true,
        message: `Lỗi khi tải danh sách đơn hàng: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      };
      
      await axios.put(
        `http://localhost:5000/api/orders/admin/${orderId}/status`,
        { status: newStatus },
        { headers }
      );

      // Update local state after successful API call
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setFilteredOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      setSnackbar({
        open: true,
        message: 'Cập nhật trạng thái đơn hàng thành công',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      setSnackbar({
        open: true,
        message: `Lỗi khi cập nhật trạng thái: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = [...orders];
    
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    if (searchTerm) {
      result = result.filter(order => 
        order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingInfo?.phone?.includes(searchTerm)
      );
    }
    
    setFilteredOrders(result);
  }, [orders, statusFilter, searchTerm]);

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#FFA500',
      'processing': '#0000FF',
      'shipped': '#008000',
      'delivered': '#006400',
      'cancelled': '#FF0000'
    };
    return colors[status] || '#000000';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Chờ xử lý',
      'processing': 'Đang xử lý',
      'shipped': 'Đã gửi hàng',
      'delivered': 'Đã giao hàng',
      'cancelled': 'Đã hủy'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Quản lý đơn hàng
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Select
              fullWidth
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              variant="outlined"
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="all">Tất cả trạng thái</MenuItem>
              <MenuItem value="pending">Chờ xử lý</MenuItem>
              <MenuItem value="processing">Đang xử lý</MenuItem>
              <MenuItem value="shipped">Đã gửi hàng</MenuItem>
              <MenuItem value="delivered">Đã giao hàng</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Paper>

      <OrderList 
        orders={filteredOrders}
        loading={loading}
        onStatusChange={handleStatusChange}
        onViewDetails={handleViewDetails}
        formatDate={formatDate}
        calculateTotal={calculateTotal}
        getStatusColor={getStatusColor}
      />

      <OrderForm 
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        order={selectedOrder}
        formatDate={formatDate}
        calculateTotal={calculateTotal}
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrdersPage;
