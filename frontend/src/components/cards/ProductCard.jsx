import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { Rating } from "../common/Rating";
import {useCart} from '../../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart,cartLoading} = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAddintToCart,setIsAddingToCart] = useState(false);
  const [addingId,setAddingId] = useState(null)

  const controlQuantity = (increment) => {
    if (quantity + increment < 1) return;
    setQuantity(quantity + increment);
  };
  const handleAddToCart = async(quantity,id) => {

       setAddingId(id);
       const res = await addToCart(product,quantity);
       setAddingId(false)
       if(res.success)
       {
        toast.success(res.message);
        setQuantity(1);
       }
       else 
       {
        toast.error(res.message);
       }
  }

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/product/${product.sku}`}>
        {/* Product Image */}
        <div className="overflow-hidden bg-gray-100">
          <img
            src={product.images[0].url}
            alt={product.title}
            className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-3 p-5">
          <h2 className="line-clamp-1 text-lg font-semibold text-gray-800">
            {product.title}
          </h2>

          <div className="flex items-center gap-2">
            {product.averageRating ? (
              <>
                <Rating rating={product.averageRating} />
              </>
            ) : (
              <span className="text-sm text-gray-400">No rating yet</span>
            )}
          </div>

          <p className="line-clamp-2 text-sm text-gray-600">
            {product.description}
          </p>

          <p className="text-2xl font-bold text-indigo-600">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 p-5">
        {/* Quantity */}
        <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
          <button
            onClick={() => controlQuantity(-1)}
            className="px-3 py-2 text-lg font-semibold transition hover:bg-gray-100"
          >
            −
          </button>

          <input
            type="number"
            value={quantity}
            min={1}
            onChange={(e) =>
              setQuantity(
                Number(e.target.value) > 0
                  ? Number(e.target.value)
                  : quantity
              )
            }
            className="w-14 border-x border-gray-300 text-center outline-none"
          />

          <button
            onClick={() => controlQuantity(1)}
            className="px-3 py-2 text-lg font-semibold transition hover:bg-gray-100"
          >
            +
          </button>
        </div>

        {/* Add to Cart */}
        <button
          onClick={() => handleAddToCart(quantity,product._id)} disabled={product.status === "out_of_stock" || product._id ===addingId}
          className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white transition hover:bg-indigo-700 active:scale-95 disabled:bg-black whitespace-nowrap"
        >
         {product._id===addingId?"adding...":"add to cart"}
        </button>
      </div>
    </div>
  );
}