import { axiosInstance } from "./axiosInstance";

export const  AddCouponApi = async (coupon)=>{
    return await axiosInstance.post("/admin/addCoupon",{coupon})
}

export const FetchCouponsApi = async () => {
    return await axiosInstance.get("/admin/fetchCoupons");
  };
  
  export const deleteCouponApi = async (_id) => {
    return await axiosInstance.delete("/admin/deleteCoupon", { params: { _id } });
  };

  export const applyCouponApi = async (couponCode) => {
    return await axiosInstance.get("/user/coupon", { params: { couponCode } });
  };

  export const updateCouponDataApi = async (coupon_id,user_id)=>{
    return await axiosInstance.patch("/user/coupon/update",{coupon_id , user_id})
  }