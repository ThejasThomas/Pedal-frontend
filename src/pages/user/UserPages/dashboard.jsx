import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../../api/axiosInstance';
import { Gift, Loader, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const UserDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate =useNavigate()
  const user = useSelector((state) => state.user.users);
  console.log("DATA",user)
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
                const userData = JSON.parse(localStorage.getItem('userData'));
        
        if (!userData?._id) {
          throw new Error('User ID not found');
        }

        const response = await axiosInstance.get(`/user/fetchUserAccountData/${userData._id}`);
        console.log(response.data,"Data");
        
        if (response.data.user) {
            setUserDetails(response.data.user);
          } else {
            throw new Error('Invalid response format');
          }
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user details');
        console.error('Error fetching user details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);
  const handleEdit=(e)=>{
    e.preventDefault()
    navigate('/user/edituserdata')
  }
  const handleCouponsClick = () => {
    navigate('/user/coupons');
  };

  const handleOrdersClick = () => {
    navigate('/user/orders');
  };
const handleWalletClick= ()=>{
  navigate('/user/wallet')
}
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h1>
          <button onClick={handleEdit}>Edit</button>
          
          {userDetails && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">First Name</label>
                    <p className="mt-1 text-base text-gray-900">{userDetails.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Last Name</label>
                    <p className="mt-1 text-base text-gray-900">{userDetails.lastName}</p>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-base text-gray-900">{userDetails.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                    <p className="mt-1 text-base text-gray-900">{userDetails.phone}</p>
                  </div>
                </div>
              </div>


              <div className="pt-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Links</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleCouponsClick}
                    className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    My Coupons
                  </button>
                  <button
                    onClick={handleOrdersClick}
                    className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Order Details
                  </button>
                  <button
                    onClick={handleWalletClick}
                    className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    My Wallet
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;