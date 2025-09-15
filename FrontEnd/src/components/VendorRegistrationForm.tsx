import React, { useState } from 'react'
import axios from 'axios'
import { LoaderIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react'
export const VendorRegistrationForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    userId: '',
    companyName: '',
    serviceType: '',
    address: '',
  })
  // UI states
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Reset status messages
    setSuccess('')
    setError('')
    // Validate form
    if (
      !formData.userId ||
      !formData.companyName ||
      !formData.serviceType ||
      !formData.address
    ) {
      setError('Please fill in all fields')
      return
    }
    // Set loading state
    setIsLoading(true)
    try {
      // Make API call with user-provided userId
      const response = await axios.post(
        `http://localhost:8080/api/vendors/register/${formData.userId}`,
        {
          companyName: formData.companyName,
          serviceType: formData.serviceType,
          address: formData.address,
        },
      )
      // Handle success
      setSuccess(`${formData.companyName} has been successfully registered!`)
      // Reset form
      setFormData({
        userId: '',
        companyName: '',
        serviceType: '',
        address: '',
      })
    } catch (err: any) {
      // Handle error
      if (err.response?.status === 409) {
        setError('You are already registered as a vendor')
      } else {
        setError('Registration failed. Please try again later.')
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Vendor Registration
        </h2>
        <p className="text-gray-600 mt-2">
          Join our marketplace and grow your business
        </p>
      </div>
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-green-700">{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              User ID
            </label>
            <input
              id="userId"
              name="userId"
              type="text"
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter your user ID"
            />
          </div>
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Company Name
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter your company name"
            />
          </div>
          <div>
            <label
              htmlFor="serviceType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Service Type
            </label>
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              <option value="">Select a service type</option>
              <option value="Catering">Catering</option>
              <option value="Photography">Photography</option>
              <option value="Venue">Venue</option>
              <option value="Music">Music</option>
              <option value="Decoration">Decoration</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter your business address"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-2.5 px-4 rounded-md text-white font-medium ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isLoading ? (
                <>
                  <LoaderIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Registering...
                </>
              ) : (
                'Register as Vendor'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
