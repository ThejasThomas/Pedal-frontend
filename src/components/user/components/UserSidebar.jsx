import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Package, List, ShoppingCart, Heart, Home, Wallet, LogOut, X } from 'lucide-react';
import { logoutUser } from '../../../../redux/slice/userSlice';
import { useDispatch } from 'react-redux';

const menuItems = [
  { icon: LayoutGrid, label: 'Dashboard', path: '/user/dashboard' },
  { icon: Package, label: 'Address', path: '/user/address' },
  { icon: List, label: 'Order History', path: '/user/orders' },
  { icon: ShoppingCart, label: 'Shopping Cart', path: '/user/cart' },
  { icon: Heart, label: 'Wishlist', path: '/user/wishlist' },
  { icon: Wallet, label: 'Wallet', path: '/user/transaction' },
];

export function UserSidebar({ show, onClose }) {
  const navigate = useNavigate();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const dispatch=useDispatch()

  const handleLogout = () => {
    setShowLogoutAlert(true);
  };

  const cancelLogout = () => {
    setShowLogoutAlert(false);
  };

  const userLogout = () => {
    console.log("LOGGING OUT");
    setShowLogoutAlert(false);
    dispatch(logoutUser())
    navigate('/');
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white flex flex-col transition-transform duration-300 ease-in-out ${show ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">PedalQuest</h1>
        <button onClick={onClose} className="lg:hidden text-white hover:text-blue-200">
          <X size={24} />
        </button>
      </div>
      <nav className="flex-1 px-4 overflow-y-auto">
        <div className="text-sm uppercase text-blue-200 mb-4">Menu</div>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'hover:bg-blue-700'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto p-4 space-y-4">
        <NavLink
          to="/user/store"
          className="flex items-center gap-4 px-4 py-3 w-full rounded-lg bg-green-500 hover:bg-green-600 transition-colors duration-300 text-white"
        >
          <Home size={20} />
          <span className="font-medium">Back to Home</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-lg bg-red-500 hover:bg-red-600 transition-colors duration-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
      {showLogoutAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white text-black p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="text-lg font-semibold mb-4">Are you sure you want to logout?</div>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={userLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

