import React, { useEffect, useRef, useState } from "react";
import {
  SearchIcon,
  UserCircleIcon,
  PlusIcon,
  XIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/Logo.png";
import { toast } from "sonner";
import { axiosInstance } from "../../../api/axiosInstance";

export default function AddProductPage({ onSave, onCancel }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [categories, setCategories] = useState([]);
  const fileRef = useRef(null);

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
  const handleCancel = () => {
    try {
      console.log("Cancel button clicked");

      onCancel();
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          "/admin/category"
        );
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!productData.name) newErrors.name = "Product name is required.";
    if (!productData.description)
      newErrors.description = "Description is required.";
    if (!productData.basePrice) newErrors.basePrice = "Base price is required.";
    if (isNaN(Number(productData.basePrice)))
      newErrors.basePrice = "Base price must be a number.";
    if (!productData.quantity) newErrors.quantity = "Quantity is required.";
    if (isNaN(Number(productData.quantity)))
      newErrors.quantity = "Quantity must be a number.";
    if (!productData.category) newErrors.category = "Category is required.";
    if (productData.images.length === 0)
      newErrors.images = "At least one image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (productData.images.length + files.length > 4) {
      alert("You can only upload up to 4 images");
      return;
    }

    for (const file of files) {
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
        setImagePreview((prev) => [...prev, imageUrl]);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    }

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const removeImage = (index) => {
    setProductData((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(
        "/admin/addproduct",
        {
          ...productData,
          basePrice: Number(productData.basePrice),
          quantity: Number(productData.quantity),
          category: productData.category,
        }
      );
      console.log(response)
      if (response.data) {
        toast.success("Product added successfully!");
        onCancel()
        setProductData({
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
        setImagePreview([]);
      } else {
        toast.error(response.data.message || "Failed to add product");
      }
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to add product. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="flex items-center justify-between p-6 bg-gray-800 bg-opacity-50 backdrop-blur-lg">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <UserCircleIcon className="h-8 w-8 text-gray-400" />
          <span className="font-medium">Thejas Thomas</span>
        </div>
      </header>

      <main className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 onClick={onSave} className="text-3xl font-bold">
              Add Product
            </h1>
          </div>
          <div className="space-x-4">
            <button
              className="px-6 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors duration-300"
              onClick={handleCancel}
              type="button"
            >
              <XIcon className="h-5 w-5 inline-block mr-2" />
              Cancel
            </button>
            <button
              className={`px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300
          ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleSubmit}
              disabled={isSubmitting}
              type="button"
            >
              {isSubmitting ? "Adding..." : "Add Product"}
              <PlusIcon className="h-5 w-5 inline-block ml-2" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">
                General Information
              </h2>
              <div className="space-y-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={productData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">{errors.name}</span>
                )}
                <textarea
                  name="description"
                  placeholder="Type product description here..."
                  value={productData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                ></textarea>
                {errors.description && (
                  <span className="text-red-500 text-sm">
                    {errors.description}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Media</h2>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 transition-all duration-300 hover:border-blue-500">
                <input
                  type="file"
                  ref={fileRef}
                  multiple
                  name="images"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="upload-image"
                  accept="image/*"
                />
                <label
                  htmlFor="upload-image"
                  className="cursor-pointer block text-center"
                >
                  <PlusIcon className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-400">
                    Drag and drop images here, or click to add images (max 4)
                  </p>
                </label>

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
                {errors.images && (
                  <span className="text-red-500 text-sm">{errors.images}</span>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Enter Price</h2>
              <div className="space-y-6">
                <input
                  type="text"
                  name="basePrice"
                  placeholder="Type base price here..."
                  value={productData.basePrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
                {errors.basePrice && (
                  <span className="text-red-500 text-sm">
                    {errors.basePrice}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Inventory</h2>
              <div className="space-y-6">
                <input
                  type="text"
                  name="quantity"
                  placeholder="Type product quantity here..."
                  value={productData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
                {errors.quantity && (
                  <span className="text-red-500 text-sm">
                    {errors.quantity}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Category</h2>
              <div className="space-y-6">
                <select
                  name="category"
                  value={productData.category}
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
                {errors.category && (
                  <span className="text-red-500 text-sm">
                    {errors.category}
                  </span>
                )}
                <select
                  name="tags"
                  value={productData.tags}
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
