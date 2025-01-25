import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RefreshCw,
  Package,
  Search,
  Menu,
  X,
  User,
} from "lucide-react";
import { axiosInstance } from "../../../api/axiosInstance";
import { useSelector } from "react-redux";

export default function EnhancedProductDetail() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [addingToCart, setAddingToCart] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector((state) => state.user.users);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();
  const isOutOfStock = product?.quantity === 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productResponse, relatedResponse] = await Promise.all([
          axiosInstance.get(`/admin/productDetails/${id}`),
          axiosInstance.get("/admin/product"),
        ]);

        if (productResponse.data.success) {
          setProduct(productResponse.data.product);
          const filtered = relatedResponse.data.products
            .filter((p) => p._id !== id)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const calculateCurrentPrice = (basePrice, discount) => {
    const discountAmount = (basePrice * discount) / 100;
    return basePrice - discountAmount;
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      if (isOutOfStock) {
        alert("Sorry, this product is out of stock");
        return;
      }

      setAddingToCart(true);
      if (!isAuthenticated || !user) {
        alert("Please log in to add items to cart");
        return;
      }
      const cartData = {
        userId: user._id,
        productId: id,
        quantity: quantity,
        price: product.basePrice,
      };
      const response = await axiosInstance.post("/user/addToCart", cartData);
      if (response.data.success) {
        alert("Product added to cart successfully!");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert("Error adding product to cart");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl font-semibold text-gray-800">
          Product not found
        </div>
      </div>
    );
  }

  const thumbnailImages = product.images.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="flex-shrink-0"></a>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="/user/store"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </a>
                  <a
                    href="/user/store"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Shop
                  </a>
                  <a
                    href="/about"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    About
                  </a>
                  <a
                    href="user/contactpage"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <ShoppingCart
                  onClick={() => {
                    navigate("/user/cart");
                  }}
                  className="h-6 w-6 cursor-pointer" // Add 'cursor-pointer' for pointer behavior
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="/"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Home
              </a>
              <a
                href="/user/store"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Shop
              </a>
              <a
                href="/about"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                About
              </a>
              <a
                href="user/contactpage"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <div className="flex items-center">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
                <a
                  href="/user/store"
                  className="ml-1 text-gray-700 hover:text-blue-600 md:ml-2"
                >
                  Shop
                </a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="ml-1 text-gray-500 md:ml-2">
                  {product.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <div className="lg:flex lg:items-start lg:space-x-8">
          <div className="lg:w-1/2">
            <div
              className="relative aspect-w-1 aspect-h-1 mb-4 overflow-hidden rounded-lg"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-200 ${
                  isZoomed ? "scale-150" : "scale-100"
                }`}
                style={{
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                }}
              />
              {isZoomed && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
                  Zoom active
                </div>
              )}
              <button
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev > 0 ? prev - 1 : product.images.length - 1
                  )
                }
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev < product.images.length - 1 ? prev + 1 : 0
                  )
                }
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              {thumbnailImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index
                      ? "border-blue-500 shadow-md"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl text-gray-500 line-through">
                ₹{product.basePrice.toFixed(2)}
              </span>
              <span className="text-4xl font-bold text-blue-600">
                ₹
                {calculateCurrentPrice(
                  product.basePrice,
                  product.discount
                ).toFixed(2)}
              </span>
              <span className="text-lg font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                {product.discount}% off
              </span>
            </div>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Quantity</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <Package className="w-5 h-5 mr-2" />
                {isOutOfStock ? (
                  <span className="text-red-600 font-semibold">
                    Out of Stock
                  </span>
                ) : (
                  <span>{product.quantity} items left in stock</span>
                )}
              </div>
              {!isOutOfStock && (
                <div className="flex items-center border rounded-md w-32">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
            <div className="flex space-x-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <button className="flex-1 border border-gray-300 text-gray-600 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center">
                <Heart className="w-5 h-5 mr-2" />
                Add to Wishlist
              </button>
            </div>
            <div className="border-t pt-6">
              <div className="flex items-center mb-4">
                <Truck className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-gray-600">
                  Free shipping on orders over ₹500
                </span>
              </div>
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-gray-600">
                  2-year warranty on all products
                </span>
              </div>
              <div className="flex items-center">
                <RefreshCw className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-gray-600">
                  30-day money-back guarantee
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("details")}
                className={`${
                  activeTab === "details"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`${
                  activeTab === "reviews"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Reviews
              </button>
            </nav>
          </div>
          <div className="mt-8">
            {activeTab === "details" && (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {product.name} Features:
                </h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-blue-500 text-white rounded-full flex-shrink-0">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                    </span>
                    High-quality materials
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-blue-500 text-white rounded-full flex-shrink-0">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                    </span>
                    Durable construction
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-blue-500 text-white rounded-full flex-shrink-0">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                    </span>
                    Comfortable fit
                  </li>
                </ul>
              </div>
            )}
            {activeTab === "reviews" && (
              <div>
                <p className="text-gray-600">No reviews yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <a href={`/user/product/${relatedProduct._id}`}>
                  <div className="h-48 overflow-hidden">
                    <img
                      src={relatedProduct.images[0] || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">(25)</span>
                    </div>
                    <p className="text-xl font-bold text-blue-600">
                      ₹{relatedProduct.basePrice.toFixed(2)}
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    Shipping & Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    Store Tracking
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">About Us</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    Getting Started
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    Resources
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Newsletter</h3>
              <p className="mb-4">
                Subscribe to our newsletter for the latest updates and offers.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-400">
              ©2024 PedalQuest. All rights reserved. Terms of Use. Privacy
              Policy.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
