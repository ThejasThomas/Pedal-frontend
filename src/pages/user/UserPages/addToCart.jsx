import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../../components/UI/card";
import { Button } from "../../../components/UI/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "../../../components/UI/alert";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockErrors, setStockErrors] = useState({});
  const [checkoutError, setCheckoutError] = useState(null);

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.users);

  useEffect(() => {
    fetchCartDetails();
  }, []);

  const fetchCartDetails = async () => {
    try {
      const userId = user?._id || localStorage.getItem("userId");
      const response = await axiosInstance.get(
        `/user/getcartdetails/${userId}`
      );
      const data = await response.data;

      if (data.success) {
        setCartItems(data.cart.products);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch cart items");
    } finally {
      setLoading(false);
    }
  };
  const handleRemoveItem = async (productId) => {
    try {
      const userId = user?._id || localStorage.getItem("userId");
      const response = await axiosInstance.delete(
        `/user/removefromcart/${userId}/${productId}`
      );

      if (response.data.success) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.productId !== productId)
        );
      } else {
        setError("Failed to remove item");
      }
    } catch (err) {
      setError("Error removing item from cart");
      console.error("Remove item error:", err);
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.totalPrice, 0)
      .toFixed(2);
  };
  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const product = cartItems.find((item) => item.productId === productId);
      if (!product) return;
      if (newQuantity > 15) {
        setStockErrors((prev) => ({
          ...prev,
          [productId]: "Maximum limit is 15 items per product",
        }));
        return;
      }

      const response = await axiosInstance.post(`/user/updatecart`, {
        userId: user?._id || localStorage.getItem("userId"),
        productId,
        quantity: newQuantity,
        price: product.basePrice,
      });

      if (response.data.success) {
        fetchCartDetails();
        setStockErrors((prev) => ({ ...prev, [productId]: null }));
      } else {
        setStockErrors((prev) => ({
          ...prev,
          [productId]: response.data.message,
        }));
      }
    } catch (err) {
      console.error("Update quantity error:", err);
      setStockErrors((prev) => ({
        ...prev,
        [productId]: err.response?.data?.message || "Error updating quantity",
      }));
    }
  };
  const validateCartForCheckout = () => {
    let errors = [];

    for (const item of cartItems) {
      if (item.quantity > 15) {
        errors.push(`${item.name}: Maximum limit is 15 items per product`);
      }
    }

    return errors;
  };
  const handleProceedCheckout = async (e) => {
    e.preventDefault();
    const validationErrors = validateCartForCheckout();
    if (validationErrors.length > 0) {
      setCheckoutError(validationErrors.join(", "));
      return;
    }
    try {
      const userId = user?._id || localStorage.getItem("userId");
      const stockCheckResponse = await axiosInstance.get(
        `/user/validatecart/${userId}`
      );

      if (stockCheckResponse.data.success) {
        setCheckoutError(null);
        navigate("/user/checkout");
      } else {
        setCheckoutError(stockCheckResponse.data.message);
      }
    } catch (err) {
      setCheckoutError(
        err.response?.data?.message || "Error proceeding to checkout"
      );
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {checkoutError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{checkoutError}</AlertDescription>
        </Alert>
      )}
      {cartItems.length === 0 ? (
        <div className="text-center p-8">Your cart is empty</div>
      ) : (
        <>
          {cartItems.map((item) => (
            <Card key={item.productId} className="mb-4">
              <CardContent className="flex items-center p-4">
                <img
                  src={item.images?.[0] || "/api/placeholder/100/100"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />

                <div className="ml-4 flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>

                  <div className="flex items-center mt-2">
                    <span className="text-sm">Price: ${item.basePrice}</span>
                    <div className="mx-4 flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-1"
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-1"
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.quantity + 1
                          )
                        }
                        disabled={item.quantity >= 15}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {stockErrors[item.productId] && (
                    <p className="text-red-500 text-sm mt-1">
                      {stockErrors[item.productId]}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end">
                  <span className="font-semibold">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleRemoveItem(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold">${calculateTotal()}</span>
            </div>
            <Button
              onClick={handleProceedCheckout}
              className="w-full mt-4 bg-black text-white py-3 rounded-lg shadow-lg hover:bg-gray-800 hover:shadow-xl transition duration-300 ease-in-out"
              disabled={
                cartItems.length === 0 || Object.keys(stockErrors).length > 0
              }
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
