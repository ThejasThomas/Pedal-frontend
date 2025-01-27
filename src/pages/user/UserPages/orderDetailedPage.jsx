import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/UI/card';
import { Button } from '../../../components/UI/button';
import { Loader2, CheckCircle2, Package, Truck, Home, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { axiosInstance } from '../../../api/axiosInstance';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancellingOrders, setCancellingOrders] = useState(new Set())
  const [returnRequesting, setReturnRequesting] = useState(false)


  const orderStatusConfig = {
    PENDING: {
      color: "text-yellow-500",
      description: "Your order is being processed and prepared for shipment.",
      icon: AlertCircle,
    },
    PROCESSED: {
      color: "text-blue-500",
      description: "Your order has been processed and is being prepared for shipping.",
      icon: Package,
    },
    SHIPPED: {
      color: "text-green-500",
      description: "Your order has been shipped and is on its way.",
      icon: Truck,
    },
    "ON THE ROAD": {
      color: "text-indigo-500",
      description: "Your order is currently in transit.",
      icon: Truck,
    },
    DELIVERED: {
      color: "text-green-600",
      description: "Your order has been successfully delivered.",
      icon: Home,
    },
    CANCELLED: {
      color: "text-red-500",
      description: "Your order has been cancelled.",
      icon: XCircle,
    },
  }

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`/user/getorderedproduct/${orderId}`)
        if (response.data.success) {
          setOrder(response.data.order)
        }
        console.log('heyy',response.data.order);
        
      } catch (error) {
        console.error("Error fetching order:", error)
        toast.error(error.response?.data?.message || "Failed to fetch order details")
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  const handleProductClick = (productId) => {
    navigate(`/user/product/${productId}`)
  }


  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrders((prev) => new Set([...prev, orderId]))
      const response = await axiosInstance.post(`/user/cancelOrder/${orderId}`)

      if (response.data.success) {
        toast.success("Order cancelled successfully")
        setOrder((prev) => ({ ...prev, orderStatus: "CANCELLED" }))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order")
      console.error("Error cancelling order:", error)
    } finally {
      setCancellingOrders((prev) => {
        const newSet = new Set(prev)
        newSet.delete(orderId)
        return newSet
      })
    }
  }
  const handleReturnRequest = async (orderId) => {
    try {
      setReturnRequesting(true)
      const response = await axiosInstance.post(`/user/requestReturn/${orderId}`)

      if (response.data.success) {
        toast.success("Return request sent to admin for approval")
        // Optional: Update local state to reflect return request status
        setOrder((prev) => ({ 
          ...prev, 
          returnStatus: "PENDING_ADMIN_APPROVAL" 
        }))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit return request")
      console.error("Error requesting return:", error)
    } finally {
      setReturnRequesting(false)
    }
  }

  const getStatusSteps = () => {
    const steps = [
      { status: "PENDING", title: "Order Placed" },
      { status: "PROCESSED", title: "Processed" },
      { status: "SHIPPED", title: "Shipped" },
      { status: "ON THE ROAD", title: "On The Road"},
      { status: "DELIVERED", title: "Delivered" },
      { status: "CANCELLED", title: "Cancelled" },
    ]

    const statusOrder = ["PENDING", "PROCESSED", "SHIPPED", "ON THE ROAD", "DELIVERED", "CANCELLED"]
    const currentStatusIndex = statusOrder.indexOf(order?.orderStatus || "PENDING")

    return (
      <div className="mt-6">
        <div className="relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2" />
          <div
            className={`absolute left-0 top-1/2 h-1 transition-all duration-500 ${
              order?.orderStatus === "CANCELLED" ? "bg-red-500 w-full" : "bg-green-500"
            }`}
            style={{
              width:
                order?.orderStatus === "CANCELLED"
                  ? "100%"
                  : `${(currentStatusIndex / (statusOrder.length - 2)) * 100}%`,
            }}
          />
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isActive = currentStatusIndex >= index
              const isCancelled = order?.orderStatus === "CANCELLED" && step.status === "CANCELLED"
              const isCurrentStep = currentStatusIndex === index

              if (step.status === "CANCELLED" && order?.orderStatus !== "CANCELLED") return null
              if (step.status !== "CANCELLED" && order?.orderStatus === "CANCELLED") return null

              return (
                <div key={step.status} className="flex flex-col items-center">
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center 
                    transition-colors duration-200
                    ${isActive && !isCancelled ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}
                    ${isCancelled ? "bg-red-500 text-white" : ""}
                  `}
                  >
                    {React.createElement(orderStatusConfig[step.status].icon, { className: "w-6 h-6" })}
                  </div>
                  <span
                    className={`
                    mt-2 text-sm font-medium 
                    ${isCurrentStep && !isCancelled ? "text-green-600" : ""}
                    ${isCancelled ? "text-red-500" : ""}
                  `}
                  >
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Order not found.</p>
      </div>
    )
  }

  const canCancel = order && !["DELIVERED", "CANCELLED"].includes(order.orderStatus?.toUpperCase())
  const renderReturnButton = () => {
    // Check if order is delivered and no return request is in progress
    const isDelivered = order?.orderStatus?.toUpperCase() === "DELIVERED"
    const hasNoActiveReturn = !order?.returnStatus || 
      order.returnStatus === "REJECTED"

    if (isDelivered && hasNoActiveReturn) {
      return (
        <Button 
          variant="secondary" 
          onClick={() => handleReturnRequest(order._id)}
          disabled={returnRequesting}
        >
          {returnRequesting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending Request...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Request Return
            </>
          )}
        </Button>
      )
    }
    return null
  }
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Order #{order._id.slice(-6)}</span>
            {canCancel && (
              <Button
                variant="destructive"
                disabled={cancellingOrders.has(order._id)}
                onClick={() => handleCancelOrder(order._id)}
              >
                {cancellingOrders.has(order._id) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Order"
                )}
              </Button>
            )}
            {renderReturnButton()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getStatusSteps()}

          <div className="space-y-6 mt-8">
            <div className="divide-y">
              {order.products &&
                order.products.map((item) => (
                  <div
                    key={item._id}
                    className="py-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2"
                    onClick={() => handleProductClick(item.product?._id)}
                  >
                    
                    <div className="flex-shrink-0 w-20 h-20">
                      <img
                        src={item.product?.images?.[0] || "/placeholder-image.jpg"}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.productName}</h3>
                      <p className="text-sm text-gray-500">{item.productDescription}</p>
                      <div className="mt-1 text-sm">
                        Quantity: {item.quantity} × ${item.price?.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${((item.quantity || 0) * (item.price || 0)).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium">Payment Information</h3>
                <p className="text-sm text-gray-500">Method: {order.paymentMethod}</p>
                <p className="text-sm text-gray-500">Total Amount: ${order.totalAmount?.toFixed(2)}</p>
                <p>Current Status: {order.orderStatus}</p>

              </div>
              

              {order.shippingAddress && (
                <div className="space-y-2">
                  <h3 className="font-medium">Shipping Address</h3>
                  <p className="text-sm text-gray-500">
                    {`${order.shippingAddress.city}, ${order.shippingAddress.state}`}
                    <br />
                    {`${order.shippingAddress.country} ${order.shippingAddress.pincode}`}
                  </p>
                </div>
              )}
            </div>
          </div>
          {order.returnStatus && (
            <div className="mt-4 text-sm">
              Return Status: {order.returnStatus}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default OrderDetailPage