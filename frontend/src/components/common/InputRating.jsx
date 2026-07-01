import { useState } from "react"
import { FaStar,FaRegStar } from "react-icons/fa"
import axios from '../../api/axios'
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const api = import.meta.env.VITE_API_URL;

export const InputRating = ({productID}) =>{
    const {user} = useAuth();
    const [rating,setRating] = useState(0);
    const [isRating,setIsRating] = useState(false)

    const handlesubmit = async () =>
    {
      if(!user)
      {
        toast.error("You must be logged in to submit a rating");
        return;
      }
      try
      {
        setIsRating(true);
        const res = await axios.post(`${api}/api/products/rateproduct/${productID}`,{rating:rating});
        setRating(res.data.rating);
        toast.success(res.data.message);

      }
      catch(error)
      {
        toast.error(error.response?.data?.message || "Failed to submit rating")
      }
      finally
      {
        setIsRating(false);
      }
    }
    return (
  <div className="space-y-4">
    {/* Star Rating */}
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) =>
        rating >= star ? (
          <FaStar
            key={star}
            onClick={() => setRating(star)}
            className="cursor-pointer text-3xl text-yellow-400 transition hover:scale-110"
          />
        ) : (
          <FaRegStar
            key={star}
            onClick={() => setRating(star)}
            className="cursor-pointer text-3xl text-gray-400 transition hover:scale-110 hover:text-yellow-400"
          />
        )
      )}
    </div>

    {/* Selected Rating */}
    <p className="text-sm text-gray-600">
      {rating === 0
        ? "Select a rating"
        : `You selected ${rating} out of 5`}
    </p>

    {/* Submit Button */}
    <button
      onClick={handlesubmit}
      disabled={isRating || rating === 0}
      className="rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {isRating ? "Submitting..." : "Submit Rating"}
    </button>
  </div>
)}
