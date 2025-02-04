import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2, RefreshCw, ChevronRight } from "lucide-react";
import { axiosInstance } from "../../../api/axiosInstance";
import ContinuePayment from "../../../utils/retryPaymentComponent";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { users } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/user/getUserOrders/${users._id}`
        );
        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch orders");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (users?._id) {
      fetchOrders();
    }
  }, [users?._id]);

  const handleOrderClick = (orderId) => {
    navigate(`/user/orderdetailedpage/${orderId}`);
  };

  // const handleRetryPayment = async (e, orderId, productId) => {
  //   e.stopPropagation();
  //   try {
  //     const response = await axiosInstance.post("/user/retrypayment", {
  //       orderId,
  //       productId,
  //     });

  //     // if (response.data.success) {
  //     //   navigate(`/payment/retry/${orderId}`);
  //     // }
  //   } catch (error) {
  //     console.error("Error retrying payment:", error);
  //   }
  // };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      "ON THE ROAD": "bg-blue-100 text-blue-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
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
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden cursor-pointer"
            onClick={() => handleOrderClick(order._id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleOrderClick(order._id);
              }
            }}
          >
            <div className="p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between mb-4">
                <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                  <span className="font-semibold">#{order._id.slice(-6)}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <div className="space-y-3">
                {order.products.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={
                          item.product?.images?.[0] ||
                          "/placeholder.svg?height=64&width=64"
                        }
                        alt={item.productName}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-sm">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                      {item.paymentStatus === "Failed" && (
                        <ContinuePayment
                          total={item.quantity * item.price}
                          orderId={order._id}
                          productId={item._id}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t flex justify-between items-center">
                <span className="text-sm text-gray-500">Total:</span>
                <span className="font-bold text-lg">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
              <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                View Details <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
