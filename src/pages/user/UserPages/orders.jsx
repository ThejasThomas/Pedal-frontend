import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  RefreshCw,
  ChevronRight,
  Package,
  Calendar,
} from "lucide-react";
import { axiosInstance } from "../../../api/axiosInstance";
import ContinuePayment from "../../../utils/retryPaymentComponent";
import Pagination from "../../../utils/pagination";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 
  const { users } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async (page) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/user/getUserOrders/${users._id}?page=${page}&limit=4`
      );
      if (response.data.success) {
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch orders");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [users?._id]);

  useEffect(() => {
    if (users?._id) {
      fetchOrders();
    }
  }, [users?._id,currentPage, fetchOrders]);

  const handleOrderClick = (orderId) => {
    navigate(`/user/orderdetailedpage/${orderId}`);
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchOrders(pageNumber); 
  };

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

  const getPaymentStatusColor = (status) => {
    const paymentColors = {
      Paid: "bg-green-100 text-green-800",
      Failed: "bg-red-100 text-red-800",
      Pending: "bg-yellow-100 text-yellow-800",
    };
    return paymentColors[status] || "bg-gray-100 text-gray-800";
  };

  const calculateOrderTotal = (products) => {
    return products.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const hasFailedPayments = (products) => {
    return products.some(item => item.paymentStatus === "Failed");
  };

  const getOverallPaymentStatus = (products) => {
    if (products.every(item => item.paymentStatus === "Paid")) return "Paid";
    if (products.some(item => item.paymentStatus === "Failed")) return "Failed";
    return "Pending";
  };

  const handlePaymentSuccess = useCallback(async (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order._id === orderId) {
          return {
            ...order,
            products: order.products.map(product => ({
              ...product,
              paymentStatus: "Paid"
            }))
          };
        }
        return order;
      })
    );

 setTimeout(async () => {
  await  fetchOrders(currentPage);
  }, 1000); 
}, [fetchOrders, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchOrders}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          <RefreshCw className="w-5 h-5 mr-2" /> Retry
        </button>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Package className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-xl text-gray-600">No orders found.</p>
        <button
          onClick={() => navigate("/shop")}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Order History</h1>
      <div className="space-y-6">
        {orders.map((order) => {
          const orderTotal = calculateOrderTotal(order.products);
          const needsPayment = hasFailedPayments(order.products);
          const paymentStatus = getOverallPaymentStatus(order.products);

          return (
            <div
              key={order._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-800">
                      #{order._id.slice(-6)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                        paymentStatus
                      )}`}
                    >
                      Payment: {paymentStatus}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                <div className="space-y-4">
                  {order.products.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="w-20 h-20 flex-shrink-0">
                        <img
                          src={
                            item.product?.images?.[0] ||
                            "/placeholder.svg?height=80&width=80"
                          }
                          alt={item.productName}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-800">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Payment Status: {item.paymentStatus}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">
                          ₹{(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">
                      Order Total:
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{orderTotal.toFixed(2)}
                    </span>
                  </div>
                  {needsPayment && (
                    <div className="mt-4">
                      <ContinuePayment
                        total={orderTotal}
                        orderId={order._id}
                        onSuccess={() => handlePaymentSuccess(order._id)}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end">
                <button
                  onClick={() => handleOrderClick(order._id)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md 
                  text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-gray-600 transition-colors"
                >
                  View Details <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default OrderHistory;