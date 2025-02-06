import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../UI/dialog";
import { Button } from "../UI/button";

const OrderCancellationDialog = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 max-w-md bg-gray-800 text-white rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Cancel Order</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-300">
          Are you sure you want to cancel this order? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="secondary" onClick={onClose} className="bg-gray-600 hover:bg-gray-700">
            No, Keep Order
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Yes, Cancel Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderCancellationDialog;
