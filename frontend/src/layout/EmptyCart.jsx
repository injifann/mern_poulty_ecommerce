import React from 'react'
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from 'react-router';

export default function EmptyCart({cart}) 
{
  const navigate = useNavigate();

  return(
  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white py-16 px-6 text-center shadow-sm">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
        <FaShoppingCart className="text-4xl text-blue-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
        {!cart? "You do not have cart":"Your cart is empty"} 
        </h2>

        <p className="mt-2 max-w-md text-gray-500">
        Looks like you haven't added any products yet. Start shopping and add
        your favorite products to your cart.
        </p>

        <button
        onClick={() => navigate("/shop")}
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 hover:shadow-lg"
        >
        Continue Shopping
        </button>
     </div>
  )
}
