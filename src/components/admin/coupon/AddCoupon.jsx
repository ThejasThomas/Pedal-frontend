import React, { useState } from 'react';
import { Tag, Calendar, Users, Save, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../../components/UI/card';
import { AddCouponApi } from '../../../api/couponApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddCouponForm = () => {
  const navigate =useNavigate()
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountValue: '',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    expirationDate: '',
    usageLimit: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.code) {
      newErrors.code = 'Coupon code is required';
    }
    
    if (!data.description) {
      newErrors.description = 'Description is required';
    }
    
    if (!data.discountValue || data.discountValue <= 0 || data.discountValue > 100) {
      newErrors.discountValue = 'Please enter a valid discount value between 0 and 100';
    }
    
    if (data.minPurchaseAmount && data.minPurchaseAmount < 0) {
      newErrors.minPurchaseAmount = 'Minimum purchase amount cannot be negative';
    }
    
    if (data.maxDiscountAmount && data.maxDiscountAmount < 0) {
      newErrors.maxDiscountAmount = 'Maximum discount amount cannot be negative';
    }
    
    if (!data.expirationDate) {
      newErrors.expirationDate = 'Expiration date is required';
    }
    
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try{
      const coupon ={
        code:formData.code,
        description:formData.description,
        discount_value:parseFloat(formData.discountValue),
        min_purchase_amount:parseFloat(formData.minPurchaseAmount),
        max_discount_amount:parseFloat(formData.maxDiscountAmount),
        expiration_date:new Date(formData.expirationDate),
        usage_limit:parseInt(formData.usageLimit),
        is_active:true,
      }
      const response=await AddCouponApi(coupon)
      toast.success(response.data.message)
      navigate('/admin/coupon')

    }catch(err){
      console.log(err);
      if(err.response){
        toast.error(err.response.data.message)
      }
      
    }

    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="fixed left-3 top-3">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
      </div>
      
      <div className="w-full max-w-2xl">
        <Card className="border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <CardTitle className="text-3xl font-bold text-white tracking-wide">
              Create Coupon
            </CardTitle>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coupon Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="code"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="SUMMER2023"
                    value={formData.code}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.code && (
                  <span className="text-red-500 text-xs mt-1">{errors.code}</span>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  name="description"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter coupon description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
                {errors.description && (
                  <span className="text-red-500 text-xs mt-1">{errors.description}</span>
                )}
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Value (%)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">%</span>
                  </div>
                  <input
                    type="number"
                    name="discountValue"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="20"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.discountValue && (
                  <span className="text-red-500 text-xs mt-1">{errors.discountValue}</span>
                )}
              </div>

              {/* Minimum Purchase Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Purchase Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    name="minPurchaseAmount"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="100"
                    value={formData.minPurchaseAmount}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.minPurchaseAmount && (
                  <span className="text-red-500 text-xs mt-1">{errors.minPurchaseAmount}</span>
                )}
              </div>

              {/* Maximum Discount Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Discount Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    name="maxDiscountAmount"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="50"
                    value={formData.maxDiscountAmount}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.maxDiscountAmount && (
                  <span className="text-red-500 text-xs mt-1">{errors.maxDiscountAmount}</span>
                )}
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="expirationDate"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.expirationDate}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.expirationDate && (
                  <span className="text-red-500 text-xs mt-1">{errors.expirationDate}</span>
                )}
              </div>

              {/* Usage Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usage Limit
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="usageLimit"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="100"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.usageLimit && (
                  <span className="text-red-500 text-xs mt-1">{errors.usageLimit}</span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Save className="h-5 w-5 mr-2" />
                Create Coupon
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddCouponForm;