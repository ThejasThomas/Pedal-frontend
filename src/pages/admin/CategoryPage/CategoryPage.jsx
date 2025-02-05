import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Edit,
  MoreVertical,
  List,
  Package2,
  XCircle,
  Calendar,
  Filter,
  Tag,
  Percent,
} from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../api/axiosInstance";
import AddCategory from "../../../components/admin/AddCategory/AddCategory";
import EditCategory from "../../../components/admin/AddCategory/EditCategory";
import { toast } from "sonner";
import axios from "axios";

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">{children}</div>
  </div>
);

function AddOfferModal({ category, onClose, onOfferAdded }) {
  const [formData, setFormData] = useState({
    offerName: "",
    offerValue: "",
    offerExpairyDate: "",
    target_type: "percentage",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/admin/addCategoryOffer", {
        id: category._id,
        CategoryName: category.name,
        offerName: formData.offerName,
        offerValue: formData.offerValue,
        offerExpairyDate: formData.offerExpairyDate,
        target_type: formData.target_type,
      });

      if (response.data.success) {
        toast.success("Offer added successfully");
        onOfferAdded(response.data.offer);
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding offer");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Add Offer to {category.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full"
          >
            <XCircle size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Offer Name
              </label>
              <input
                type="text"
                value={formData.offerName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    offerName: e.target.value,
                  }))
                }
                className="w-full bg-gray-700 rounded-lg px-4 py-2"
                placeholder="e.g., Summer Sale"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Offer Type
              </label>
              <select
                value={formData.target_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    target_type: e.target.value,
                  }))
                }
                className="w-full bg-gray-700 rounded-lg px-4 py-2"
                required
              >
                <option value="percentage">Percentage</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {formData.target_type === "percentage"
                  ? "Discount Percentage"
                  : "Discount Amount"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max={
                    formData.target_type === "percentage" ? "100" : undefined
                  }
                  value={formData.offerValue}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      offerValue: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 pr-8"
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {formData.target_type === "percentage" ? "%" : "$"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Expiry Date
              </label>
              <input
                type="datetime-local"
                value={formData.offerExpairyDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    offerExpairyDate: e.target.value,
                  }))
                }
                className="w-full bg-gray-700 rounded-lg px-4 py-2"
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Add Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const FormField = ({
  label,
  type,
  value,
  onChange,
  options,
  required,
  min,
  max,
  placeholder,
  suffix,
}) => {
  const baseClassName = "w-full bg-gray-700 rounded-lg px-4 py-2";

  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseClassName}
            required={required}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <div className="relative">
            <input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`${baseClassName} ${suffix ? "pr-8" : ""}`}
              min={min}
              max={max}
              required={required}
              placeholder={placeholder}
            />
            {suffix && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {suffix}
              </span>
            )}
          </div>
        );
    }
  };
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      {renderInput()}
    </div>
  );
};

function ViewOffersModal({ category, onClose }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category?._id) {
      fetchOffers();
    }
  }, [category]);

  console.log("working good");

  console.log(category);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/getAllCategoryOffers");
      if (response.data.success) {
        const categoryOffers = response.data.offers.filter(
          (offer) =>
            offer.targetId === category._id || offer.id === category._id
        );
        setOffers(categoryOffers);
      }
    } catch (error) {
      toast.error("Failed to fetch offers");
    } finally {
      setLoading(false);
    }
  }, [category._id]);

  useEffect(() => {
    if (category?._id) {
      fetchOffers();
    }
  }, [category._id, fetchOffers]);

  const handleDeleteOffer = async (offerId) => {
    try {
      const response = await axiosInstance.delete(
        `/admin/deleteCategoryOffer/${offerId}`
      );
      if (response.data.success) {
        toast.success("Offer deleted successfully");
        setOffers(offers.filter((offer) => offer._id !== offerId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting offer");
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Offers for {category.name}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-700 rounded-full"
        >
          <XCircle size={20} />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading offers...</div>
      ) : offers.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No active offers for this category
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="bg-gray-700/50 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium">{offer.name}</h3>
                <div className="text-sm text-gray-400 mt-1">
                  <div className="flex items-center gap-2">
                    <Percent size={16} />
                    {offer.offerValue}% off
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={16} />
                    Ends: {new Date(offer.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteOffer(offer._id)}
                className="p-2 hover:bg-red-500/20 rounded-full text-red-400"
              >
                <XCircle size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

function EmptyState({ onAddCategory }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 max-w-md mx-auto shadow-xl">
        <Package2 className="h-16 w-16 mx-auto mb-6 text-blue-400" />
        <h3 className="text-xl font-semibold text-white mb-3">
          No Categories Yet
        </h3>
        <p className="text-gray-300 mb-8">
          Get started by creating your first category
        </p>
        <button
          onClick={onAddCategory}
          className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto text-white font-medium"
        >
          <Plus className="h-5 w-5" />
          Create Category
        </button>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const [allCategories, setAllCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Categories");
  const [selectedDate, setSelectedDate] = useState(null);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [isViewingOffers, setIsViewingOffers] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filteredCategories = filterCategories(
      allCategories,
      searchQuery,
      activeFilter,
      selectedDate
    );
    setCategories(filteredCategories);
  }, [allCategories, searchQuery, activeFilter, selectedDate]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/admin/fetchCategoryUser"
      );
      if (
        response.data?.categories &&
        Array.isArray(response.data.categories)
      ) {
        const visibleCategories = response.data.categories.filter(
          (cat) => !cat.isHidden
        );
        setAllCategories(response.data.categories);
        setCategories(response.data.categories);
        console.log(response);
      } else {
        toast.error("Invalid data format received");
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error("Error fetching categories:", error);
    }
  };

  const filterCategories = (categoryList, searchTerm, filter, date) => {
    return categoryList.filter((category) => {
      const matchesSearch =
        !searchTerm ||
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate =
        !date ||
        new Date(category.createdAt).toDateString() ===
          new Date(date).toDateString();
      return matchesSearch && matchesDate;
    });
  };

  const handleCategoryAdded = (newCategory) => {
    if (newCategory) {
      setAllCategories((prev) => [...prev, newCategory]);
      toast.success("Category added successfully");
    }
    setIsAddingCategory(false);
  };

  const handleToggleListing = async (categoryId, currentStatus) => {
    try {
      console.log(currentStatus);
      const currentStatusBoolean = Boolean(currentStatus);
      const newStatus = !currentStatusBoolean;
      console.log("Current status:", currentStatus);
      console.log("New status to be sent:", newStatus);

      const response = await axiosInstance.patch(
        `/admin/toggleCategory/${categoryId}`,
        { isActive: newStatus }
      );

      console.log("Response from server:", response.data);

      if (response.data.success) {
        if (!newStatus) {
          setCategories((prev) =>
            prev.map((cat) =>
              cat._id === categoryId ? { ...cat, isActive: newStatus } : cat
            )
          );
          setAllCategories((prev) =>
            prev.map((cat) =>
              cat._id === categoryId ? { ...cat, isActive: newStatus } : cat
            )
          );
        } else {
          const updatedCategory = response.data.category;
          setCategories((prev) =>
            prev.map((cat) => (cat._id === categoryId ? updatedCategory : cat))
          );
          setAllCategories((prev) =>
            prev.map((cat) => (cat._id === categoryId ? updatedCategory : cat))
          );
        }

        toast.success(
          newStatus
            ? "Category activated successfully"
            : "Category deactivated successfully"
        );
      } else {
        toast.error("Failed to update category status");
      }
    } catch (error) {
      console.error("Error toggling category:", error);
      toast.error(
        error.response?.data?.message || "Error updating category status"
      );
      fetchCategories();
    } finally {
      setOpenActionMenuId(null);
    }
  };

  const handleCategoryUpdated = (updatedCategory) => {
    if (updatedCategory) {
      setAllCategories((prev) =>
        prev.map((cat) =>
          cat._id === updatedCategory._id ? updatedCategory : cat
        )
      );
      toast.success("Category updated successfully");
    }
    setIsEditingCategory(false);
    setSelectedCategory(null);
  };

  const toggleActionMenu = (categoryId) => {
    setOpenActionMenuId(openActionMenuId === categoryId ? null : categoryId);
  };
  const renderActionMenu = (category) => {
    const hasActiveOffer = category.offers && category.offers.length > 0;

    return (
      <div className="absolute top-0 right-full mr-2 bg-gray-800 text-white shadow-lg rounded-lg z-10 overflow-hidden">
        <button
          onClick={() => {
            setSelectedCategory(category);
            setIsEditingCategory(true);
          }}
          className="flex items-center w-full text-left px-4 py-3 hover:bg-white/10 transition"
        >
          <Edit size={16} className="mr-2" /> Edit
        </button>
        <button
          onClick={() => {
            setSelectedCategory(category);
            setIsViewingOffers(true);
            setOpenActionMenuId(null);
          }}
          className="flex items-center w-full text-left px-4 py-3 hover:bg-white/10 transition"
        >
          <Edit size={16} className="mr-2" /> View Offer
        </button>
        {!hasActiveOffer && (
          <button
            onClick={() => {
              setSelectedCategory(category);
              setIsAddingOffer(true);
              setOpenActionMenuId(null);
            }}
            className="flex items-center w-full text-left px-4 py-3 hover:bg-white/10 transition"
          >
            <Tag size={16} className="mr-2" /> Add Offer
          </button>
        )}
        <button
          onClick={() => handleToggleListing(category._id, category.isActive)}
          className="flex items-center w-full text-left px-4 py-3 hover:bg-white/10 transition"
        >
          {category.isActive ? (
            <>
              <XCircle size={16} className="mr-2" />
              <span>Deactivate</span>
            </>
          ) : (
            <>
              <List size={16} className="mr-2" />
              <span>Activate</span>
            </>
          )}
        </button>
      </div>
    );
  };

  const renderContent = () => {
    if (isAddingCategory) {
      return (
        <AddCategory
          onCancel={() => setIsAddingCategory(false)}
          onCategoryAdded={handleCategoryAdded}
        />
      );
    }

    if (isEditingCategory && selectedCategory) {
      return (
        <EditCategory
          category={selectedCategory}
          onCancel={() => {
            setIsEditingCategory(false);
            setSelectedCategory(null);
          }}
          onCategoryUpdated={handleCategoryUpdated}
        />
      );
    }

    if (isAddingOffer && selectedCategory) {
      return (
        <AddOfferModal
          category={selectedCategory}
          onClose={() => {
            setIsAddingOffer(false);
            setSelectedCategory(null);
          }}
          onOfferAdded={() => {
            fetchCategories();
            setIsAddingOffer(false);
            setSelectedCategory(null);
          }}
        />
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Categories</h1>
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <a href="/admin/dashboard">
                  <span>Dashboard</span>
                </a>{" "}
                <span>•</span>
                <span>Category List</span>
              </div>
            </div>
            <button
              onClick={() => setIsAddingCategory(true)}
              className="px-6 py-3 text-sm bg-blue-600 hover:bg-blue-700 transition rounded-lg flex items-center gap-2"
            >
              <Plus size={18} />
              Add Category
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex-grow flex items-center border rounded-lg px-4 py-3 bg-white/5 hover:bg-white/10 transition">
              <Search size={18} className="mr-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm text-white placeholder-gray-400 w-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {["All Categories"].map((filter) => (
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

          {categories.length === 0 ? (
            <EmptyState onAddCategory={() => setIsAddingCategory(true)} />
          ) : (
            <div className="overflow-x-auto bg-white/5 rounded-lg shadow-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="py-4 px-6 font-semibold">Image</th>
                    <th className="py-4 px-6 font-semibold">Name</th>
                    <th className="py-4 px-6 font-semibold">Description</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold w-32">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category._id}
                      className={`border-b border-gray-700 hover:bg-white/5 transition ${
                        !category.isActive ? "opacity-70" : ""
                      }`}
                    >
                      <td className="py-4 px-6">
                        <img
                          src={category.images[0] || "/placeholder.svg"}
                          alt={category.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      </td>
                      <td className="py-4 px-6 font-medium">{category.name}</td>
                      <td className="py-4 px-6 text-gray-300">
                        {category.description}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            category.isActive
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="relative">
                          <button
                            onClick={() => toggleActionMenu(category._id)}
                            className="p-2 rounded-full hover:bg-white/10 transition"
                          >
                            <MoreVertical size={18} />
                          </button>
                          {openActionMenuId === category._id &&
                            renderActionMenu(category)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {isAddingOffer && selectedCategory && (
            <AddOfferModal
              category={selectedCategory}
              onClose={() => {
                setIsAddingOffer(false);
                setSelectedCategory(null);
              }}
              onOfferAdded={() => {
                fetchCategories();
                setIsAddingOffer(false);
                setSelectedCategory(null);
              }}
            />
          )}
          {isViewingOffers && selectedCategory && (
            <ViewOffersModal
              category={selectedCategory}
              onClose={() => {
                setIsViewingOffers(false);
                setSelectedCategory(null);
              }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderContent()}
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}
