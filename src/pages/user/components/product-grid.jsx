import React, { useState, useEffect } from 'react';
import { Heart, ImageOff, ShoppingCart } from 'lucide-react';
import { axiosInstance } from '../../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProductGrid = ({ sortOption, selectedCategory,searchQuery }) => {
  const userData = useSelector((store) => store.user.users);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory,currentPage,searchQuery]);

  useEffect(() => {
    if (sortOption && products.length > 0) {
      sortProducts(sortOption);
    }
  }, [sortOption]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Start with base endpoint
      let endpoint = `/user/products?page=${currentPage}&limit=4`;
      
      // Add category and search as query parameters
      if (selectedCategory) {
        endpoint += `&category=${selectedCategory}`;
      }
      if (searchQuery && searchQuery.trim()) {
        endpoint += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
  
      const { data } = await axiosInstance.get(endpoint);
      
      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };
  const sortProducts = (option) => {
    const sortedProducts = [...products];
    switch (option) {
      case 'priceLowToHigh':
        sortedProducts.sort((a, b) => {
          const priceA = a.discountedAmount ? a.basePrice - a.discountedAmount : a.basePrice;
          const priceB = b.discountedAmount ? b.basePrice - b.discountedAmount : b.basePrice;
          return priceA - priceB;
        });
        break;
      case 'priceHighToLow':
        sortedProducts.sort((a, b) => {
          const priceA = a.discountedAmount ? a.basePrice - a.discountedAmount : a.basePrice;
          const priceB = b.discountedAmount ? b.basePrice - b.discountedAmount : b.basePrice;
          return priceB - priceA;
        });
        break;
      case 'nameAZ':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameZA':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    setProducts(sortedProducts);
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return null;
  };

  const handleImageClick = (productId) => {
    navigate(`/user/product/${productId}`);
  };

  const calculateFinalPrice = (product) => {
    if (product.discountedAmount) {
      return (product.basePrice - product.discountedAmount).toFixed(2);
    }
    return product.basePrice.toFixed(2);
  };

  const handlePageChange=(page) =>{
    if(page >0 && page <=totalPages){
      setCurrentPage(page);
    }
  }
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">
        Featured Products
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div onClick={() => handleImageClick(product._id)} className="relative aspect-square cursor-pointer">
                {getProductImage(product) ? (
                  <img
                    src={getProductImage(product) || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.svg?height=300&width=300";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ImageOff className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {product.discountValue > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.discountValue}% OFF
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 truncate">{product.name}</h3>
                <div className="mb-4">
                  {product.discountedAmount ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-semibold">
                        ${calculateFinalPrice(product)}
                      </span>
                      <span className="text-gray-500 text-sm line-through">
                        ${product.basePrice.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-900">
                      ${product.basePrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <button className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </button>
                  <button className="text-gray-500 hover:text-red-500 transition-colors">
                    <Heart className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <nav className="flex gap-2" aria-label="Pagination">
        {[...Array(totalPages).keys()].map((i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === i + 1
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              } transition-colors`}
            >
              {i + 1}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ProductGrid;