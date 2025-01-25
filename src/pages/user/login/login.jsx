
import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../../../redux/slice/userSlice';
import loginImg from '../../../assets/images/loginImg.jpg';
import logo from '../../../assets/images/Logo.png';
import GoogleAuthButton from '../../../utils/GoogleAuth/googleAuthButon';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axiosInstance.get('/user/check-auth');
        if (response.data.success && response.data.user) {
          dispatch(addUser(response.data.user));
          navigate('/user/store');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    if (!isAuthenticated) {
      checkAuthStatus();
    }
  }, [dispatch, navigate, isAuthenticated]);

  const validateForm = () => {
    const newErrors = {};
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();

    if (!trimmedEmail) {
      newErrors.email = 'Email should not be empty';
    }
    if (!trimmedPassword) {
      newErrors.password = 'Password should not be empty.';
    }
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      const response = await axiosInstance.post('/user/login', formData);
      
      if (response.data.success) {
        const userData = response.data.user;
        dispatch(addUser(userData))
        localStorage.setItem("user", JSON.stringify({
          _id: userData._id,
          fullName: userData.fullName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role
        }));
        toast.success('Login successful');
        navigate('/user/store');
      }
    } catch (error) {
      if (error.response) {
        // Use the error message from the server if available
        const errorMessage = error.response.data.message || 'Invalid email or password';
        toast.error(errorMessage);
    } else {
        // Handle network or other errors
        toast.error('Login failed. Please try again.');
    }
}
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  
  };


  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/user/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="flex w-full max-w-4xl bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="w-0 lg:w-1/2 hidden lg:block">
          <img
            src={loginImg}
            alt="Cyclist on forest road"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="w-full lg:w-1/2 p-12 space-y-8">
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Company logo"
              className="w-24 h-24 object-contain"
            />
          </div>

          <h1 className="text-3xl font-bold text-center text-white">Welcome Back</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="Enter your email"
                  required
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pl-10 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="Enter your password"
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
            
              <div className="text-sm">
                <a href="/user/forgot-password" className="font-medium text-red-500 hover:text-red-400">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Sign In
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
            </div>
          </div>
          <div className="mt-6">
            <GoogleAuthButton 
              onSuccessRedirect={'/user/store'} 
              role="user"
              isDarkMode={true}
            />
          </div>

          <p className="text-center text-gray-400">
            Don't have an account?{' '}
            <a onClick={handleSignup} href="/signup" className="font-medium text-red-500 hover:text-red-400">
              Sign up now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}


