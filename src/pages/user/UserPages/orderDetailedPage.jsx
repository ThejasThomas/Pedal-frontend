import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Loader2, Package, Truck, Home, XCircle, AlertCircle, RefreshCw, Download } from "lucide-react"
import { axiosInstance } from "../../../api/axiosInstance"
import toast from "react-hot-toast"
import ReturnRequestModal from "../../../utils/ReturnReqMOdal"
import jsPDF from "jspdf"
import "jspdf-autotable"
import OrderCancellationDialog from "../../../components/UI/OrderCancellationDialog"

const OrderDetailPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [isCancelled, setIsCancelled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [cancellingOrders, setCancellingOrders] = useState(new Set())
  const [returnRequesting, setReturnRequesting] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`/user/getorderedproduct/${orderId}`)
        if (response.data.success) {
          const fetchedOrder = response.data.order
          setOrder(fetchedOrder)
          setIsCancelled(fetchedOrder.orderStatus === "CANCELED")
        }
      } catch (error) {
        console.error("Error fetching order:", error)
        toast.error(error.response?.data?.message || "Failed to fetch order details")
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrders((prev) => new Set([...prev, orderId]))
      const response = await axiosInstance.post(`/user/cancelOrder/${orderId}`)

      if (response.data.success) {
        toast.success("Order cancelled successfully")
        setOrder((prev) => ({ ...prev, orderStatus: "CANCELED" }))
        setIsCancelled(true)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order")
    } finally {
      setCancellingOrders((prev) => {
        const newSet = new Set(prev)
        newSet.delete(orderId)
        return newSet
      })
    }
  }

  const handleReturnRequest = async (orderId, returnData, itemId) => {
    try {
      setReturnRequesting(true)
      const response = await axiosInstance.post(`/user/requestReturn`, {
        reason: returnData.reason,
        explanation: returnData.explanation,
        orderId,
        itemId,
      })

      if (response.data.success) {
        toast.success("Return request sent to admin for approval")
        setOrder((prev) => ({
          ...prev,
          products: prev.products.map((product) =>
            product._id === itemId
              ? {
                  ...product,
                  returnReq: {
                    requestStatus: "Pending",
                    reason: returnData.reason,
                    explanation: returnData.explanation,
                  },
                }
              : product,
          ),
        }))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit return request")
    } finally {
      setReturnRequesting(false)
    }
  }

  const handleDownloadInvoice = () => {
    const doc = new jsPDF()

    // Add company logo or name
    doc.setFontSize(20)
    doc.text("PedalQuest Invoice", 105, 15, null, null, "center")

    // Add order details
    doc.setFontSize(12)
    doc.text(`Order ID: ${order._id}`, 20, 30)
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 40)
    doc.text(`Status: ${order.orderStatus}`, 20, 50)

    // Add product table
    const tableColumn = ["Product", "Quantity", "Price", "Total"]
    const tableRows = order.products.map((item) => [
      item.productName,
      item.quantity,
      `$${item.price.toFixed(2)}`,
      `$${(item.quantity * item.price).toFixed(2)}`,
    ])

    doc.autoTable({
      startY: 60,
      head: [tableColumn],
      body: tableRows,
    })

    // Add total
    const finalY = doc.lastAutoTable.finalY || 60
    doc.text(`Total: $${order.totalAmount.toFixed(2)}`, 20, finalY + 10)

    // Save the PDF
    doc.save(`PedalQuest_Invoice_${order._id}.pdf`)
  }

  const orderStatusConfig = {
    PENDING: {
      color: "text-yellow-500",
      description: "Your order is being processed and prepared for shipment.",
      icon: AlertCircle,
    },
    PROCESSED: {
      color: "text-blue-500",
      description: "Your order has been processed and is being prepared for shipping.",
      icon: Package,
    },
    SHIPPED: {
      color: "text-green-500",
      description: "Your order has been shipped and is on its way.",
      icon: Truck,
    },
    "ON THE ROAD": {
      color: "text-indigo-500",
      description: "Your order is currently in transit.",
      icon: Truck,
    },
    DELIVERED: {
      color: "text-green-600",
      description: "Your order has been successfully delivered.",
      icon: Home,
    },
    CANCELED: {
      color: "text-red-500",
      description: "Your order has been cancelled.",
      icon: XCircle,
    },
  }

  const getStatusSteps = () => {
    const steps = [
      { status: "PENDING", title: "Order Placed" },
      { status: "PROCESSED", title: "Processed" },
      { status: "SHIPPED", title: "Shipped" },
      { status: "ON THE ROAD", title: "On The Road" },
      { status: "DELIVERED", title: "Delivered" },
      { status: "CANCELED", title: "Cancelled" },
    ]
    if (order?.orderStatus === "CANCELED") {
      return (
        <div className="mt-6">
          <div className="relative">
            <div className="absolute left-0 top-1/2 w-full h-1 bg-red-500" />
            <div className="relative flex justify-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <span className="mt-2 text-sm font-medium text-red-500">Order Cancelled</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
    const statusOrder = ["PENDING", "PROCESSED", "SHIPPED", "ON THE ROAD", "DELIVERED", "CANCELED"]
    const currentStatusIndex = statusOrder.indexOf(order?.orderStatus || "PENDING")
    return (
      <div className="mt-6">
        <div className="relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2" />
          <div
            className={`absolute left-0 top-1/2 h-1 transition-all duration-500 ${
              order?.orderStatus === "CANCELED" ? "bg-red-500 w-full" : "bg-green-500"
            }`}
            style={{
              width:
                order?.orderStatus === "CANCELED"
                  ? "100%"
                  : `${(currentStatusIndex / (statusOrder.length - 2)) * 100}%`,
            }}
          />
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isActive = currentStatusIndex >= index
              const isCancelled = order?.orderStatus === "CANCELED" && step.status === "CANCELED"
              const isCurrentStep = currentStatusIndex === index
              if (step.status === "CANCELED" && order?.orderStatus !== "CANCELED") return null
              if (step.status !== "CANCELED" && order?.orderStatus === "CANCELED") return null
              return (
                <div key={step.status} className="flex flex-col items-center">
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center 
                    transition-colors duration-200
                    ${isActive && !isCancelled ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}
                    ${isCancelled ? "bg-red-500 text-white" : ""}
                  `}
                  >
                    {React.createElement(orderStatusConfig[step.status].icon, {
                      className: "w-6 h-6",
                    })}
                  </div>
                  <span
                    className={`
                    mt-2 text-sm font-medium 
                    ${isCurrentStep && !isCancelled ? "text-green-600" : ""}
                    ${isCancelled ? "text-red-500" : ""}
                  `}
                  >
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const canCancel = order && !["DELIVERED", "CANCELED", "CANCELED"].includes(order.orderStatus?.toUpperCase())

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Order not found.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Order #{order._id.slice(-6)}</h1>
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
                onClick={handleDownloadInvoice}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </button>
              {canCancel && order.orderStatus !== "CANCELED" && (
                <>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    Cancel Order
                  </button>
                  <OrderCancellationDialog
                    isOpen={showCancelDialog}
                    onClose={() => setShowCancelDialog(false)}
                    onConfirm={() => {
                      handleCancelOrder(order._id)
                      setShowCancelDialog(false)
                    }}
                    isLoading={cancellingOrders.has(order._id)}
                    orderId={order._id}
                  />
                </>
              )}
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Order Status</h2>
            {order.orderStatus === "CANCELED" ? (
              <div className="text-red-500 font-semibold">Order Cancelled</div>
            ) : (
              getStatusSteps()
            )}
            <p className="mt-4 text-gray-600">{orderStatusConfig[order.orderStatus]?.description}</p>
          </div>
          <div className="space-y-6">
            <div className="divide-y">
              {order.products &&
                order.products.map((item) => (
                  <ProductItem
                    key={item._id}
                    item={item}
                    order={order}
                    onReturnRequest={handleReturnRequest}
                    returnRequesting={returnRequesting}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProductItem = ({ item, order, onReturnRequest, returnRequesting }) => {
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)

  const hasReturnRequest = item.returnStatus || (item.returnReq && item.returnReq.requestStatus)

  const getReturnStatusDisplay = () => {
    if (!hasReturnRequest) return null

    const status = item.returnStatus || item.returnReq.requestStatus
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Accepted: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
    }

    return <div className={`px-3 py-1 rounded-full text-sm ${colors[status]}`}>Return {status}</div>
  }

  return (
    <div className="py-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2">
      <div className="flex-shrink-0 w-20 h-20">
        <img
          src={item.product?.images?.[0] || "/placeholder-image.jpg"}
          alt={item.productName}
          className="w-full h-full object-cover rounded"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{item.productName}</h3>
        <p className="text-sm text-gray-500">{item.productDescription}</p>
        <div className="mt-1 text-sm">
          Quantity: {item.quantity} × ${item.price?.toFixed(2)}
        </div>
        {getReturnStatusDisplay()}
      </div>
      <div className="text-right">
        <div className="font-medium">${((item.quantity || 0) * (item.price || 0)).toFixed(2)}</div>
      </div>
      <ReturnRequestButton
        order={order}
        item={item}
        isReturnModalOpen={isReturnModalOpen}
        setIsReturnModalOpen={setIsReturnModalOpen}
        onReturnRequest={onReturnRequest}
        returnRequesting={returnRequesting}
        hasReturnRequest={hasReturnRequest}
      />
    </div>
  )
}

const ReturnRequestButton = ({
  order,
  item,
  isReturnModalOpen,
  setIsReturnModalOpen,
  onReturnRequest,
  returnRequesting,
  hasReturnRequest,
}) => {
  const isDelivered = order?.orderStatus?.toUpperCase() === "DELIVERED"

  if (!isDelivered || hasReturnRequest) return null

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <button
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors flex items-center"
        onClick={() => setIsReturnModalOpen(true)}
        disabled={returnRequesting}
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Request Return
      </button>
      <ReturnRequestModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        onSubmit={(returnData) => onReturnRequest(order._id, returnData, item._id)}
        loading={returnRequesting}
      />
    </div>
  )
}

export default OrderDetailPage

