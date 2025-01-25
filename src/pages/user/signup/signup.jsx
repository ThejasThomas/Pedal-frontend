import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../api/axiosInstance";
import logo from "../../../assets/images/Logo.png";
import signImg from '../../../assets/images/signupImg.avif';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  const togglePasswordVisibility = (field) => {
  
    setPasswordVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  const inputFields = [
    { name: "firstName", type: "text", placeholder: "First Name", icon: FiUser },
    { name: "lastName", type: "text", placeholder: "Last Name", icon: FiUser },
    { name: "email", type: "email", placeholder: "Email", icon: FiMail },
    { 
      name: "password", 
      type: passwordVisibility.password ? "text" : "password", 
      placeholder: "Password", 
      icon: FiLock,
      isPassword: true
    },
    { 
      name: "confirmPassword", 
      type: passwordVisibility.confirmPassword ? "text" : "password", 
      placeholder: "Confirm Password", 
      icon: FiLock,
      isPassword: true
    },
    { name: "phone", type: "tel", placeholder: "Phone", icon: FiPhone },
  ];

  const validateForm = () => {
    const newErrors = {};
    const { firstName, lastName, email, password, confirmPassword, phone } = formData;

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!/^[A-Za-z\s]+$/.test(firstName.trim())) {
      newErrors.firstName = "Name can only contain letters";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!/^[A-Za-z\s]+$/.test(lastName.trim())) {
      newErrors.lastName = "Name can only contain letters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[\w-.]+@gmail\.com$/.test(email.trim())) {
      newErrors.email = "Email must be a valid Gmail address.";
    }

    if (!password.trim()) {
      newErrors.password = "Password should not be empty.";
    } else if (password.length < 6) {
      newErrors.password = "Password should contain at least 6 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
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
      const response = await axiosInstance.post("/user/signup", formData);
      if (response.data.success) {
        alert("OTP sent successfully to your email.");
        navigate("/user/otp", { state: { email: formData.email } });
      } else {
        alert(response.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error(
        "Error during signup:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Failed to sign up.");
    }
  };



  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url(${signImg})` }}>
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <div className="z-10 bg-white bg-opacity-95 rounded-3xl shadow-2xl max-w-4xl w-11/12 flex overflow-hidden">
        <div className="hidden lg:block w-1/2">
          <img
            src={signImg}
            alt="Cyclist"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <img
              src={logo}
              alt="Logo"
              className="w-16 h-auto mb-8 mx-auto"
            />
            <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
              Create Account
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {inputFields.map((field, index) => (
                <div key={index} className="relative">
                  <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className={`w-full p-3 pl-10 ${field.isPassword ? 'pr-12' : 'pr-4'} rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ${
                      errors[field.name] ? 'border-red-500' : ''
                    }`}
                    autoComplete={field.isPassword ? "new-password" : "on"}
                  />
                  {field.isPassword && (
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(field.name)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      aria-label={`${passwordVisibility[field.name] ? 'Hide' : 'Show'} password`}
                    >
                      {passwordVisibility[field.name] ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  )}
                  {errors[field.name] && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
              >
                Sign Up
              </button>
            </form>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/user/login"
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300"
              >
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

