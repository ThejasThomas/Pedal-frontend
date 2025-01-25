import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import AdminLogin from '../pages/admin/login/adminLogin';
import { AdminLayout } from '../pages/admin/layout/AdminLayout';
import { DashboardPage } from '../pages/admin/Dashboard/Dashboard';
import { ProductPage } from '../pages/admin/ProductPage/ProductsPage';
import CategoryPage from '../pages/admin/CategoryPage/CategoryPage';
import Banner from '../pages/admin/Banner/banner';
import Order from '../pages/admin/Orders/orders';
import Coupon from '../pages/admin/Coupon/Coupon';
import Transaction from '../pages/admin/Transactions/transaction';
import Customers from '../pages/admin/Customers/customers';
import Settings from '../pages/admin/Settings/settings';
import LogOut from '../pages/admin/Logout/logout';
import AddProductPage from '../components/admin/Products/AddProducts';
import AddCategory from '../components/admin/AddCategory/AddCategory';
import EditProductPage from '../components/admin/Products/EditProducts';
import EditCategory from '../components/admin/AddCategory/EditCategory';
import AdminUsersOrders from '../pages/admin/Orders/adminUsersOrders'
import CouponManagement from '../pages/admin/Coupon/Coupon';
import AddCouponForm from '../components/admin/coupon/AddCoupon';
const AdminAuthRoute = ({ children }) => {
  const admin = useSelector((state) => state.admin.admin);
  const location = useLocation();

  if (admin) {
    return <Navigate to="/admin/dashboard" replace state={{ from: location }} />;
  }

  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const admin = useSelector((state) => state.admin.admin);
  const location = useLocation();

  if (!admin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
};

function AdminRoute() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AdminAuthRoute>
            <AdminLogin />
          </AdminAuthRoute>
        }
      />

      {/* Protected routes */}
      <Route
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/banner" element={<Banner />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/coupon" element={<CouponManagement />} />
        <Route path="/addcoupon" element={<AddCouponForm />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/customer" element={<Customers />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/logout" element={<LogOut />} />
        <Route path="/addcategory" element={<AddCategory />} />
        <Route path="/addproducts" element={<AddProductPage />} />
        <Route path="/editproducts/:productId" element={<EditProductPage />} />
        <Route path="/editcategory/:categoryId" element={<EditCategory />} />
        
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
      <Route
        path="/"
        element={
          <AdminProtectedRoute>
            <Navigate to="/admin/dashboard" replace />
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AdminRoute;