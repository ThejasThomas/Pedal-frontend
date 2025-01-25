import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/UI/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/UI/table";
import { Badge } from "../../../components/UI/badge";

const OrderDetailsModal = ({ isOpen, onClose, orderDetails }) => {
  if (!orderDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details #{orderDetails._id}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Order Status</p>
              <Badge variant={orderDetails.orderStatus === 'Delivered' ? 'success' : 'secondary'}>
                {orderDetails.orderStatus}
              </Badge>
            </div>
            <div>
              <p className="text-gray-500">Payment Method</p>
              <p className="font-medium">{orderDetails.paymentMethod}</p>
            </div>
            <div>
              <p className="text-gray-500">Order Date</p>
              <p className="font-medium">
                {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Total Amount</p>
              <p className="font-medium">${orderDetails.totalAmount?.toFixed(2)}</p>
            </div>
          </div>

          {/* Products Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderDetails.products.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.productImage && (
                          <img
                            src={item.productImage[0]}
                            alt={item.productName}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">{item.productName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.productDescription}
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.price?.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;