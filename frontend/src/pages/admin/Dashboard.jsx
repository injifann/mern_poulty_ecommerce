import axios from '../../api/axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../../layout/LoadingScreen';

export default function Dashboard() {
    const {isLoading} = useAuth()
    const [stats,setStats] = useState(null);
    const [isLoadingStats,setIsLoadingStats] = useState(true);


    const fetchStats = async ()=>
    {
        if(isLoading)
        {
            return
        }
        else
        {
        try
        {
            const res = await axios.get(`api/admin/getstats`);
            setStats(res.data.stats);
        }
        catch(error)
        {
         toast.error(error.response?.data?.message || "failed to load stats");
        }
        finally
        {
            setIsLoadingStats(false)
        }
    }

    }

    useEffect(()=>{fetchStats()},[isLoading])
    if(isLoading)
         {
        return (
        <LoadingScreen message={"Loading"}/>
        )
    }
        
    if(isLoadingStats)
    {  
       return (
        <LoadingScreen message={"Loading Admin dashboard"}/>
        )
    }

  return (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-6xl mx-auto">

      {/* HEADER */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Admin Dashboard
      </h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="bg-white shadow-sm rounded-xl p-6 border hover:shadow-md transition">
          <h2 className="text-gray-500 text-sm">Total Products</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {stats?.totalProducts}
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-6 border hover:shadow-md transition">
          <h2 className="text-gray-500 text-sm">Total Categories</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {stats?.totalCategories}
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-6 border hover:shadow-md transition">
          <h2 className="text-gray-500 text-sm">Registered Users</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {stats?.totalUsers}
          </p>
        </div>

      </div>

      {/* MANAGEMENT SECTION */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* PRODUCTS */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Products
          </h2>

          <Link
            to="/admin/products"
            className="block text-blue-600 hover:underline mb-2"
          >
            Manage Products
          </Link>
        </div>

        {/* CATEGORIES */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Categories
          </h2>

          <Link
            to="/admin/categories"
            className="block text-blue-600 hover:underline mb-2"
          >
            Manage Categories
          </Link>
        </div>

        {/* USERS */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Users
          </h2>

          <Link
            to="/admin/manageusers"
            className="block text-blue-600 hover:underline mb-2"
          >
            Manage Users
          </Link>
        </div>

      </div>
    </div>
  </div>
)}