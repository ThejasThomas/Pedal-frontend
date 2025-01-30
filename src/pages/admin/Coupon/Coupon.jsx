import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Trash2, Ticket, Tag, Calendar, Users, IndianRupee, FolderX, Loader2, Percent } from "lucide-react"
import { toast } from "sonner"
import { deleteCouponApi, FetchCouponsApi } from "../../../api/couponApi"

export default function CouponManagement() {
  const navigate = useNavigate()
  const [coupons, setCoupons] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCoupons = async () => {
    try {
      setIsLoading(true)
      const response = await FetchCouponsApi()
      setCoupons(response.data.Coupons)
    } catch (err) {
      toast.error("Failed to fetch coupons")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCouponApi(id)
        toast.success("Coupon deleted successfully")
        fetchCoupons()
      } catch (err) {
        toast.error("Failed to delete coupon")
        console.error(err)
      }
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Coupon Management</h1>
          <button
            onClick={() => navigate("/admin/addcoupon")}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Ticket className="w-5 h-5 mr-2" />
            Add New Coupon
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <FolderX className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No coupons found</h2>
            <p className="text-gray-500 text-lg">Create a new coupon to get started.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{coupon.code}</h3>
                    <p className="text-sm text-gray-600">{coupon.description}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-300"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mt-6">
                  <div className="flex items-center bg-blue-50 p-2 rounded-lg">
                    <Tag className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="font-medium text-blue-800">{coupon.discountValue}% off</span>
                  </div>
                  <div className="flex items-center bg-green-50 p-2 rounded-lg">
                    <IndianRupee className="w-5 h-5 mr-2 text-green-600" />
                    <span className="font-medium text-green-800">MinPurchase: ₹{coupon.minPurchaseAmount}</span>
                  </div>
                  <div className="flex items-center bg-green-50 p-2 rounded-lg">
                    <IndianRupee className="w-5 h-5 mr-2 text-green-600" />
                    <span className="font-medium text-green-800">MaxDiscount: ₹{coupon.maxDiscountAmount}</span>
                  </div>
                  <div className="flex items-center bg-purple-50 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                    <span className="font-medium text-purple-800">
                      {new Date(coupon.expirationDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center bg-orange-50 p-2 rounded-lg">
                    <Users className="w-5 h-5 mr-2 text-orange-600" />
                    <span className="font-medium text-orange-800">Limit: {coupon.usageLimit || "Unlimited"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

