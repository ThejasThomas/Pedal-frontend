import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/UI/card";
import { Button } from "../../../components/UI/button";
import {
  Loader2,
  CheckCircle2,
  Package,
  Truck,
  Home,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { axiosInstance } from "../../../api/axiosInstance";
import toast from "react-hot-toast";
import ReturnRequestModal from "../../../utils/ReturnReqMOdal";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancellingOrders, setCancellingOrders] = useState(new Set());
  const [returnRequesting, setReturnRequesting] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/user/getorderedproduct/${orderId}`
        );
        if (response.data.success) {
          setOrder(response.data.order);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch order details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrders((prev) => new Set([...prev, orderId]));
      const response = await axiosInstance.post(`/user/cancelOrder/${orderId}`);

      if (response.data.success) {
        toast.success("Order cancelled successfully");
        setOrder((prev) => ({ ...prev, orderStatus: "CANCELLED" }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancellingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const handleReturnRequest = async (orderId, returnData, itemId) => {
    try {
      setReturnRequesting(true);
      const response = await axiosInstance.post(`/user/requestReturn`, {
        reason: returnData.reason,
        explanation: returnData.explanation,
        orderId,
        itemId,
      });

      if (response.data.success) {
        toast.success("Return request sent to admin for approval");
        setOrder((prev) => ({
          ...prev,
          returnStatus: "PENDING_ADMIN_APPROVAL",
        }));
        setIsReturnModalOpen(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit return request"
      );
    } finally {
      setReturnRequesting(false);
    }
  };

  const canCancel =
    order && !["DELIVERED", "CANCELLED"].includes(order.orderStatus?.toUpperCase());

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Order #{order._id.slice(-6)}</span>
            {canCancel && (
              <Button
                variant="destructive"
                disabled={cancellingOrders.has(order._id)}
                onClick={() => handleCancelOrder(order._id)}
              >
                {cancellingOrders.has(order._id) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Order"
                )}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 mt-8">
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
        </CardContent>
      </Card>
    </div>
  );
};

const ProductItem = ({ item, order, onReturnRequest, returnRequesting }) => {
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

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
      </div>
      <div className="text-right">
        <div className="font-medium">
          ${((item.quantity || 0) * (item.price || 0)).toFixed(2)}
        </div>
      </div>
      <ReturnRequestButton
        order={order}
        item={item}
        isReturnModalOpen={isReturnModalOpen}
        setIsReturnModalOpen={setIsReturnModalOpen}
        onReturnRequest={onReturnRequest}
        returnRequesting={returnRequesting}
      />
    </div>
  );
};

const ReturnRequestButton = ({
  order,
  item,
  isReturnModalOpen,
  setIsReturnModalOpen,
  onReturnRequest,
  returnRequesting,
}) => {
  const isDelivered = order?.orderStatus?.toUpperCase() === "DELIVERED";
  const hasNoActiveReturn = !order?.returnStatus || order.returnStatus === "REJECTED";

  if (!isDelivered || !hasNoActiveReturn) return null;

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Button
        variant="secondary"
        onClick={() => setIsReturnModalOpen(true)}
        disabled={returnRequesting}
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Request Return
      </Button>
      <ReturnRequestModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        onSubmit={(returnData) => onReturnRequest(order._id, returnData, item._id)}
        loading={returnRequesting}
      />
    </div>
  );
};

export default OrderDetailPage;
