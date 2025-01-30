import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import AdminLogin from '../pages/admin/login/adminLogin';
import { AdminLayout } from '../pages/admin/layout/AdminLayout';
import  Dashboard  from '../pages/admin/Dashboard/Dashboard';
import { ProductPage } from '../pages/admin/ProductPage/ProductsPage';
import CategoryPage from '../pages/admin/CategoryPage/CategoryPage';
import Order from '../pages/admin/Orders/orders';
import Customers from '../pages/admin/Customers/customers';
import LogOut from '../pages/admin/Logout/logout';
import AddProductPage from '../components/admin/Products/AddProducts';
import AddCategory from '../components/admin/AddCategory/AddCategory';
import EditProductPage from '../components/admin/Products/EditProducts';
import EditCategory from '../components/admin/AddCategory/EditCategory';
import AdminUsersOrders from '../pages/admin/Orders/adminUsersOrders'
import CouponManagement from '../pages/admin/Coupon/Coupon';
import AddCouponForm from '../components/admin/coupon/AddCoupon';
import SalesReport from '../pages/admin/SalesReport/salesReport';
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/coupon" element={<CouponManagement />} />
        <Route path="/addcoupon" element={<AddCouponForm />} />
        <Route path="/salesreport" element={<SalesReport />} />
        <Route path="/customer" element={<Customers />} />
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