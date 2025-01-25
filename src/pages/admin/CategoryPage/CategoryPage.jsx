import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, MoreVertical, List, Package2, XCircle, Calendar, Filter } from 'lucide-react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../api/axiosInstance";
import AddCategory from "../../../components/admin/AddCategory/AddCategory";
import EditCategory from "../../../components/admin/AddCategory/EditCategory";
import axios from "axios";

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
      const response = await axios.get("http://localhost:3000/admin/fetchCategoryUser");
      if (response.data?.categories && Array.isArray(response.data.categories)) {
        const visibleCategories = response.data.categories.filter(cat => !cat.isHidden);
        setAllCategories(response.data.categories);
        setCategories(response.data.categories);
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
      console.log('Current status:', currentStatus);
      console.log('New status to be sent:', newStatus);
      
      const response = await axiosInstance.patch(
        `/admin/toggleCategory/${categoryId}`,
        { isActive: newStatus }
      );

      console.log('Response from server:', response.data);

      if (response.data.success) {
        if (!newStatus) {
          setCategories(prev => prev.filter(cat => cat._id !== categoryId));
          setAllCategories(prev => prev.filter(cat => cat._id !== categoryId));
        } else {
          // If listing, update the category in both arrays
          const updatedCategory = response.data.category;
          setCategories(prev => prev.map(cat => 
            cat._id === categoryId ? updatedCategory : cat
          ));
          setAllCategories(prev => prev.map(cat => 
            cat._id === categoryId ? updatedCategory : cat
          ));
        }
        
        toast.success(newStatus ? 'Category activated successfully' : 'Category deactivated successfully');
      } else {
        toast.error('Failed to update category status');
      }
    } catch (error) {
      console.error('Error toggling category:', error);
      toast.error(error.response?.data?.message || 'Error updating category status');
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

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Categories</h1>
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <span>Dashboard</span>
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
            {['All Categories', 'Active', 'Inactive'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-lg text-sm transition flex items-center ${
                  activeFilter === filter ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/5 hover:bg-white/10'
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
                    <tr key={category._id} className={`border-b border-gray-700 hover:bg-white/5 transition ${
                      !category.isActive ? 'opacity-70' : ''
                    }`}>
                      <td className="py-4 px-6">
                        <img
                          src={category.images[0]}
                          alt={category.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      </td>
                      <td className="py-4 px-6 font-medium">{category.name}</td>
                      <td className="py-4 px-6 text-gray-300">{category.description}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          category.isActive 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {category.isActive ? 'Active' : 'Inactive'}
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
                          {openActionMenuId === category._id && (
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
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

