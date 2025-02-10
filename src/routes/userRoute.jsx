import { Routes, Route } from "react-router-dom";
import UserSignup from "../pages/user/signup/signup";
import OTPVerification from '../pages/user/otpverification/otpVerification';
import UserHome from "../pages/user/home/home"
import ProductDetail from "../pages/user/productOverview/productOverview";
import UserLogin from "../pages/user/login/login";
import Store from "../pages/user/store/Store";
import GoogleAuthButton from "../utils/GoogleAuth/googleAuthButon";
import { ProtectedRoute, AuthRoute } from "../ProtectRoute/UserProtect";
import { UserLayout } from "../pages/admin/layout/userLayout";
import Dashboard from "../pages/user/UserPages/dashboard";
import EditUserDetails from "../components/user/dashboardcomponents/editUserDetails";
import UserAddress from "../pages/user/UserPages/Address";
import CartPage from "../pages/user/UserPages/addToCart";
import CheckOutPage from '../pages/user/UserPages/proceedToCheckout'
import Orderplaced from "../pages/user/UserPages/orderplaced";
import Orders from '../pages/user/UserPages/orders'
import ErrorPage from '../pages/user/UserPages/errorpage'
import OrderDetailPage from "../pages/user/UserPages/orderDetailedPage";
import ContactPage from "../pages/user/contactPage/contactpage";
import ForgotPassword from "../components/Auth/ForgotPassword";
import CouponPage from "../components/user/dashboardcomponents/CouponPage";
import WalletPage from "../pages/user/userWallet";
import WishlistPage from "../pages/user/UserPages/Wishlist";
import AboutUs from "../pages/user/aboutUs/aboutUs";

function UserRoute() {
  return (
    <Routes>
      {/* Login/Signup routes - will redirect to dashboard if user is logged in */}
      <Route element={<AuthRoute />}>
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/otp" element={<OTPVerification />} />
        <Route path="/google" element={<GoogleAuthButton />} />
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
      </Route>
     
      <Route element={<ProtectedRoute />}>
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/store" element={<Store />} />
        
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/address" element={<UserAddress />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckOutPage />} />
          <Route path="/edituserdata" element={<EditUserDetails />} />
          <Route path="/coupons" element={<CouponPage />} />
          <Route path="/wallet" element ={<WalletPage/>}/>
          <Route path="/orders" element={<Orders/>}></Route>
          <Route path="/wishlist" element={<WishlistPage/>}></Route>
         

        </Route>
      </Route> 

      <Route path="/orderplaced" element={<Orderplaced />} />
      <Route path="/orderdetailedpage/:orderId" element={<OrderDetailPage/>}/>
      <Route path="/contactpage" element={<ContactPage/>}/>
      <Route path="/aboutus" element={<AboutUs/>}/>

      <Route path='/*' element ={<ErrorPage/>}/>


    </Routes>
  );
}

export default UserRoute;


