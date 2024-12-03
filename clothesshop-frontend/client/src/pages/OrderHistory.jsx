import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Vui lòng đăng nhập để xem lịch sử đơn hàng');
        }

        const response = await axios.get('http://localhost:5000/api/orders/user-orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('API Response:', response.data);

        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          throw new Error(response.data.message || 'Không thể tải lịch sử đơn hàng');
        }
      } catch (error) {
        console.error('Error details:', error);
        let errorMessage = 'Không thể tải lịch sử đơn hàng';
        
        if (error.response) {
          errorMessage = error.response.data.message || errorMessage;
          console.error('Server error:', error.response.data);
        } else if (error.request) {
          errorMessage = 'Không thể kết nối đến server';
          console.error('Network error:', error.request);
        } else {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-badge pending';
      case 'processing':
        return 'status-badge processing';
      case 'completed':
        return 'status-badge completed';
      case 'cancelled':
        return 'status-badge cancelled';
      default:
        return 'status-badge pending';
    }
  };

  if (loading) {
    return (
      <div className="order-history">
        <div className="order-history-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history">
        <div className="order-history-container">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button 
              className="refresh-button"
              onClick={() => window.location.reload()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history">
      <div className="order-history-container">
        <h1 className="order-history-title">Lịch sử đơn hàng</h1>
        
        {orders.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">Bạn chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="orders-container">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <div className="order-id">Đơn hàng #{order._id}</div>
                    <div className="order-date">{formatDate(order.createdAt)}</div>
                  </div>
                  <div className={getStatusClass(order.orderStatus)}>
                    {order.orderStatus === 'pending' ? 'Chờ xác nhận' :
                     order.orderStatus === 'processing' ? 'Đang xử lý' :
                     order.orderStatus === 'completed' ? 'Hoàn thành' :
                     order.orderStatus === 'cancelled' ? 'Đã hủy' : order.orderStatus}
                  </div>
                </div>

                <div className="order-content">
                  <div className="shipping-info">
                    <h3>Thông tin giao hàng</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <div className="info-label">Người nhận</div>
                        <div className="info-value">{order.shippingInfo.fullName}</div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">Số điện thoại</div>
                        <div className="info-value">{order.shippingInfo.phone}</div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">Địa chỉ</div>
                        <div className="info-value">{order.shippingInfo.address}</div>
                      </div>
                    </div>
                  </div>

                  <div className="products-list">
                    {order.items.map((item) => (
                      <div key={item._id} className="product-item">
                        <div className="product-details">
                          <div className="product-name">{item.name}</div>
                          <div className="product-price">
                            {formatPrice(item.price)} x {item.quantity}
                          </div>
                        </div>
                        <div className="product-total">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary">
                    <div className="payment-method">
                      <div className="info-label">Phương thức thanh toán</div>
                      <div className="info-value">
                        {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 
                         order.paymentMethod === 'vnpay' ? 'VNPay' : order.paymentMethod}
                      </div>
                    </div>
                    <div className="total-amount">
                      <div className="total-label">Tổng tiền</div>
                      <div className="total-value">{formatPrice(order.totalAmount)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
