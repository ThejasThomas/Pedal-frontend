import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/UI/card";
import { Button } from "../../../components/UI/button";
import { useSelector } from "react-redux";
import { RadioGroup, RadioGroupItem } from "../../../components/UI/radio";
import { Label } from "../../../components/UI/label";
import { AlertCircle, Currency, Trash2, X } from "lucide-react";
import { Alert, AlertDescription } from "../../../components/UI/alert";
import { Input } from "../../../components/UI/input";
import PaymentComponent from "../../../utils/paymentComponent";
import { toast } from "sonner";
import { axiosInstance } from "../../../api/axiosInstance";

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [validationError, setValidationError] = useState({
    address: false,
    payment: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    addressId: null,
  });
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    city: "",
    pincode: "",
    address: "",
    country: "",
    state: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useSelector((state) => state.user.users);

  const countries = [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "IN", name: "India" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
  ];

  const statesByCountry = {
    US: ["Alabama", "Alaska", "Arizona", "California", "Florida"],
    IN: ["Tamil Nadu", "Kerala", "Karnataka", "Maharashtra", "Gujarat"],
    GB: ["England", "Scotland", "Wales", "Northern Ireland"],
    CA: ["Ontario", "Quebec", "British Columbia", "Alberta"],
    AU: ["New South Wales", "Victoria", "Queensland", "Western Australia"],
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchAddresses(), fetchCartItems()]);
    };
    fetchData();
  }, [user._id]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/user/fetchuseraddress/${user._id}`
      );

      if (response.data.success) {
        const addressData = response.data.data || [];
        setAddresses(addressData);
        if (addressData.length > 0) {
          setSelectedAddress(addressData[0]._id);
        }
      } else {
        throw new Error(response.data.message || "Failed to fetch addresses");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      setCartLoading(true);
      const response = await axiosInstance.get(
        `/user/getcartdetails/${user._id}`
      );

      if (response.data.success) {
        setCartItems(response.data.cart.products || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch cart items");
      }
    } catch (error) {
      setCartError(
        error.response?.data?.message || "Failed to fetch cart items"
      );
    } finally {
      setCartLoading(false);
    }
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState("");
    setErrors((prev) => ({
      ...prev,
      country: "",
      state: "",
    }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Mobile must be a 10-digit number";
    if (!selectedCountry) newErrors.country = "Country is required";
    if (!selectedState) newErrors.state = "State is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "Pincode must be a 6-digit number";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        country: selectedCountry,
        state: selectedState,
      };

      const response = await axiosInstance.post(
        `user/useraddress/${user._id}`,
        submitData
      );

      if (response.data.success) {
        await fetchAddresses();
        alert("Address added successfully");
        handleCloseModal();
      } else {
        throw new Error(response.data.message || "Failed to save address");
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit:
          error.response?.data?.message ||
          "Failed to save address. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (addressId) => {
    setDeleteConfirmation({
      show: true,
      addressId,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmation.addressId) return;

    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(
        `/user/deleteaddress/${deleteConfirmation.addressId}`
      );

      if (response.data.success) {
        await fetchAddresses();
        alert("Address deleted successfully");
      } else {
        throw new Error(response.data.message || "Failed to delete address");
      }
    } catch (error) {
      alert("Failed to delete address. Please try again.");
    } finally {
      setIsDeleting(false);
      handleCancelDelete();
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({
      show: false,
      addressId: null,
    });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setCouponError("");

    try {
      const response = await axiosInstance.post("/user/apply-coupon", {
        code: couponCode,
        userId: user._id,
      });

      if (response.data.success) {
        const coupon = response.data.CouponData;
        setIsApplyingCoupon(true);
        const subtotal = calculateTotal();

        if (coupon.minPurchaseAmount && subtotal < coupon.minPurchaseAmount) {
          toast.error(
            `Minimum purchase amount is ₹${coupon.minPurchaseAmount}`
          );
          return;
        }

        // if (coupon.currentUsageLimit >= coupon.maxUsageLimit) {
        //   toast.error("Coupon usage limit exceeded")
        //   return
        // }

        if (
          coupon.expirationDate &&
          new Date(coupon.expirationDate) < new Date()
        ) {
          toast.error("Coupon has expired");
          return;
        }
        let discountAmount = (subtotal * coupon.discountValue) / 100;

        if (
          coupon.maxDiscountAmount &&
          discountAmount > coupon.maxDiscountAmount
        ) {
          discountAmount = coupon.maxDiscountAmount;
        }

        setAppliedCoupon({
          ...coupon,
          discountAmount,
        });

        setCouponCode("");
      } else {
        toast.error(response.data.message || "Invalid coupon code");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to apply coupon. Please try again."
      );
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handlePlaceOrder = async (paymentStatus = 'Pending',paymentDetails = null) => {
    setValidationError({ address: false, payment: false });

    if (!selectedAddress || !paymentMethod) {
      const newValidationError = {
        address: !selectedAddress,
        payment: !paymentMethod,
      };
      setValidationError(newValidationError);

      const missingFields = [];
      if (!selectedAddress) missingFields.push("delivery address");
      if (!paymentMethod) missingFields.push("payment method");

      toast(`Please select ${missingFields.join(" and ")} to proceed.`);
      return;
    }

    try {
      let finalPaymentStatus = paymentStatus;
      let paymentData = paymentDetails;

      if (paymentMethod === "CashOnDelivery") {
        finalPaymentStatus = "Pending";
      } else if (paymentMethod === "Razorpay") {
        finalPaymentStatus = paymentStatus;  
      }
      const orderData = {
        userId: user._id,
        addressId: selectedAddress,
        paymentMethod: paymentMethod,
        paymentStatus: finalPaymentStatus,
        paymentDetails: paymentData, 
        totalAmount: calculateFinalTotal(),
        couponDiscount: appliedCoupon ? appliedCoupon.discountAmount : 0,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.basePrice,
        })),
        orderStatus: finalPaymentStatus === "Paid" ? "ON THE ROAD" : 
                     finalPaymentStatus === "Failed" ? "ON THE ROAD" : "PENDING",
            };
            console.log('finalpaymentt',finalPaymentStatus);
            
            if (finalPaymentStatus === "Failed") {
              const response = await axiosInstance.post("/user/placeorder", orderData);
              toast.error("Payment failed. Please try again.");
              // window.location.href = "/user/checkout";
              return;
            }

      const response = await axiosInstance.post("/user/placeorder", orderData);

      if (response.data.success) {
        if (paymentMethod === "CashOnDelivery" || finalPaymentStatus === "Paid") {
          try {
            await axiosInstance.post(`/user/clearcart/${user._id}`);
            setCartItems([]);
            toast.success("Order placed successfully!");
            window.location.href = "/user/orderplaced";
          } catch (clearCartError) {
            console.error("Error clearing cart:", clearCartError);
            toast("Order placed successfully! (Cart clearing failed)");
            window.location.href = "/user/orderplaced";
          }
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to place order. Please try again."
      );
      if (paymentStatus === "Failed") {
        window.location.href = "/user/checkout";
      }
    }
  };
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.totalPrice || 0), 0);
  };

  const calculateDiscount = () => {
    return appliedCoupon ? appliedCoupon.discountAmount : 0;
  };

  const calculateFinalTotal = () => {
    const subtotal = calculateTotal();
    return subtotal - calculateDiscount();
  };

  const handleCloseModal = () => setShowModal(false);

  if (loading || cartLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select Delivery Address</CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-red-500 py-4 text-center">
                  {error}
                  <button
                    onClick={fetchAddresses}
                    className="ml-2 text-blue-500 underline hover:text-blue-600"
                  >
                    Retry
                  </button>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-4 text-gray-600">
                  No addresses found. Please add a delivery address.
                </div>
              ) : (
                <div>
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`relative flex items-start border rounded-lg p-4 hover:border-blue-500 transition-colors ${
                        selectedAddress === address._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => setSelectedAddress(address._id)}
                    >
                      <div className="ml-3 flex-grow cursor-pointer">
                        <div className="font-bold text-lg">
                          {address.fullName}
                        </div>
                        <div className="space-y-1 text-gray-600">
                          <p>{address.address}</p>
                          <p>
                            {address.city}
                            {address.state && `, ${address.state}`}
                            {address.country && `, ${address.country}`}
                          </p>
                          <p>PIN: {address.pincode}</p>
                          <p className="text-sm">Mobile: {address.mobile}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(address._id);
                        }}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete address"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(true)}
                className="mt-4 border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                Add New Address
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {cartError ? (
                <div className="text-red-500 py-4 text-center">
                  {cartError}
                  <button
                    onClick={fetchCartItems}
                    className="ml-2 text-blue-500 underline hover:text-blue-600"
                  >
                    Retry
                  </button>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-4 text-gray-600">
                  Your cart is empty
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex border-b pb-4">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={item.images?.[0] || "/placeholder.png"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="mt-1 text-sm">
                          <span>Qty: {item.quantity}</span>
                          <span className="ml-4">
                            ₹{item.basePrice * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">Apply Coupon</h3>
                    {appliedCoupon ? (
                      <div className="bg-blue-50 p-3 rounded-md flex justify-between items-center">
                        <div>
                          <p className="text-blue-700 font-medium">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-sm text-blue-600">
                            {appliedCoupon.discountPercentage} off up to ₹{" "}
                            {appliedCoupon.discountAmount.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-blue-700 hover:text-blue-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter coupon code"
                            className="flex-grow"
                          />
                          <Button
                            onClick={handleApplyCoupon}
                            disabled={isApplyingCoupon || !couponCode.trim()}
                            className="whitespace-nowrap bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            {isApplyingCoupon ? "Apply" : "Apply"}
                          </Button>
                        </div>
                        {couponError && (
                          <p className="text-red-500 text-sm">{couponError}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-3">Payment Method</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="cod"
                            name="paymentMethod"
                            value="CashOnDelivery"
                            checked={paymentMethod === "CashOnDelivery"}
                            onChange={() => setPaymentMethod("CashOnDelivery")}
                            className="form-radio h-4 w-4 text-blue-600"
                          />
                          <Label htmlFor="cod">Cash on Delivery</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="razorpay"
                            name="paymentMethod"
                            value="Razorpay"
                            checked={paymentMethod === "Razorpay"}
                            onChange={() => setPaymentMethod("Razorpay")}
                            className="form-radio h-4 w-4 text-blue-600"
                          />
                          <Label htmlFor="razorpay">
                            Online Payment (Razorpay)
                          </Label>
                        </div>
                      </div>
                      {validationError.payment && (
                        <Alert
                          variant="warning"
                          className="bg-yellow-50 border-yellow-200 mt-2"
                        >
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <AlertDescription className="text-yellow-700">
                            Please select a payment method
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                    {paymentMethod === "Razorpay" ? (
                      <PaymentComponent
                        total={calculateFinalTotal()}
                        handlePlaceOrder={handlePlaceOrder}
                        cartItems={cartItems}
                      />
                    ) : (
                      <Button
                        onClick={handlePlaceOrder}
                        className={`w-full mt-4 ${
                          selectedAddress && paymentMethod
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={
                          !selectedAddress ||
                          !paymentMethod ||
                          cartItems.length === 0
                        }
                      >
                        {!selectedAddress
                          ? "Select a Delivery Address"
                          : !paymentMethod
                          ? "Select Payment Method"
                          : "Place Order (Cash on Delivery)"}
                      </Button>
                    )}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹{calculateDiscount()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{calculateFinalTotal()}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Add New Address</h2>
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded">
                  {errors.submit}
                </div>
              )}

              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="mobile">Mobile</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  maxLength={10}
                  className={errors.mobile ? "border-red-500" : ""}
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                )}
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  className={`w-full border rounded-md p-2 ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                )}
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <select
                  id="state"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={!selectedCountry}
                  className={`w-full border rounded-md p-2 ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select State</option>
                  {selectedCountry &&
                    statesByCountry[selectedCountry].map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                </select>
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  maxLength={6}
                  className={errors.pincode ? "border-red-500" : ""}
                />
                {errors.pincode && (
                  <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isSubmitting ? "Saving..." : "Save Address"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Delete Address</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this address? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {isDeleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
