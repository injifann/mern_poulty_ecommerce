import React, { useState } from 'react'
import toast from 'react-hot-toast';
import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext';

export default function AddressCard({userAddress,setUserAddress}) 
{
  const {user} = useAuth();
  const [addressData,setAddressData] = useState(userAddress??{fullName:"",addressLine1:"",addressLine2:"",city:"",state:"",postalCode:"",country:"" ,phone:''});
  const [isSubmitting,setIsSubmitting] = useState(false)

   const handleChange = (e)=>
   {
       setAddressData((prev)=>{
        return {...prev,[e.target.name]:e.target.value}
       })
   }

 const validateData=()=>
 {
    const requiredFields = ["fullName","addressLine1","city","state","postalCode","country","phone"];

    if(!userAddress)
    {
      for (const field of requiredFields)
      {
        if(!addressData[field])
        {
          toast.error(`${field} is required`);
          return false
        }
     }
      return true
    }
    else
    {
    const changed = JSON.stringify(userAddress)!==JSON.stringify(addressData)
    if(!changed)
    {
      toast.error("no changes detected");
      return false
    }
    return true
  }
  
 }

 const handleSubmit = async(e)=>
 {
  e.preventDefault();
  if(!user)
  {
    toast.error("please create profile first");
    return;
  }
   const validatedAddress = validateData();
   if(validatedAddress)
   {
   try
   {
     setIsSubmitting(true)
     let res;
     if(userAddress)
     {
       res = await axios.put("/api/address/updateaddress",addressData);
       setUserAddress(res.data.address)
     }
     else
     {
       res = await axios.post("/api/address/addaddress",addressData);
       setUserAddress(res.data.address)

     }
     setUserAddress(res.data.address);
     toast.success(res.data?.message || "success fully added");
   }
   catch(error)
   {
     toast.error(error.response?.data?.message || "failed to add address");
   }
   finally
   {
     setIsSubmitting(false)
   }
  }   
 }
  return (
  <div className="flex justify-center px-4 py-10 bg-gray-50 min-h-screen">
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-gray-200 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {userAddress ? "Edit Address" : "Add New Address"}
      </h1>

      <p className="text-gray-500 mb-8">
        {userAddress
          ? "Update your shipping address information."
          : "Enter your shipping address below."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={addressData.fullName}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            placeholder="John Doe"
          />
        </div>

        {/* Address Line 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Line 1
          </label>
          <input
            type="text"
            name="addressLine1"
            value={addressData.addressLine1}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            placeholder="Street address"
          />
        </div>

        {/* Address Line 2 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Line 2 <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="text"
            name="addressLine2"
            value={addressData.addressLine2}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            placeholder="Apartment, suite, etc."
          />
        </div>

        {/* City & State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              value={addressData.city}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State / Region
            </label>
            <input
              type="text"
              name="state"
              value={addressData.state}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="State"
            />
          </div>
                 <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              postal code
            </label>
              <input
              type="text"
              name="postalCode"
              value={addressData.postalCode}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="postal code"
            />
          </div>
        </div>
        

        {/* Country & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>

            <select
              name="country"
              value={addressData.country}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="ET">Ethiopia</option>
              <option value="UK">United Kingdom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={addressData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="+251..."
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isSubmitting
              ? "Saving..."
              : userAddress
              ? "Update Address"
              : "Save Address"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
