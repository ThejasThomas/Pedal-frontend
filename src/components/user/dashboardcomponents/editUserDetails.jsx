import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../../api/axiosInstance';
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditUserDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      
      if (!userData?._id) {
        throw new Error('User ID not found');
      }

      const response = await axiosInstance.get(`/user/fetchUserAccountData/${userData._id}`);
      
      if (response.data.success && response.data.user) {
        setFormData({
          firstName: response.data.user.firstName || '',
          lastName: response.data.user.lastName || '',
          email: response.data.user.email || '',
          phone: response.data.user.phone || ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user details');
      console.error('Error fetching user details:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
  } else if (!/^\d+$/.test(formData.phone)) {
      errors.phone = 'Phone number must contain only numeric digits';
  } else if (formData.phone.length !== 10) {
      errors.phone = 'Phone number must be exactly 10 digits';
  }
  

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const userData = JSON.parse(localStorage.getItem('user'));
      
      if (!userData?._id) {
        throw new Error('User ID not found');
      }

      const response = await axiosInstance.put(`/user/updateUserData/${userData._id}`, formData);

      if (response.data.success) {
        const updatedUserData = {
          ...userData,
          ...formData
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user details');
      console.error('Error updating user details:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>
          
          {error && (
            <div className="mb-4 bg-red-50 text-red-500 p-4 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                  } py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                />
                {formErrors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                  } py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                />
                {formErrors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  } py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    formErrors.phone ? 'border-red-500' : 'border-gray-300'
                  } py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/user/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={()=>navigate('/user/dashboard')}
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserDetails;