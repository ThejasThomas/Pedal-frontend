import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import { useSelector } from "react-redux";

function PaymentComponent({ total, handlePlaceOrder, cartItems }) {
  const navigate = useNavigate();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [failureReason, setFailureReason] = useState("");

  const user = useSelector((state) => state.user.users);

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      script.onerror = () => {
        toast.error("Failed to load payment system");
        setIsScriptLoaded(false);
      };
      document.body.appendChild(script);
    } else {
      setIsScriptLoaded(true);
    }

    return () => {
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const checkProductAvailability = async () => {
    try {
      const res = await axiosInstance.post("/user/productavailbale", {
        cartItems,
      });
      if (!res.data.success) {
        toast.error(res.data.message);
        navigate("/user/checkout");
        return false;
      }
      return true;
    } catch (err) {
      toast.error("Error checking product availability!");
      return false;
    }
  };

  const handlePaymentSuccess = (response) => {
    if (response.razorpay_payment_id) {
      handlePlaceOrder("Paid");
      setPaymentFailed(false);
      setFailureReason("");
      setPaymentInProgress(false);
      toast.success("Payment successful!");
    }
  };

  const handlePaymentFailure = async (reason = "Payment was not completed") => {
    try {
      await handlePlaceOrder("Failed", {
        reason: reason,
      });
      
      await axiosInstance.post(`/user/clearcart/${user._id}`);
      
      setPaymentInProgress(false);
      setPaymentFailed(true);
      setFailureReason(reason);
      toast.error(reason);
      
      navigate("/user/checkout");
    } catch (error) {
      console.error("Error in payment failure handling:", error);
      toast.error("An error occurred while processing payment failure");
    }
  };

  const initializePayment = () => {
    const options = {
      key: "rzp_test_ZOhN3ZFy8RT4rn",
      amount: total * 100,
      currency: "INR",
      name: "PEDALQUEST",
      description: "PEDALQUEST E-COMMERCE PAYMENT",
      handler: handlePaymentSuccess,
      retry: {
        enabled: false
      },
      prefill: {
        name: "Thejas Thomas",
        email: "thejasperumpallil007@gmail.com",
        contact: "8921445614",
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: function () {
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      handlePaymentFailure("Payment failed. Please try again");
    });
    rzp.open();
  };



  const handleSubmit = async () => {
    if (!isScriptLoaded) {
      toast.error("Payment system not loaded. Please refresh.");
      return;
    }

    try {
      const isAvailable = await checkProductAvailability();
      if (!isAvailable) return;

      setPaymentInProgress(true);
      setPaymentFailed(false);
      setFailureReason("");
      initializePayment();
    } catch (error) {
      
    }
  };

  return (
    <div className="space-y-4">
      {paymentFailed && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700 text-sm mb-2">
            {failureReason}. You can try the payment again.
          </p>
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={!isScriptLoaded || paymentInProgress}
        className={`bg-black text-white w-full h-16 rounded-md ${
          !isScriptLoaded || paymentInProgress
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {!isScriptLoaded
          ? "Loading Payment..."
          : paymentInProgress
          ? "Processing Payment..."
          : paymentFailed
          ? "Retry Payment"
          : "Pay with RazorPay"}
      </button>
    </div>
  );
}

export default PaymentComponent;