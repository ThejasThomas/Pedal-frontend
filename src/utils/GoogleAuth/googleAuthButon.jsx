import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { axiosInstance } from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useCallback } from "react";
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../../redux/slice/userSlice";


const GoogleAuthButton = ({ onSuccessRedirect = "/home", role, isDarkMode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch()
  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    try {
      setIsLoading(true);
      if (!credentialResponse?.credential) {
        throw new Error("Invalid credential response");
      }
      const decodedToken = jwtDecode(credentialResponse.credential);
      if (!decodedToken.email || !decodedToken.email_verified) {
        throw new Error("Email verification required");
      }
      const response = await axiosInstance.post("/auth/googleAuth", {
        token: credentialResponse.credential,
        role: role
      });
      if (response.data.success) {
        const userData = response.data.user;
        dispatch(addUser(userData))
        localStorage.setItem("user", JSON.stringify({
          _id: userData._id,
          fullName: userData.fullName,
          lastName: userData.lastName,
          email: userData.email,
          isGoogleUser: userData.isGoogleUser,
          role: userData.role
        }));

        toast.success(response.data.message || "Login successful");
        navigate(onSuccessRedirect);
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
            if (error.message === "Token too old") {
        toast.error("Authentication session expired. Please try again.");
      } else if (error.message === "Email verification required") {
        toast.error("Please verify your email with Google first.");
      } else if (error.response?.status === 409) {
        toast.error("An account already exists with this email.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate, onSuccessRedirect]);

  const handleGoogleError = useCallback(() => {
    console.error("Google Login Failed");
    toast.error("Google sign-in failed. Please try again.");
    setIsLoading(false);
  }, []);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
          {/* You can add a loading spinner here */}
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme={isDarkMode ? "filled_black" : "outline"}
        size="large"
        shape="rectangular"
        text="continue_with"
        disabled={isLoading}
        useOneTap={false}
      />
    </div>
  );
};

export default GoogleAuthButton;
GoogleAuthButton.propTypes = {
  onSuccessRedirect: PropTypes.string,
  role: PropTypes.string,
  isDarkMode: PropTypes.bool
};