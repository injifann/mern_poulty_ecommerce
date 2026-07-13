import React from 'react'
import { useState } from 'react'
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import LoadingScreen from '../../layout/LoadingScreen';
import { use } from 'react';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import BackButton from '../../components/common/BackButton';

export default function ControllUser() 
{
    const {user} = useAuth();
    const [users,setUsers] = useState([]);
    const [page,setPage] = useState(1);
    const [loading,setLoading] = useState(true);
    const [deletingId,setDeletingId] = useState(null);
    const [updatingId,setUpdatingId] = useState(null);
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(()=>{fetchUsers(1,true)},[])
    const fetchUsers = async (nextPage,replace=false)  =>
    {
      try
      {
         setLoading(true);
      const params = new URLSearchParams({
        page: nextPage,
        limit: 10,
      });

      if (userName.trim()) {
        params.append("userName", userName);
      }

      if (email.trim()) {
        params.append("email", email);
      }
      

      const res = await axios.get(`/api/admin/getusers?${params.toString()}`);
         setUsers(prev=>replace?res.data.users:[...prev,...res.data.users]);
      }
      catch(error)
      {
        toast.error(error.response?.data?.message || "failed to load users");
      }
      finally
      {
         setLoading(false);
      }
    }
    const handleSearch = async () =>
       {
        setPage(1);
        await fetchUsers(1, true);
      };
    const handleReset = async () => {
      setUserName("");
      setEmail("");
      setPage(1);
      await fetchUsers(1, true);
    };
    const handleStatus = async(id) =>
    {
        setUpdatingId(id);
        try
        {
         const res = await axios.put(`/api/admin/changeuserstatus/${id}`);
         setUsers((prev)=>prev.map((user)=>
            user._id===id? {...user,isActive:!user.isActive}:user
         ))
         toast.success(res.data.message)
        }
        catch(error)
        {
         toast.error(error.response?.data?.message || "something went wrong");
        }
        finally
        {
            setUpdatingId(null);
        }
    }
    const handleDelete=async(id)=>
    { 
        if(!window.confirm("Are you sure you want to delete this user"))
        {
            return;
        }
        setDeletingId(id);
        try
        {
         const res = await axios.delete(`api/admin/deleteuser/${id}`);
         setUsers((prev)=>prev.filter((user)=>user._id!==id));
         toast.success(res.data.message);
        }
        catch(error)
        {
         toast.error(error.response?.data?.message || "something went wrong");
        }
        finally
        {
            setDeletingId(null);
        }

    }
    const handleLoadMore = async () =>
    {
     const nextPage = page + 1;
     setPage(nextPage);
     await fetchUsers(nextPage);
    }

    if(loading) return (
        <LoadingScreen message='Loading users'/>
    )
 return (
  <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Registered Users
      </h2>
        {/* Search Section */}
        <div className="mb-8 rounded-xl bg-white p-5 shadow-md">
          <div className="grid gap-4 md:grid-cols-2">

            <input
              type="text"
              placeholder="Search by username..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="rounded-lg border px-4 py-2 outline-none focus:border-green-600"
            />

            <input
              type="email"
              placeholder="Search by email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border px-4 py-2 outline-none focus:border-green-600"
            />
          </div>

          <div className="mt-4 flex gap-3">

            <button
              onClick={handleSearch}
              className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
            >
              Search
            </button>

            <button
              onClick={handleReset}
              className="rounded-lg border px-5 py-2 hover:bg-gray-100"
            >
              Reset
            </button>

          </div>
        </div>
      <div className="space-y-5">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {user.userName}
              </h3>

              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {user.email}
              </p>

              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  user.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex gap-3 mt-5 md:mt-0">
              <button
                onClick={() => handleStatus(user._id)}
                disabled={updatingId === user._id}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  user.isActive
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-600 hover:bg-green-700"
                } disabled:opacity-50`}
              >
                {updatingId === user._id
                  ? "Updating..."
                  : user.isActive
                  ? "Deactivate"
                  : "Activate"}
              </button>

              <button
                onClick={() => handleDelete(user._id)}
                disabled={deletingId === user._id}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50"
              >
                {deletingId === user._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
       <BackButton to={"/admin/dashboard"}/>
      </div>
    </div>
  </div>
)}