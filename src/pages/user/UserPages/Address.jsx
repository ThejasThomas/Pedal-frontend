import  { useEffect, useState } from 'react';
import { axiosInstance } from '../../../api/axiosInstance';
import { useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';

const UserAddress = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    city: '',
    pincode: '',
    address: ''
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    addressId: null
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector((state) => state.user.users);
console.log('address',user._id)

 

  
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      console.log('Fetching address for user',user._id);
      
      const response = await axiosInstance.get(`/user/fetchuseraddress/${user._id}`);
      console.log('res',response.data);
      
      if (response.data.success) {
        setAddresses(response.data.data || []);
        setError(null);
      } else {
        throw new Error(response.data.message || 'Failed to fetch addresses');
      }
    } catch (error) {
      setError('Failed to fetch addresses. Please try again later.');
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      fullName: '',
      mobile: '',
      city: '',
      pincode: '',
      address: ''
    });
    setSelectedCountry('');
    setSelectedState('');
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }
    
    if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile must be a 10-digit number.';
    }
    
    if (!selectedCountry) {
      newErrors.country = 'Country is required.';
    }
    
    if (!selectedState) {
      newErrors.state = 'State is required.';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }
    
    if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be a 6-digit number.';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState('');
    setErrors((prev) => ({
      ...prev,
      country: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        country: selectedCountry,
        state: selectedState
      };
      const userId = user._id;

      const response = await axiosInstance.post(`user/useraddress/${userId}`, submitData);
      console.log('Add address response :',response.data)
      
      if (response.data.success) {
      
        
        await fetchAddresses();
        handleCloseModal();

        alert("Address added successfully")
        

      } else {
        setErrors(prev => ({
          ...prev,
          submit: response.data.message || 'Failed to save address'
        }));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
        
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteClick = (addressId) => {
    setDeleteConfirmation({
      show: true,
      addressId
    });
  };
  const handleCancelDelete = () => {
    setDeleteConfirmation({
      show: false,
      addressId: null
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmation.addressId) return;

    setIsDeleting(true);
    try {
      console.log('address Iddddd',deleteConfirmation.addressId);
      
      const response = await axiosInstance.delete(`/user/deleteaddress/${deleteConfirmation.addressId}`);
      
      if (response.data.success) {
        // Refresh the addresses list
        await fetchAddresses();
        alert('Address deleted successfully');
      } else {
        throw new Error(response.data.message || 'Failed to delete address');
      }
    } catch (error) {
      alert('Failed to delete address. Please try again.');
      console.error('Error deleting address:', error);
    } finally {
      setIsDeleting(false);
      handleCancelDelete();
    }
  };

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'IN', name: 'India' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' }
  ];

  const statesByCountry = {
    US: ['Alabama', 'Alaska', 'Arizona', 'California', 'Florida'],
    IN: ['Tamil Nadu', 'Kerala', 'Karnataka', 'Maharashtra', 'Gujarat'],
    GB: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    CA: ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
    AU: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia']
  };

  return (
    <div className="p-4">
    <div className="mb-4">
      <button
        onClick={handleOpenModal}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Address
      </button>
    </div>
    {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Loading addresses...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 py-4 text-center">
          {error}
          <button
            onClick={fetchAddresses}
            className="ml-2 text-blue-500 underline hover:text-blue-600"
          >
            Retry
          </button>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-4 text-gray-600">
          No addresses found. Add your first address!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((address, index) => (
            <div
              key={address._id || index}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative"
            >
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleDeleteClick(address._id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                  title="Delete address"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <h3 className="font-bold text-lg mb-2">{address.fullName}</h3>
              <div className="space-y-1 text-gray-600">
                <p>{address.address}</p>
                <p>{address.city}, {address.state}</p>
                <p>{address.country} - {address.pincode}</p>
                <p className="text-sm">Mobile: {address.mobile}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Delete Address</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this address? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-2">Add Address</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded">
                    {errors.submit}
                  </div>
                )}

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full border ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    } rounded p-2`}
                    placeholder="Enter your name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium">
                    Mobile
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`w-full border ${
                      errors.mobile ? 'border-red-500' : 'border-gray-300'
                    } rounded p-2`}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium">
                    Country
                  </label>
                  <select
                    id="country"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className={`w-full border ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    } rounded p-2`}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium">
                    State
                  </label>
                  <select
                    id="state"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className={`w-full border ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    } rounded p-2`}
                    disabled={!selectedCountry}
                  >
                    <option value="">Select State</option>
                    {selectedCountry &&
                      statesByCountry[selectedCountry].map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                  </select>
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full border ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    } rounded p-2`}
                    placeholder="Enter your city"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium">
                    Pincode
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className={`w-full border ${
                      errors.pincode ? 'border-red-500' : 'border-gray-300'
                    } rounded p-2`}
                    placeholder="Enter 6-digit pincode"
                    maxLength={6}
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium">
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full border ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    } rounded p-2`}
                    placeholder="Enter your address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button
                  type="submit"
                  className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  className="text-gray-700 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAddress; 