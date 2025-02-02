import React, { useState, useEffect } from 'react';
import { FetchCouponsApi } from '../../../api/couponApi';
import { Loader, Tag, Calendar, Users, IndianRupee } from 'lucide-react';
import { toast } from 'react-toastify';

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await FetchCouponsApi();
      setCoupons(response.data.Coupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to fetch available coupons');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Coupons</h1>
        
        {coupons.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No coupons available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coupons.map((coupon) => (
              <div 
                key={coupon._id} 
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {/* Coupon Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {coupon.code}
                    </span>
                    <span className="text-white font-bold">
                      {coupon.discountValue}% OFF
                    </span>
                  </div>
                </div>

                {/* Coupon Body */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{coupon.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <IndianRupee className="w-4 h-4 mr-2 text-green-500" />
                      <span>Min. Purchase: ₹{coupon.minPurchaseAmount}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <IndianRupee className="w-4 h-4 mr-2 text-blue-500" />
                      <span>Max Discount: ₹{coupon.maxDiscountAmount}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                      <span>Expires: {new Date(coupon.expirationDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-orange-500" />
                      <span>Usage Limit: {coupon.usageLimit || 'Unlimited'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-orange-500" />
                      <span>Currently Used: {coupon.currentUsageLimit || 'Unlimited'}</span>
                    </div>
                  </div>
                  

                  {/* Copy Button */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(coupon.code);
                      toast.success('Coupon code copied to clipboard!');
                    }}
                    className="mt-6 w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-100 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Copy Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponPage;