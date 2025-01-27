import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/UI/card';
import { Loader2 } from 'lucide-react';
import { axiosInstance } from '../../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { users } = useSelector((state) => state.user);
  const navigate =useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/getUserOrders/${users._id}`);
        if (response.data.success) {
          setOrders(response.data.orders);
        }
        console.log(response)
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch orders');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };console.log('OrderHistory component rendered');
console.log('orders:', orders);
console.log('loading:', loading);
console.log('error:', error);   

    if (users?._id) {
      fetchOrders();
    }
  }, [users?._id]);
  const handleOrderClick = (orderId, e) => {
    e.preventDefault();
  
    console.log('Navigating to order:', orderId); 

    
    navigate(`/user/orderdetailedpage/${orderId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      'ON THE ROAD': 'bg-blue-100 text-blue-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <Card 
          key={order._id} 
          className="shadow hover:shadow-lg transition-shadow cursor-pointer"
          onClick={(e) => handleOrderClick(order._id, e)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleOrderClick(order._id, e);
            }
          }}
          >
         {console.log(order)}
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-base">
                <span>#{order._id.slice(-6)}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </CardTitle>
              <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
            </CardHeader>
            <CardContent>
              {order.products.map((item) => (
                <div key={item._id} className="flex items-center space-x-3 mb-3">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={item.product?.images?.[0]|| '/placeholder-image.jpg'}
                      alt={item.productName}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.productName}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total:</span>
                  <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;