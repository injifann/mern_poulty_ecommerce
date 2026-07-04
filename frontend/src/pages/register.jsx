import React, { useEffect, useState } from 'react'
import { Link } from 'react-router';
import {GoogleLogin} from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
    const {register,googleAuth,isLoading} = useAuth();
    const [formData,setFormData] = useState({userName:'',email:'',password:''});

    const handleSubmission = (e) =>
    {
     e.preventDefault();
     if(isLoading)
      {
        return
      }
     if(!formData.email || !formData.password || !formData.userName)
     {
        toast.error("all fields are required");
        return;
     }
     else 
     {
        register(formData);
     }
    } 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create Account
        </h2>
        <p className="text-center text-gray-500 text-sm mt-1">
          Sign up to get started
        </p>

        {/* Form */}
        <form onSubmit={handleSubmission} className="mt-6 space-y-4">

          <div>
            <label className="text-sm text-gray-600">Username</label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e)=>setFormData((prev)=>({...prev,userName:e.target.value}))}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your username"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e)=>setFormData((prev)=>({...prev,email:e.target.value}))}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e)=>setFormData((prev)=>({...prev,password:e.target.value}))}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <input
            type="submit"
            value={isLoading ? "Registering..." : "Register"}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
          />
        </form>

        {/* Login link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?
            <Link
              to="/login"
              className="ml-1 text-blue-600 font-medium hover:text-blue-700 hover:underline transition"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse)=>googleAuth(credentialResponse)}
            onError={()=>{toast.error("Google registration failed")}}
          />
        </div>

      </div>
    </div>
  )
}