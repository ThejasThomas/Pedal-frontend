import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/UI/dialog";
import { Button } from "../components/UI/button";
import Textarea from "../components/UI/textArea";
import { Label } from "../components/UI/label";
import { Loader2 } from "lucide-react";

const ReturnRequestModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [explanation, setExplanation] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit({ explanation, reason });
      setExplanation("");
      setReason("");
      onClose();
    }
  };

  const handleClose = () => {
    setExplanation("");
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white z-50 shadow-lg">
        <DialogHeader>
          <DialogTitle>Request Return</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Return Reason</Label>
            <select
              id="reason"
              className="w-full p-2 border rounded-md"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">Select a reason</option>
              <option value="damaged">Product Damaged</option>
              <option value="wrong_item">Wrong Item Received</option>
              <option value="not_as_described">Not as Described</option>
              <option value="defective">Product Defective</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation">Detailed Explanation</Label>
            <Textarea
              id="explanation"
              placeholder="Please provide details about your return request..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="min-h-[100px] w-full p-2 border rounded-md"
              required
            />
          </div>
          <DialogFooter className="flex justify-end space-x-2 border-t pt-4 bg-black">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black text-white border border-gray-800 hover:bg-gray-900"
              disabled={loading || !reason || !explanation}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnRequestModal;