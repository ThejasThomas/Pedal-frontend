import React from "react";
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  MoreVertical,
  Filter,
  Calendar,
  Tag,
  Eye,
  Percent,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../api/axiosInstance";
import AddProduct from "../../../components/admin/Products/AddProducts";
import EditProduct from "../../../components/admin/Products/EditProducts";
import { addProductOfferApi } from "../../../api/addProductOfferApi";
import Pagination from "../../../utils/pagination";

const OfferBadge = ({ offerValue, expiryDate }) => {
  const isExpired = new Date(expiryDate) <= new Date();

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
        isExpired
          ? "bg-red-500/20 text-red-500"
          : "bg-green-500/20 text-green-500"
      }`}
    >
      <Percent size={12} />
      <span>{offerValue}% off</span>
    </div>
  );
};

const ViewOffersModal = ({ product, onClose, onUpdate }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffers = async () => {
    try {
      const response = await axiosInstance.get(`/admin/getproductoffers`);
      if (response.data.success) {
        const productOffers = response.data.offers.filter(
          (offer) => offer.targetId === product._id || offer.id === product._id
        );
        setOffers(productOffers);
      }
    } catch (err) {
      setError("An error occurred while fetching offers");
    } finally {
      setLoading(false);
    }
  };
  const handleRemoveOffer = async (offerId) => {
    try {
      const response = await axiosInstance.delete(
        `/admin/deleteProductOffers/${offerId}`
      );
      if (response.data.success) {
        toast.success("Offer removed successfully");
        fetchOffers();
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove offer");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOffers();
  }, [product._id]);

  if (loading) {
    return <div>Loading offers...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Offers for {product.name}</h2>
        {offers.length > 0 ? (
          <div className="space-y-4">
            {offers.map((offer, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{offer.name}</h3>
                    <p className="text-sm text-gray-300">
                      {offer.offerValue}% off
                    </p>
                    <p className="text-sm text-gray-400">
                      Expires: {new Date(offer.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveOffer(offer._id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-lg text-sm transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No offers available for this product.</p>
        )}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const AddOfferModal = ({ product, onClose, onSave }) => {
  const [offerData, setOfferData] = useState({
    offerName: "",
    offerValue: "",
    offerExpairyDate: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addProductOfferApi(
        product._id,
        product.name,
        offerData.offerName,
        Number(offerData.offerValue),
        offerData.offerExpairyDate,
        "product"
      );

      if (response.data.success) {
        toast.success("Offer added successfully");
        onSave();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add offer");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Offer for {product.name}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Offer Name
              </label>
              <input
                type="text"
                value={offerData.offerName}
                onChange={(e) =>
                  setOfferData({ ...offerData, offerName: e.target.value })
                }
                className="w-full bg-gray-700 rounded-lg px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Offer Value (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={offerData.offerValue}
                onChange={(e) =>
                  setOfferData({ ...offerData, offerValue: e.target.value })
                }
                className="w-full bg-gray-700 rounded-lg px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Expiry Date
              </label>
              <input
                type="datetime-local"
                value={offerData.offerExpairyDate}
                onChange={(e) =>
                  setOfferData({
                    ...offerData,
                    offerExpairyDate: e.target.value,
                  })
                }
                className="w-full bg-gray-700 rounded-lg px-4 py-2"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Add Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export function ProductPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Products");
  const [selectedDate, setSelectedDate] = useState(null);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addTab, setAddTab] = useState(false);
  const [editTab, setEditTab] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedProductForOffer, setSelectedProductForOffer] = useState(null);
  const [selectedProductForViewing, setSelectedProductForViewing] =
    useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const filteredProducts = filterProducts(
      allProducts,
      searchQuery,
      activeFilter,
      selectedDate
    );
    setProducts(filteredProducts);
  }, [allProducts, searchQuery, activeFilter, selectedDate]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/admin/product", {
        params: { page: currentPage, limit: 10 },
        withCredentials: true,
      });
      if (response.data?.products && Array.isArray(response.data.products)) {
        setAllProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      } else {
        toast.error("Invalid data format received");
      }
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error("Fetch Products Error:", error);
    }
  };
  const handleChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filterProducts = (productList, searchTerm, filter, date) => {
    return productList.filter((product) => {
      const matchesSearch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === "All Products" ||
        (filter === "Published" && product.status === "Published") ||
        (filter === "Unpublished" && product.status === "Unpublished");
      const matchesDate =
        !date ||
        new Date(product.createdAt).toDateString() ===
          new Date(date).toDateString();
      return matchesSearch && matchesFilter && matchesDate;
    });
  };

  const handleViewOffers = (product) => {
    setSelectedProductForViewing(product);
    setShowOfferModal(true);
    setOpenActionMenuId(null);
  };

  const handleAddProduct = (newProduct) => {
    setAllProducts((prev) => [...prev, newProduct]);
    setAddTab(false);
    // console.log("gkfmnb gfb");

    toast.success("Product added successfully");
  };

  const handleEditProduct = (product) => {
    if (product) {
      setAllProducts((prev) =>
        prev.map((p) => (p._id === product._id ? product : p))
      );
      toast.success("Product updated successfully");
    }
    setEditTab(false);
  };

  const handleAddOffer = (product) => {
    setSelectedProductForOffer(product);
    setShowOfferModal(true);
    setOpenActionMenuId(null);
  };

  const handleOfferSave = () => {
    fetchProducts();
    setShowOfferModal(false);
    setSelectedProductForOffer(null);
  };

  const handleListingToggle = async (productId, currentStatus) => {
    try {
      const newStatus =
        currentStatus === "Published" ? "Unpublished" : "Published";
      const response = await axiosInstance.patch(
        `/admin/toggle-listing/${productId}`,
        {
          status: newStatus,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setAllProducts((prev) =>
          prev.map((product) =>
            product._id === productId
              ? { ...product, status: newStatus }
              : product
          )
        );
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update product status");
      console.error("Toggle listing status error:", error);
    }
    setOpenActionMenuId(null);
  };

  const getStatusColor = (status) => {
    return status === "Published"
      ? "bg-green-500/20 text-green-500"
      : "bg-yellow-500/20 text-yellow-500";
  };

  const toggleActionMenu = (productId) => {
    setOpenActionMenuId(openActionMenuId === productId ? null : productId);
  };

  const renderContent = () => {
    if (addTab) {
      return (
        <AddProduct
          onSave={handleAddProduct}
          onCancel={() => setAddTab(false)}
        />
      );
    }

    if (editTab && selectedProduct) {
      return (
        <EditProduct
          product={selectedProduct}
          onSave={handleEditProduct}
          onCancel={() => setEditTab(false)}
        />
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Products</h1>
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <a href="/admin/dashboard">
                  <span>Dashboard</span>
                </a>
                <span>•</span>
                <span>Product List</span>
              </div>
            </div>
            <button
              onClick={() => setAddTab(true)}
              className="px-6 py-3 text-sm bg-blue-600 hover:bg-blue-700 transition rounded-lg flex items-center"
            >
              <Plus size={18} className="mr-2" /> Add Product
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex-grow flex items-center border rounded-lg px-4 py-3 bg-white/5 hover:bg-white/10 transition">
              <Search size={18} className="mr-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm text-white placeholder-gray-400 w-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {["All Products", "Published", "Unpublished"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-lg text-sm transition flex items-center ${
                  activeFilter === filter
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <Filter size={16} className="mr-2" />
                {filter}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto bg-white/5 rounded-lg shadow-xl">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="py-4 px-6 font-semibold">Product</th>
                  <th className="py-4 px-6 font-semibold">Category</th>
                  <th className="py-4 px-6 font-semibold">Stock</th>
                  <th className="py-4 px-6 font-semibold">Price</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-gray-700 hover:bg-white/5 transition"
                  >
                    <td className="py-4 px-6">{product.name}</td>
                    <td className="py-4 px-6">{product.category}</td>
                    <td className="py-4 px-6">{product.quantity}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          ${product.basePrice}
                        </span>
                        {product.offer && (
                          <span className="text-sm text-gray-400 line-through">
                            $
                            {(
                              product.basePrice *
                              (1 + product.offer.offerValue / 100)
                            ).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          product.status
                        )}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="relative">
                        <button
                          onClick={() => toggleActionMenu(product._id)}
                          className="p-2 rounded-full hover:bg-white/10 transition"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {openActionMenuId === product._id && (
                          <div className="absolute top-full right-0 mt-2 bg-gray-800 text-white shadow-lg rounded-lg z-10 overflow-hidden">
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setEditTab(true);
                                navigate(`/admin/editproducts/${product._id}`);
                              }}
                              className="flex items-center w-full text-left px-4 py-3 hover:bg-white/10 transition"
                            >
                              <Edit size={16} className="mr-2" /> Edit
                            </button>
                            <button
                              onClick={() => handleAddOffer(product)}
                              className="flex items-center w-full text-left px-4 py-3 hover:bg-white/10 transition"
                            >
                              <Tag size={16} className="mr-2" /> Add Offer
                            </button>
                            <button
                              onClick={() => handleViewOffers(product)}
                              className="flex items-center w-full text-left px-4 py-3 hover:bg-white/10 transition"
                            >
                              <Eye size={16} className="mr-2" /> View Offers
                            </button>
                            <button
                              onClick={() =>
                                handleListingToggle(product._id, product.status)
                              }
                              className="flex items-center w-full text-left px-4 py-3 hover:bg-white/10 transition"
                            >
                              {product.status === "Published"
                                ? "Unpublish"
                                : "Publish"}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {renderContent()}
      {showOfferModal && selectedProductForOffer && (
        <AddOfferModal
          product={selectedProductForOffer}
          onClose={() => {
            setShowOfferModal(false);
            setSelectedProductForOffer(null);
          }}
          onSave={handleOfferSave}
        />
      )}
      {showOfferModal && selectedProductForViewing && (
        <ViewOffersModal
          product={selectedProductForViewing}
          onClose={() => {
            setShowOfferModal(false);
            setSelectedProductForViewing(null);
          }}
          onUpdate={() => fetchProducts()}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}

export default ProductPage;
