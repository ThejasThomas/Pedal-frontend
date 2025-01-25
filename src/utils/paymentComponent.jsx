import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";

function PaymentComponent({ total, handlePlaceOrder, cartItems }) {
  const navigate = useNavigate();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [paymentInProgress, setPaymentInProgress] = useState(false);

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

  const handleSubmit = async () => {
    if (!isScriptLoaded) {
      toast.error("Payment system not loaded. Please refresh.");
      return;
    }

    try {
      const isAvailable = await checkProductAvailability();
      if (!isAvailable) return;

      setPaymentInProgress(true);

      const options = {
        key: "rzp_test_fu3JZWbM4Hq2Jt",
        amount: total * 100,
        currency: "INR",
        name: "PEDALQUEST",
        description: "PEDALQUEST E-COMMERCE PAYMENT",
        handler: function (response) {
          if (response.razorpay_payment_id) {
            handlePlaceOrder("Paid");
          } else {
            toast.error("Payment failed. Please try again.");
            navigate("/user/checkout");
          }
          setPaymentInProgress(false);
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
            setPaymentInProgress(false);
            navigate("/user/checkout");
            toast.info("Payment not completed");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        handlePlaceOrder("Failed");
        navigate("/user/checkout");
      });
      rzp.open();
    } catch (error) {
      setPaymentInProgress(false);
      toast.error("Payment initialization failed");
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={!isScriptLoaded || paymentInProgress}
      className={`bg-black text-white mt-4 w-full h-16 rounded-md ${
        !isScriptLoaded || paymentInProgress
          ? "opacity-50 cursor-not-allowed"
          : ""
      }`}
    >
      {!isScriptLoaded
        ? "Loading Payment..."
        : paymentInProgress
        ? "Processing Payment..."
        : "Pay with RazorPay"}
    </button>
  );
}

export default PaymentComponent;
