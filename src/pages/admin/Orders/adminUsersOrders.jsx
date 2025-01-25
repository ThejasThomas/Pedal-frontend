import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/UI/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/UI/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/UI/select";
import { ChevronRight, Users } from 'lucide-react';
import { axiosInstance } from '../../../api/axiosInstance';
import OrderDetailPage from '../../user/UserPages/orderDetailedPage';

const AdminUsersOrders = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const fetchUsers = async () => {
    try {

      const response = await axiosInstance.get('/admin/getAllUsers');
      console.log('response',response);
      
      if (response.data?.users && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        setError('Invalid user data format received from server');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // const fetchUserOrders = async (userId) => {
  //   try {
  //     setLoading(true);
  //     const response = await axiosInstance.get(`/admin/getUserOrders/${userId}`);
  //     if (response.data?.orders && Array.isArray(response.data.orders)) {
  //       setUserOrders(response.data.orders);
  //     } else {
  //       setError('Invalid order data format received from server');
  //     }
  //   } catch (err) {
  //     setError(err.message || 'Failed to fetch user orders');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/admin/getOrderDetails/${orderId}`);
      console.log(response.data)
      if (response.data?.success) {
        setSelectedOrderDetails(response.data.orders);
        setIsModalOpen(true);
      } else {
        setError('Failed to fetch order details');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchUserOrders(user._id);
  };
 

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/admin/updateOrderStatus/${orderId}/status`, {
        status: newStatus
      });
      
      if (response.data?.success) {
        fetchOrderDetails(selectedUser._id);
      } else {
        setError('Failed to update order status');
      }
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Users List */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user._id}</TableCell>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.orderCount || 0}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleUserSelect(user)}
                        className="flex items-center text-blue-500 hover:text-blue-700"
                      >
                        View Orders <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Selected User Orders */}
      {selectedUser && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              Orders for {selectedUser.firstName} {selectedUser.lastName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                        No orders found for this user
                      </TableCell>
                    </TableRow>
                  ) : (
                    userOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">{order._id}
                        <button
                            onClick={() => fetchOrderDetails(order._id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            {order._id}
                          </button>
                        </TableCell>
                        <TableCell>${order.totalAmount?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>
                          <Select
                            value={order.orderStatus || 'Processing'}
                            onValueChange={(value) => handleStatusUpdate(order._id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue>{order.orderStatus || 'Processing'}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Processing">Processing</SelectItem>
                              <SelectItem value="Shipped">Shipped</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {order.createdAt 
                            ? new Date(order.createdAt).toLocaleDateString()
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'Cancelled')}
                            className="text-red-500 hover:text-red-700 font-medium"
                            disabled={order.orderStatus === 'Cancelled'}
                          >
                            Cancel Order
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
      )}

  <OrderDetailPage
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderDetails={selectedOrderDetails}
      />
    </div>
  );
};


export default AdminUsersOrders;