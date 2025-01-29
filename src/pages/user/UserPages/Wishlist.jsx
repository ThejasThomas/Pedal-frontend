import React, { useState, useEffect } from "react";
import { fetchWishlistApi, removeFromWishListApi } from "../../../api/whishlistApi";
import { Card, CardContent } from "../../../components/UI/card";
import { Button } from "../../../components/UI/button";
import { Trash2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/UI/dialog"

const WishlistPage = () => {
  const [wishlistData, setWishlistData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [removingProduct, setRemovingProduct] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState({ open: false, productId: null })
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.users)

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const user_id = user._id
      const response = await fetchWishlistApi(user_id)

      if (response.data.success) {
        setWishlistData(response.data.data)
      } else {
        setError(response.data.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch wishlist")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [user]) // Added user to dependencies

  const handleRemoveFromWishlist = async (productId) => {
    setConfirmDialog({ open: true, productId })
  }

  const confirmRemoveFromWishlist = async () => {
    const productId = confirmDialog.productId
    setConfirmDialog({ open: false, productId: null })

    try {
      setRemovingProduct(productId)
      const response = await removeFromWishListApi(productId, user._id)

      if (response.data.success) {
        setWishlistData((prevData) => ({
          ...prevData,
          products: prevData.products.filter((product) => product.productId !== productId),
          totalItems: prevData.totalItems - 1,
        }))
        toast.success("Product removed from wishlist")
      } else {
        toast.error(response.data.message || "Failed to remove product")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove product")
    } finally {
      setRemovingProduct(null)
    }
  }

  const handleAddToCart = async (productId) => {
    console.log("Add to cart:", productId)
    // Implement add to cart functionality here
    toast.success("Product added to cart")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="mb-4 text-xl">{error}</p>
          <Button onClick={() => fetchWishlist()} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!wishlistData?.products?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <div className="text-2xl text-gray-600">Your wishlist is empty</div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg"
          onClick={() => navigate("/user/store")}
        >
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
        <span className="text-lg text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
          {wishlistData.totalItems} {wishlistData.totalItems === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlistData.products.map((product) => (
          <Card key={product.productId} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="aspect-square overflow-hidden">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2 line-clamp-1 hover:line-clamp-none">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 hover:line-clamp-none">{product.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  {product.discountValue ? (
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-blue-600">${product.currentPrice.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 line-through">${product.basePrice.toFixed(2)}</span>
                      <span className="text-green-600 text-sm font-semibold">Save {product.discountValue}%</span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">${product.basePrice.toFixed(2)}</span>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500 hover:bg-red-50 border-red-200"
                    onClick={() => handleRemoveFromWishlist(product.productId)}
                    disabled={removingProduct === product.productId}
                  >
                    {removingProduct === product.productId ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleAddToCart(product.productId)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="text-sm">
                {product.quantity <= 5 ? (
                  <span className="text-orange-500 font-semibold">
                    Only {product.quantity} left in stock - order soon
                  </span>
                ) : (
                  <span className="text-green-600 font-semibold">In Stock</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from Wishlist</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this item from your wishlist? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, productId: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRemoveFromWishlist}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default WishlistPage;
