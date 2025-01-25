import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle, ArrowRight } from 'lucide-react';

const Orderplaced = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl transform transition-all duration-500 ease-in-out hover:scale-105">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Order Placed!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for shopping with us. Your order has been successfully placed.
          </p>
          <div className="animate-bounce mb-8">
            <ShoppingBag className="w-16 h-16 text-blue-500 mx-auto" />
          </div>
          <button
            onClick={() => navigate('/user/store')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Continue Shopping
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orderplaced;

