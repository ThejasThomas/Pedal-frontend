import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Loader2,
  Package,
  DollarSign,
  Calendar,
  AlertCircle,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { axiosInstance } from "../../../api/axiosInstance";
import Pagination from "../../../utils/pagination";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get(`/admin/getAllOrders`, {
        params: { page: currentPage, limit: 10 },
      });
      
      if (response.data?.orders && Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
      } else {
        setError("Invalid data format received from server");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnRequest = async (orderId, productId, status) => {
    console.log('idds',orderId)
    console.log('prod id',productId);
    console.log('stta',status);
    
    
    
    try {
      const response = await axiosInstance.put('/admin/returnrespond',{
          orderId,
          productId,
          status
        }
      );

      if (response.data?.success) {
        await fetchOrders(currentPage);
      } else {
        setError("Failed to update return request");
      }
    } catch (err) {
      setError(err.message || "Failed to update return request");
    }
  };
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchOrders(pageNumber);
  };


  

  const handleStatusUpdate = async (orderId, newStatus) => {
    console.log('id',orderId);
    console.log('stst',newStatus);
    
    
    try {
      const response = await axiosInstance.put(
        `/admin/updateOrderStatus/${orderId}/status`,
        {
          status: newStatus,
        }
      );

      if (response.data?.success) {
        fetchOrders();
      } else {
        setError("Failed to update order status");
      }
    } catch (err) {
      setError(err.message || "Failed to update order status");
    }
  };
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  console.log(orders);
  
  
  
  const ProductDetails = ({ products,order }) => (
  
  <div className="bg-gray-50 p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
      <div className="grid grid-cols-1 gap-4">
        {products.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-start space-x-4">
              {item.productImage && (
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900">
                  {item.productName || 'Unnamed Product'}
                </h4>
                <p className="text-sm text-gray-500">
                  {item.productDescription || 'No description available'}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="font-medium">{item.quantity || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Original Price</p>
                    <p className="font-medium">
                      Rs.{(item.originalPrice || 0).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Discounted Price per unit</p>
                    <p className="font-medium">
                      Rs.{(item.price || 0).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="font-medium">
                      Rs.{(item.price*item.quantity || 0).toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Coupon Discount</p>
                    <p className="font-medium">
                      Rs.{(item.couponDiscount || 0).toFixed(2)}
                    </p>
                  </div>
                  {item.discountType && item.discountType !== "No Offer" && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Discount Type</p>
                        <p className="font-medium">{item.discountType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Discount Amount</p>
                        <p className="font-medium">
                          Rs.{(item.discountAmount*item.quantity || 0).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500"> Total paid</p>
                        <p className="font-medium">
                          Rs.{((item.price*item.quantity)-item.couponDiscount || 0).toFixed(2)}
                        </p>
                      </div>
                      
                    </>
                  )}
                  {(item.appliedDiscount || 0) > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Applied Discount</p>
                      <p className="font-medium">
                        Rs.{(item.appliedDiscount || 0).toFixed(2)}
                      </p>
                    </div>
                    
                  )}
                        {item.requestStatus === "Pending" && (
                    <div className="col-span-2 mt-4">
                      <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Return Request Pending</p>
                          <p className="text-sm text-yellow-600">Reason: {item.reason}</p>
                          <p className="text-sm text-yellow-600">Explanation: {item.explanation}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleReturnRequest(order._id, item.product, "Accepted")}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReturnRequest(order._id, item.product, "Rejected")}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {item.returnReq?.requestStatus === "Accepted" && (
                    <div className="col-span-2 mt-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-green-800">Return Request Accepted</p>
                        <p className="text-sm text-green-600">Reason: {item.returnReq.reason}</p>

                      </div>
                    </div>
                  )}
                  
                  {item.returnReq?.requestStatus === "Rejected" && (
                    <div className="col-span-2 mt-4">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-red-800">Return Request Rejected</p>
                        <p className="text-sm text-red-600">Reason: {item.returnReq.reason}</p>

                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg flex items-center space-x-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="text-lg font-medium text-gray-700">
            Loading orders...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg shadow-lg flex items-center space-x-4">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <div className="text-red-700 font-medium">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-800">
              Order Management
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center py-16 text-gray-500">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl font-medium">No orders found</p>
              <p className="mt-2">
                New orders will appear here when customers make purchases.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr
                    className="hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
                    onClick={() => toggleOrderDetails(order._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {order._id}
                          </div>
                        </div>
                        {expandedOrder === order._id ? (
                          <ChevronUp className="ml-2 h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="ml-2 h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.user?.firstName || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          ${order.totalAmount?.toFixed(2) || "0.00"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative inline-block text-left">
                        <select
                          value={order.orderStatus || "PENDING"}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(order._id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md transition-all duration-150 ease-in-out"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="ON THE ROAD">On The Road</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELED">Canceled</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {order.orderStatus !== "DELIVERED" &&
                        order.orderStatus !== "CANCELED" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(order._id, "CANCELED");
                            }}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition ease-in-out duration-150"
                          >
                            Cancel Order
                          </button>
                        )}
                    </td>
                  </tr>
                  {expandedOrder === order._id && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4">
                        <ProductDetails order={order} products={order.products}/>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AdminOrders;
