import React, { useState } from 'react';
import { LayoutGrid, Package, List, ShoppingCart, Ticket, Image, FileText, Users, Settings, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAdmin } from '../../../redux/slice/adminSlice';


export function Sidebar() {
const navigate=useNavigate()
// const {logoutAdmin} =useSelector((state)=>state.admin)
const dispatch=useDispatch()

  const [showLogoutAlert, setShowLogoutAlert] =useState(false)
  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: List, label: 'Category', path: '/admin/category' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: Ticket, label: 'Coupon', path: '/admin/coupon' },
    { icon: Image, label: 'Banner', path: '/admin/banner' },
    { icon: FileText, label: 'Transaction', path: '/admin/transaction' },
    { icon: Users, label: 'Customers', path: '/admin/customer' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
    // { icon: LogOut, label: 'Logout', path: '/admin/logout' },
  ];
  const handleLogout = () => {
    setShowLogoutAlert(true)
  }
  const cancelLogout = () => {
    setShowLogoutAlert(false);
  }
  const userLogout = () => {
    console.log("LOGGING OUT");
    setShowLogoutAlert(false);
    dispatch(logoutAdmin())
    navigate('/admin/login')
  }
  

  return (
    <aside className="w-64 bg-black text-gray-300 min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-lg font-bold text-white">PedalQuest</h1>
      </div>
      <nav className="flex-1 px-4">
        <div className="text-sm uppercase text-gray-500 mb-4">Menu</div>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-2 mt-4 rounded-md text-white hover:bg-white/5"
        >
          <LogOut size={20} />
          Logout
        </button>
        {showLogoutAlert && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="bg-white text-black p-6 rounded-md shadow-lg max-w-sm w-full">
              <div className="text-lg font-semibold">Are you sure you want to logout?</div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={userLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Yes
                </button>
                <button
                  onClick={cancelLogout}
                  className="px-4 py-2 bg-gray-300 text-black rounded-md"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}