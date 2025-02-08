"use client"

import { useState, useEffect } from "react"
import { axiosInstance } from "../api/axiosInstance"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const ContinuePayment = ({ orderId, productId, total, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => {
      setIsScriptLoaded(true)
    }
    script.onerror = () => {
      console.error("Failed to load Razorpay script")
    }
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async (e) => {
    e.stopPropagation()

    if (!isScriptLoaded) {
      toast.error("Payment system is not loaded. Please try again.")
      return
    }

    setIsLoading(true)

    try {
      // Prepare Razorpay payment options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_ZOhN3ZFy8RT4rn",
        amount: Math.round(total * 100), // Amount in paisa
        currency: "INR",
        name: "PEDALQUEST",
        description: `Retry Payment for Order #${orderId ? orderId.slice(-6) : "N/A"}`,
        handler: async (response) => {
          try {
            const confirmResponse = await axiosInstance.post("/user/retrypayment", {
              orderId,
              productId,
              razorpayPaymentId: response.razorpay_payment_id,
            })

            if (confirmResponse.data.success) {
              // Update order status
              const updateOrderResponse = await axiosInstance.post("/user/updateOrderStatus", {
                orderId,
                status: "PAID",
              })

              if (updateOrderResponse.data.success) {
                toast.success("Payment successful! Order status updated.")
                onSuccess && onSuccess(response)
                navigate("/order-success", { state: { orderId } })
              } else {
                toast.warning("Payment successful, but order status update failed. Please contact support.")
                navigate("/user/orders")
              }
            } else {
              toast.error("Payment confirmation failed")
            }
          } catch (error) {
            toast.error("Error processing payment: " + error.message)
            console.error("Payment confirmation error:", error)
          } finally {
            setIsLoading(false)
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999",
        },
        notes: {
          orderId,
          productId,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false)
            toast.info("Payment process cancelled")
          },
        },
      }

      if (window.Razorpay) {
        const razorpayInstance = new window.Razorpay(options)
        razorpayInstance.on("payment.failed", (response) => {
          toast.error("Payment failed: " + response.error.description)
          setIsLoading(false)
        })
        razorpayInstance.open()
      } else {
        toast.error("Razorpay payment system is not available")
        setIsLoading(false)
      }
    } catch (error) {
      toast.error("Payment initialization failed: " + error.message)
      console.error("Payment error:", error)
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
    >
      {isLoading
        ? "Processing Payment..."
        : !isScriptLoaded
          ? "Loading Payment System..."
          : `Continue Payment Rs ${total.toFixed(2)}`}
    </button>
  )
}

export default ContinuePayment

