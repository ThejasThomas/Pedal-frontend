import { useState } from 'react';
import { Eye, EyeOff, User } from 'lucide-react';
import { Button } from "../../../components/UI/button";
import { Input } from "../../../components/UI/input";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import adminLoginImg from '../../../assets/images/adminLogin.jpg'
import { useDispatch } from 'react-redux';
import { addAdmin } from '../../../../redux/slice/adminSlice';
import {toast} from 'sonner';
import { axiosInstance } from '../../../api/axiosInstance';



export default function AdminLogin() {
  const dispatch =useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setError('');
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/admin/login', formData);
      
      if (response.data) {

        const adminData = response.data;
        dispatch(addAdmin(adminData));
          localStorage.setItem('user',JSON.stringify({
            _id:adminData._id,
            fullName:adminData.fullName,
            lastName:adminData.lastName,
            email:adminData.email,
            role:adminData.role
          }))
          toast.success('Admin Login successful!');

        navigate('/admin/dashboard');
      }
    } catch (err) {
      if (err.response) {

        switch (err.response.status) {
          case 401:
            toast.error('No admin access. Please check your credentials.');
            break;
          case 400:
            toast.error('Invalid email or password.');
            break;
          default:
            toast.error(err.response.data.message || 'Login failed. Please try again.');
        }
      } else if (err.request) {

        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="hidden lg:block lg:w-1/2 relative">
      <img src={adminLoginImg} alt="Login Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col bg-black p-6 lg:p-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-3xl lg:text-4xl font-bold">
            Admin Login
          </h1>
        </div>
{/* 
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )} */}

        <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col justify-center">
          <div className="relative">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent border-[#30363d] text-white pl-12 h-12 w-full"
              required
              disabled={isLoading}
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-transparent border-[#30363d] text-white pr-12 pl-12 h-12 w-full"
              required
              disabled={isLoading}
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-lg font-medium mt-4 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
}