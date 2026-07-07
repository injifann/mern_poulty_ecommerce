import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import userProfile from "../../assets/secondaregg.png";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router";
import toast from "react-hot-toast";
import AddressCard from "../../components/cards/AddressCard";
import { useNavigate } from "react-router";

export default function Profile() {
  const { user, isLoading, logout } = useAuth();
  const [userAddress, setUserAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordDelete,setPasswordDelete] = useState();
  const [isDeletingAccount,setIsDeletingAccount] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmedPassword: "",
  });

  const fetchUserAddress = async() =>
  {
    if(isLoading)
    {
      return
    }
    try
    {
      const res = await axios.get("api/address/getmyaddress");
      setUserAddress(res.data.address);
    }
    catch(error)
    {
      toast.error(error.response?.data?.message || "Failed to fetch user address")
    }
  }
  useEffect(()=>{fetchUserAddress()},[user])
  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    const validated = validatePasswordData();

    if (!validated) return;

    try {
      setIsChangingPassword(true);
      console.log(user._id);

      const res = await axios.put(
        "/api/user/changepassword",{currentPassword:passwordData.currentPassword , newPassword:passwordData.newPassword}
      );

      toast.success(res.data.message);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmedPassword: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change password."
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validatePasswordData = () => {
    const fields = [
      "currentPassword",
      "newPassword",
      "confirmedPassword",
    ];

    for (const field of fields) {
      if (!passwordData[field]) {
        toast.error(`${field} is required.`);
        return false;
      }
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmedPassword
    ) {
      toast.error("Passwords do not match.");
      return false;
    }

    return true;
  };
  const handleProfileDeletion = async(e)=>
  {
    e.preventDefault()
    if(passwordDelete !=="DELETE")
    {
      toast.error("please type DELETE to delete your profile");
      return
    }
    else
    {
      try
      {
        setIsDeletingAccount(true);
        const res = await axios.delete("api/user/deleteprofile");
        localStorage.removeItem("token");
        toast.success(res.data.message);
        navigate("/")
        
      }
      catch(error)
      {
        toast.error(error.response?.data?.message || "Failed to delete user profile");
      }
      finally
      {
        setIsDeletingAccount(false)
      }
    }
  }

  if(!user)
  {
    return (
      <div className="flex h-screen items-center justify-center text-lg font-semibold">
        please login to access your profile
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">

      {/* Profile */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center gap-6">

        <img
          src={user?.profileImage??userProfile}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {user?.userName}
          </h1>

          <p className="text-gray-600 mt-2">
            {user?.email}
          </p>

          <Link
            to="/orders"
            className="inline-block mt-5 text-blue-600 hover:underline font-medium"
          >
            View Your Orders
          </Link>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-5">
          Change Password
        </h2>

        <form
          onSubmit={handlePasswordChange}
          className="space-y-4"
        >

          <input
            type="password"
            name="currentPassword"
            placeholder="Current password"
            value={passwordData.currentPassword}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New password"
            value={passwordData.newPassword}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="password"
            name="confirmedPassword"
            placeholder="Confirm new password"
            value={passwordData.confirmedPassword}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <button
            disabled={isChangingPassword}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isChangingPassword
              ? "Updating..."
              : "Change Password"}
          </button>

        </form>

      </div>

      {/* Address */}
      <div className="bg-white rounded-xl shadow p-6">

        <div className="flex items-center justify-between mb-5">

          <h2 className="text-xl font-semibold">
            Shipping Address
          </h2>

          {userAddress && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>
          )}

        </div>

        {userAddress ? (
          <div className="space-y-1 text-gray-700">

            <p>{userAddress.fullName}</p>
            <p>{userAddress.addressLine1}</p>

            {userAddress.addressLine2 && (
              <p>{userAddress.addressLine2}</p>
            )}

            <p>
              {userAddress.city}, {userAddress.state}
            </p>

            <p>{userAddress.phone}</p>

          </div>
        ) : (
          <p className="text-gray-500">
            No address has been added yet.
          </p>
        )}

        {(isEditing || !userAddress) && (
          <div className="mt-6">
            <AddressCard
              userAddress={userAddress}
              setUserAddress={setUserAddress}
            />
          </div>
        )}

      </div>
    <div className="mt-10 rounded-xl border border-red-300 bg-red-50 p-6">

    <h2 className="text-2xl font-bold text-red-700">
        Danger Zone
    </h2>

    <p className="mt-2 text-gray-700">
        Deleting your account is permanent. Your profile, orders,
        and other associated data cannot be recovered.
    </p>

    <form
        onSubmit={handleProfileDeletion}
        className="mt-6 space-y-4"
    >
        <div>
            <label className="mb-2 block font-medium text-gray-700">
                Type <span className="font-bold text-red-600">DELETE</span> to
                confirm
            </label>

            <input
                type="text"
                value={passwordDelete}
                onChange={(e) => setPasswordDelete(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
            />
        </div>

        <button
            type="submit"
            disabled={
                isDeletingAccount ||
                passwordDelete !== "DELETE"
            }
            className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
        >
            {isDeletingAccount
                ? "Deleting Account..."
                : "Delete Account"}
        </button>
    </form>

</div>

      {/* Logout */}
      <div className="flex justify-end">

        <button
          onClick={logout}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>

      </div>

    </div>
  );
}