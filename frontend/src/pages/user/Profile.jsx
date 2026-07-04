import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import defaultImage from "../assets/secondaregg.png"
import toast from 'react-hot-toast';
import axios from 'axios';
const api = import.meta.env.VITE_API_URL;


export default function Profile() {
    const {user,logout,isLoading,error} = useAuth();
    const [isUpdating,setIsUpdating] = useState(false);
    const [isDeleting,setIsDeleting] = useState(false);
    const [isSubmittingAddress,setIsSubmittingAddress] = useState(false);
    const [isFetchingAddress,setIsFetchingAddress] = useState(true);
    const [currentPassword,setCurrentPassword] = useState('');
    const [newPassword,setNewPassword] = useState('');
    const [confirmedPassword,setConfirmedPassword] = useState('');
    const [ConfirmAccountDeletion,setAccountConfirmDeletion] = useState('');
    const [address,setAddress] = useState({fullName:"",addressLine1:"",addressLine2:"",city:'',postalCode:'',state:'',phone:''});
    const [userAddress,setUserAddress] = useState(null);
    const [isEditing,setIsEditing] = useState(false);


    useEffect(()=>{
        if(error)
        {
            toast.error(error);
            return;
        }
     const fetchAddress = async () =>
     {       
            try
            {
              
              const res = await axios.get(`${api}/address/getaddress`);
              setUserAddress(res.data.address);
            }
            catch(error)
            {
                toast.error(error.response?.data?.message);
            }
            finally
            {
               setIsFetchingAddress(false)
            }
    };fetchAddress();
    },[])

    const handleAddressChange = (e) =>
    {
       setAddress((prev)=>
    {
        return {...prev,[e.target.name]:e.target.value}
    })
    }
    const handleEditing = () =>
    {
        setAddress(userAddress);
        setIsEditing(true);
    }
    
    const handleAddressSubmit = async (e)=>
    {
        e.preventDefault();
        if(!address.fullName || !address.addressLine1 || !address.addressLine2 || !address.city || !address.postalCode || !address.state || !address.phone)
        {
            return toast.error("all fields are required");
        }
        if((isEditing) && (address.fullName === userAddress.fullName &&
            address.addressLine1 ===userAddress.addressLine1 && 
            address.addressLine2 ===userAddress.addressLine2 &&
            address.city === userAddress.city && 
            address.postalCode === userAddress.postalCode && 
            address.state === userAddress.state &&
            address.phone === userAddress.phone) )
        {
             toast.error("you did not updated any detail")
             return;
        }
        else
        {
           try
           {
            setIsSubmittingAddress(true);
            const res = await axios.post(`${api}/api/address/addaddress`,address);
            setAddress({fullName:"",addressLine1:"",addressLine2:"",city:'',postalCode:'',state:'',phone:''});
            setUserAddress(res.data.address);
            toast.success(res.data.message);
           }
           catch(error)
           {
              toast.error(error.response?.data?.message || "Failed to add user address");
           }
           finally
           {
            setIsSubmittingAddress(false);
            setIsEditing(false);

           }

        }
        
    }
    const handleProfileDeletion = async(e) =>
    {
      e.preventDefault();
      if(ConfirmAccountDeletion!=="DELETE")
      {
        toast.error("please confirm account deletion");
        return;
      }

      else
      {
        try
        {
         setIsDeleting(true);
         const res = await axios.delete(`${api}/api/user/deleteaccount`);
         toast.success(res.data.message);
         logout();
        }
        catch(error)
        {
         toast.error(error.response?.data?.message || "Failed to delete profile");
        }
        finally
        {
            setIsDeleting(false)
        }
      }


    }
    const handlePasswordChange = async (e) =>
    { e.preventDefault();
        if(confirmedPassword!==newPassword)
        {
            toast.error("password does not match");
            return;
        }
        else
        {
            try
            {
                setIsUpdating(true);
                const res = await axios.put(`${api}/api/user/changepassword`,{currentPassword,newPassword});
                toast.success(res.data.message);
            }
            catch(error)
            {
             toast.error(error.response?.data?.message || "Failed to change password");
            } 
            finally
            {
                setIsUpdating(false);
            }
         }
    }


    if(isLoading || isFetchingAddress) return (
        <div className='flex h-screen items-center justify-center text-lg font-medium text-gray-600'>
            Loading profile info
        </div>
    )
        
 return (
  <div className="min-h-screen bg-gray-100 py-10">
    <div className="mx-auto max-w-6xl space-y-8 px-4">

      {/* Profile Header */}
      <div className="rounded-xl bg-white p-8 shadow-md">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <img
            src={user.profileImage ?? defaultImage}
            alt="Profile"
            className="h-28 w-28 rounded-full border-4 border-blue-500 object-cover"
          />

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {user.userName}
            </h1>

            <p className="mt-1 text-gray-500">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-xl bg-white p-8 shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Change Password
        </h2>

        <form
          onSubmit={handlePasswordChange}
          className="space-y-4"
        >
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={isUpdating}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isUpdating ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </div>

      {/* Address */}
      <div className="rounded-xl bg-white p-8 shadow-md">
        {(!userAddress || isEditing) ? (
          <>
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">
              {isEditing ? "Edit Address" : "Add Address"}
            </h2>

            <form
              onSubmit={handleAddressSubmit}
              className="grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleAddressChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={address.phone}
                  onChange={handleAddressChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-medium text-gray-700">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={address.addressLine1}
                  onChange={handleAddressChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-medium text-gray-700">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={address.addressLine2}
                  onChange={handleAddressChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={address.postalCode}
                  onChange={handleAddressChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Country
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 outline-none">
                  <option>Country List</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  disabled={isSubmittingAddress}
                  className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {isSubmittingAddress ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">
                Saved Address
              </h2>

              <button
                onClick={handleEditing}
                className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
              >
                Edit Address
              </button>
            </div>

            <div className="grid gap-4 rounded-lg bg-gray-50 p-6 md:grid-cols-2">
              <p><span className="font-semibold">Full Name:</span> {userAddress.fullName}</p>
              <p><span className="font-semibold">Phone:</span> {userAddress.phone}</p>
              <p><span className="font-semibold">Address Line 1:</span> {userAddress.addressLine1}</p>
              <p><span className="font-semibold">Address Line 2:</span> {userAddress.addressLine2}</p>
              <p><span className="font-semibold">City:</span> {userAddress.city}</p>
              <p><span className="font-semibold">Postal Code:</span> {userAddress.postalCode}</p>
              <p><span className="font-semibold">State:</span> {userAddress.state}</p>
            </div>
          </>
        )}
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-red-600">
          Danger Zone
        </h2>

        <form
          onSubmit={handleProfileDeletion}
          className="space-y-4"
        >
          <p className="text-gray-600">
            Type <span className="font-bold text-red-600">DELETE</span> to permanently remove your account.
          </p>

          <input
            type="text"
            onChange={(e) => setAccountConfirmDeletion(e.target.value)}
            className="w-full rounded-lg border border-red-300 px-4 py-3 outline-none focus:border-red-500"
          />

          <button
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:bg-red-300"
          >
            {isDeleting ? "Deleting Account..." : "Delete Account"}
          </button>
        </form>
      </div>

      {/* Logout */}
      <div className="flex justify-end">
        <button
          onClick={logout}
          className="rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white transition hover:bg-black"
        >
          Logout
        </button>
      </div>

    </div>
  </div>
)}