import React, { useState, useEffect } from "react";
import {
  SearchIcon,
  UserCircleIcon,
  SaveIcon,
  XIcon,
  PlusIcon,
  TrashIcon
} from "@heroicons/react/solid";
import axios from "axios";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../api/axiosInstance";

export default function EditProductPage() {
  const { productId } = useParams();
  console.log('id', productId);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    basePrice: "",
    discount: "",
    quantity: "",
    category: "",
    tags: "",
    status: "Draft",
    images: [],
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/admin/category");
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    if (!productId) {
      console.error("Product ID is not defined");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get('/admin/product');
      const allProducts = response.data.products;

      const matchedProduct = allProducts.find(product => product._id === productId);

      if (matchedProduct) {
        setProductData({
          name: matchedProduct.name || "",
          description: matchedProduct.description || "",
          basePrice: matchedProduct.basePrice?.toString() || "",
          discount: matchedProduct.discount?.toString() || "",
          quantity: matchedProduct.quantity?.toString() || "",
          category: matchedProduct.category || "",
          tags: matchedProduct.tags || "",
          status: matchedProduct.status || "Draft",
          images: matchedProduct.images || [],
        });
        setImagePreview(matchedProduct.images || []);
      } else {
        console.error("Product not found with ID:", productId);
      }
    } catch (error) {
      console.error("Error fetching products:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [productId]);

  const validateForm = () => {
    const errors = {};

    if (!productData.name.trim()) errors.name = "Product name is required.";
    if (!productData.basePrice || isNaN(productData.basePrice) || productData.basePrice <= 0)
      errors.basePrice = "Base price must be a valid positive number.";
    if (productData.discount && (isNaN(productData.discount) || productData.discount < 0 || productData.discount > 100))
      errors.discount = "Discount should be a number between 0 and 100.";
    if (!productData.category) errors.category = "Category is required.";
    if (!productData.quantity || isNaN(productData.quantity) || productData.quantity <= -1)
      errors.quantity = "Quantity must be a valid positive number.";
    if (productData.images.length === 0) errors.images = "At least one image is required.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: value || "",
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (productData.images.length + files.length > 4) {
      alert("You can only upload up to 4 images");
      return;
    }

    for (const file of files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "pedalQuest");

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/pedalquest/image/upload`,
          formData
        );
        const imageUrl = response.data.secure_url;
        setProductData((prevState) => ({
          ...prevState,
          images: [...prevState.images, imageUrl],
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const removeImage = (index) => {
    setProductData(prevState => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.put(
        `/admin/editproduct/${productId}`,
        {
          name: productData.name,
          description: productData.description,
          basePrice: Number(productData.basePrice),
          discount: Number(productData.discount) || 0,
          quantity: Number(productData.quantity) || 0,
          category: productData.category,
          tags: productData.tags,
          status: productData.status,
          images: productData.images,
        }
      );

      console.log("Product updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating product:", error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <p>Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      {/* Same header code as before */}
      
      {/* Main Content */}
      <main className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-gray-400 mt-1">
              Dashboard / Product List / Edit Product
            </p>
          </div>
          <div className="space-x-4">
            <button
              className="px-6 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors duration-300"
              onClick={() => window.history.back()}
            >
              <XIcon className="h-5 w-5 inline-block mr-2" />
              Cancel
            </button>
            <button
              className={`px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300
                ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <SaveIcon className="h-5 w-5 inline-block mr-2" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            {/* General Information */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">General Information</h2>
              <div className="space-y-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={productData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
                <textarea
                  name="description"
                  placeholder="Product description"
                  value={productData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                ></textarea>
              </div>
            </div>

            {/* Media */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Media</h2>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 transition-all duration-300 hover:border-blue-500">
                <input
                  type="file"
                  multiple
                  name="images"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="upload-image"
                  accept="image/*"
                />
                <label htmlFor="upload-image" className="cursor-pointer block text-center">
                  <PlusIcon className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-400">
                    Drag and drop images here, or click to add images (max 4)
                  </p>
                </label>

                {/* Image Preview Grid */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {productData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg transition-all duration-300 group-hover:opacity-75"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <TrashIcon className="h-5 w-5 text-white" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
                          Main Image
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {errors.images && <p className="text-red-500">{errors.images}</p>}
              </div>
            </div>

            {/* Pricing and Offer Setting */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">
                Add Price
              </h2>
              <div className="space-y-6">
                <input
                  type="text"
                  name="basePrice"
                  placeholder="Base price"
                  value={productData.basePrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
                {errors.basePrice && <p className="text-red-500">{errors.basePrice}</p>}
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Inventory</h2>
              <div className="space-y-6">
                <input
                  type="text"
                  name="quantity"
                  placeholder="Product quantity"
                  value={productData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
                {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Category</h2>
              <div className="space-y-6">
                <select
                  name="category"
                  value={productData.category || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                >
                  <option value="">Product Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500">{errors.category}</p>}
                <select
                  name="tags"
                  value={productData.tags || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                >
                  <option value="">Select tags</option>
                  <option value="New Arrival">New Arrival</option>
                  <option value="Best Seller">Best Seller</option>
                </select>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Status</h2>
              <select
                name="status"
                value={productData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
