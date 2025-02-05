import { useState, useEffect } from "react"
import {axiosInstance} from "../api/axiosInstance"
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
        key: "rzp_test_ZOhN3ZFy8RT4rn",
        amount: Math.round(total * 100), // Amount in paisa
        currency: "INR",
        name: "PEDALQUEST",
        // description: `Retry Payment for Order #${orderId ? orderId.slice(-6) : "N/A"}`,
        handler: async (response) => {
          try {
            const confirmResponse = await axiosInstance.post("/user/retrypayment", {
              orderId,
              productId,
              razorpayPaymentId: response.razorpay_payment_id,
            })

            if (confirmResponse.data.success) {
              toast.success("Payment successful!")
              onSuccess && onSuccess(response)
              navigate("/user/orders")
            } else {
              toast.error("Payment confirmation failed")
            }
          } catch (error) {
            toast.error("Payment confirmation error")
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

      // Ensure Razorpay script is fully loaded before opening modal
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
      toast.error("Payment initialization failed")
      console.error("Payment error:", error)
      setIsLoading(false)
    }
  }

  return (
    <button onClick={handlePayment} disabled={isLoading}>
      {isLoading
        ? "Processing Payment..."
        : !isScriptLoaded
          ? "Loading Payment System..."
          : `Continue Payment Rs ${total.toFixed(2)}`}
    </button>
  )
}

export default ContinuePayment

