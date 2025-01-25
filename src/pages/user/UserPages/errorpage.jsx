import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Home } from 'lucide-react'

const ErrorPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <AlertCircle className="mx-auto h-24 w-24 text-red-500" />
        <h1 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-5xl">
          404 - Page Not Found
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <button
            onClick={() => navigate('/user/store')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            <Home className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
            Go back home
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage

