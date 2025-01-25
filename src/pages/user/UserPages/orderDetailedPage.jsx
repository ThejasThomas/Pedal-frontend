import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/UI/card';
import { Button } from '../../../components/UI/button';
import { Loader2, CheckCircle2, Package, Truck, Home, XCircle } from 'lucide-react';
import { axiosInstance } from '../../../api/axiosInstance';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancellingOrders, setCancellingOrders] = useState(new Set());

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        console.log('daaaa',orderId);
        
        const response = await axiosInstance.get(`/user/getorderedproduct/${orderId}`);
        if (response.data.success) {
          setOrder(response.data.order);
        }
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || 'Failed to fetch order details');
        // navigate('/user/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);
  



  const handleProductClick = (productId) => {
    navigate(`user/product/${productId}`);
  };
  


  const handleCancelOrder = async (orderId) => {
  
    try {
      setCancellingOrders(prev => new Set([...prev, orderId]));
      const response = await axiosInstance.post(`/user/cancelOrder/${orderId}`);
      
      if (response.data.success) {
        toast.success('Order cancelled successfully');
        setOrder(prev => ({ ...prev, orderStatus: 'CANCELED' }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
      console.error('Error cancelling order:', error);
    }finally {
      setCancellingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { title: 'Processed', icon: CheckCircle2 },
      { title: 'Shipped', icon: Package },
      { title: 'On Route', icon: Truck },
      { title: 'Arrived', icon: Home },
      { title: 'Cancelled', icon: XCircle } 
    ];

    const statusMap = {
      'PENDING': 0,
      'PROCESSED': 0,
      'SHIPPED': 1,
      'ON THE ROAD': 2,
      'DELIVERED': 3,
      'CANCELED': -1
    };

    const currentStep = statusMap[order?.orderStatus || 'PENDING'];
    
    return { steps, currentStep };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Order not found.</p>
      </div>
    );
  }

  const { steps, currentStep } = getStatusSteps();
  const canCancel = order && !['DELIVERED', 'CANCELED'].includes(order.orderStatus?.toUpperCase());

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Order #{order._id.slice(-6)}</span>
            {console.log('Can cancel:', canCancel, 'Order status:', order?.orderStatus)}
            {canCancel && (
              <Button
                variant="destructive"
                disabled={cancellingOrders.has(order._id)}
                onClick={()=>handleCancelOrder(order._id)}
              >
                {cancellingOrders.has(order._id) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Cancel Order'
                )}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Status Timeline */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2" />
              {order?.orderStatus !== 'CANCELED' ? (
              <div 
                className="absolute left-0 top-1/2 h-1 bg-primary transition-all duration-500"
                style={{ 
                  width: currentStep >= 0 ? `${(currentStep / (steps.length - 1)) * 100}%` : '0%',
                  backgroundColor: order.orderStatus === 'CANCELED' ? '#EF4444' : undefined 
                }}
              />
              ):(<div 
                className="absolute left-0 top-1/2 h-1 bg-red-500 transition-all duration-500"
                style={{ 
                  width: '100%'
                }}
              />
            )}
              <div className="relative flex justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep >= index;
                  const isCanceled = order.orderStatus === 'CANCELED';
                  const isCancelStep = step.title === 'Cancelled';
                  if (isCancelStep && !isCanceled) return null;
                  // Hide normal steps when cancelled
                  if (!isCancelStep && isCanceled) return null;
                  return (
                    <div key={step.title} className="flex flex-col items-center">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center 
                        transition-colors duration-200
                        ${isActive && !isCanceled ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}
                        ${isCanceled ? 'bg-red-500 text-white' : ''}
                      `}>
                        <Icon className="w-6 h-6" />
                        <span className="mt-2 text-sm font-medium text-gray-600">
                        {step.title}
                      </span>
                      {isActive && !isCanceled && (
                        <span className="mt-1 text-xs text-primary">Current</span>
                      )}
                      </div>
                      <span className="mt-2 text-sm font-medium">{step.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            {/* Products */}
            <div className="divide-y">
              {order.products.map((item) => (
                <div key={item._id} className="py-4 flex items-center space-x-4" onClick={() => handleProductClick(item.productId)}>
                  <div className="flex-shrink-0 w-20 h-20">
                    <img
                      src={item.product?.images?.[0] || '/placeholder-image.jpg'}
                      alt={item.productName}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="text-sm text-gray-500">{item.productDescription}</p>
                    <div className="mt-1 text-sm">
                      Quantity: {item.quantity} × ${item.price}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ${(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment and Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium">Payment Information</h3>
                <p className="text-sm text-gray-500">Method: {order.paymentMethod}</p>
                <p className="text-sm text-gray-500">
                  Total Amount: ${order.totalAmount.toFixed(2)}
                </p>
              </div>
              
              {order.shippingAddress && (
                <div className="space-y-2">
                  <h3 className="font-medium">Shipping Address</h3>
                  <p className="text-sm text-gray-500">
                    {`${order.shippingAddress.street}`}<br />
                    {`${order.shippingAddress.city}, ${order.shippingAddress.state}`}<br />
                    {`${order.shippingAddress.country} ${order.shippingAddress.zipCode}`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailPage;