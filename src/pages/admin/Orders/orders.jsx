import React, { useState, useEffect } from "react"
import { ChevronDown, Loader2, Package, DollarSign, Calendar, AlertCircle } from "lucide-react"
import { axiosInstance } from "../../../api/axiosInstance"

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get(`/admin/getAllOrders`)
      if (response.data?.orders && Array.isArray(response.data.orders)) {
        setOrders(response.data.orders)
      } else {
        setError("Invalid data format received from server")
      }
    } catch (err) {
      setError(err.message || "Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/admin/updateOrderStatus/${orderId}/status`, {
        status: newStatus,
      })

      if (response.data?.success) {
        fetchOrders()
      } else {
        setError("Failed to update order status")
      }
    } catch (err) {
      setError(err.message || "Failed to update order status")
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg flex items-center space-x-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="text-lg font-medium text-gray-700">Loading orders...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg shadow-lg flex items-center space-x-4">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <div className="text-red-700 font-medium">Error: {error}</div>
        </div>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-16 text-gray-500">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl font-medium">No orders found</p>
              <p className="mt-2">New orders will appear here when customers make purchases.</p>
            </div>
          </div>
        </div>
      </div>
    )
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
                <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{order._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.user?.firstName || "N/A"}</div>
                    <div className="text-sm text-gray-500">{order.user?.email || "N/A"}</div>
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
                        value={order.orderStatus || "Processing"}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md transition-all duration-150 ease-in-out"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
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
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleStatusUpdate(order._id, "Cancelled")}
                      className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition ease-in-out duration-150 ${
                        order.orderStatus === "Cancelled" ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={order.orderStatus === "Cancelled"}
                    >
                      Cancel Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminOrders

