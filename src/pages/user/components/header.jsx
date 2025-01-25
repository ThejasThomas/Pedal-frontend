import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaSearch, FaChevronDown, FaUser } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import { axiosInstance } from '../../../api/axiosInstance';
import storeImage from '../../../assets/images/storeimage.jpg'
import logo from '../../../assets/images/logo.png'
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../../../redux/slice/userSlice';
import { useNavigate } from 'react-router-dom';

const Header = ({ onSortChange,onCategoryChange }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/category');
      if (data.success) {
        setCategories(data.categories);
      } else {
        setError(data.message || 'Failed to fetch categories');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }
  const handleCategorySelect = (categoryId) => {
    console.log('cat id',categoryId);
    
    setSelectedCategory(categoryId);
    onCategoryChange(categoryId); // Pass the category ID to parent
    setIsCategoryOpen(false); 
  };
  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsCategoryOpen(false); // Close category dropdown if open
  };
  const handleCategoryMenuToggle = () => {
    setIsCategoryOpen(!isCategoryOpen);
    setIsUserMenuOpen(false); // Close user menu if open
  };

  const handleCart=(e)=>{
    e.preventDefault()
    navigate('/user/cart')
  }

  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    onSortChange(selectedOption);
  };

  const handleLogout = async () => {
    dispatch(logoutUser());
  }

  const handleUserButton = async (e) => {
    e.preventDefault();
    navigate('/user/dashboard');
  }

  return (
    <header className="bg-white shadow-md">
      <nav className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <img src={logo || "/placeholder.svg"} alt="Logo" className="w-10 h-10" />
            <span className="text-xl font-bold">PedalQuest</span>
          </a>
          
          <div className="flex items-center space-x-6">
            <a href="/user/store" className="text-sm font-medium hover:text-gray-300 transition-colors">Home</a>
            <a href="/user/contactpage" className="text-sm font-medium hover:text-gray-300 transition-colors">Contact Us</a>
            <button className="text-white hover:text-gray-300 transition-colors relative">
              <FaShoppingCart onClick={(e)=>handleCart(e)} className="w-5 h-5" />
              {/* <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span> */}
            </button>
            <div className="relative">
        <button 
          onClick={handleUserMenuToggle} 
          className="flex items-center space-x-1 hover:text-gray-300 transition-colors"
        >
          <FaUser className="w-5 h-5" />
          <FaChevronDown className="w-3 h-3" />
        </button>
        {isUserMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <button onClick={handleUserButton} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Dashboard</button>
            <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Logout</button>
          </div>
        )}
      </div>
          </div>
        </div>
      </nav>
      
      <div className="relative h-80 md:h-96 lg:h-[32rem] overflow-hidden">
        <img
          src={storeImage || "/placeholder.svg?height=1000&width=1500"}
          alt="Store Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black bg-opacity-60 flex flex-col items-center justify-end pb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center px-4 mb-4 drop-shadow-lg">
            Welcome to PedalQuest
          </h1>
          <p className="text-xl md:text-2xl text-white text-center px-4 max-w-3xl drop-shadow-md">
            Discover the Perfect Ride for Your Journey
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative">
        <button
          onClick={handleCategoryMenuToggle}
          className="bg-gray-800 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors hover:bg-gray-700"
          disabled={loading || error}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Category</span>
              <FaChevronDown className="ml-2" />
            </>
          )}
        </button>
        {isCategoryOpen && !loading && !error && (
          <div className="absolute z-10 w-48 py-2 mt-2 bg-white rounded-md shadow-xl">
            <button
              onClick={() => handleCategorySelect('')}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategorySelect(category._id)}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
        {error && (
          <div className="absolute z-10 w-48 py-2 mt-2 bg-red-50 text-red-500 rounded-md shadow-xl">
            <span className="block px-4 py-2 text-sm">{error}</span>
          </div>
        )}
      </div>
          
          <div className="relative flex-grow max-w-md">
            <input
              type="search"
              placeholder="Search..."
              className="w-full px-4 py-2 text-sm text-gray-900 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <FaSearch className="text-gray-400" />
            </button>
          </div>

          <div className="w-full sm:w-auto">
            <select
              className="w-full sm:w-48 px-4 py-2 text-sm text-gray-900 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={handleSortChange}
            >
              <option value="">Sort By</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="nameAZ">Name: A-Z</option>
              <option value="nameZA">Name: Z-A</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;