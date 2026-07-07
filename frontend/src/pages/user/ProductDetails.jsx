import React, { useState } from 'react'

import { useParams } from 'react-router'
import { useCart } from '../../context/CartContext';
import axios from '../../api/axios'
import toast from 'react-hot-toast';
import { InputRating } from '../../components/common/InputRating';
import { useEffect } from 'react';
import { Rating } from '../../components/common/Rating';
const api = import.meta.env.VITE_API_URL;

export default function ProductDetails() {
    const {id} = useParams();

    const [product,setProduct] = useState({});
    const {addToCart,cartLoading} = useCart();
    const [loading,setLoading] = useState(true);
    const [quantity,setQuantity] = useState(1);
    const [selectedImage,setSelectedImage] = useState(0);

  const handleAddToCart = async(quantity) => {
    
       const res = await addToCart(product,quantity);
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
    const controlQuantity = (increment) => {
    if (quantity + increment < 1) return;
    setQuantity(quantity + increment);
  };

  useEffect (()=>
  {
     setQuantity(1);
     setSelectedImage(0);
      const fetchProduct = async()=>
      {
         try
         { setLoading(true);
            const response = await axios.get(`${api}/api/products/product/${id}`);
            setProduct(response.data.product);
         }
         catch(error)
         {
          toast.error(error.response?.data?.message || "Failed to fetch product details")
         }
         finally
         {
            setLoading(false);
         }
      }
      fetchProduct();
  },[id])
  if(loading) return (
        <LoadingScreen message={"Loading product details"}/>
        )
if (!product._id)
{
    return (<div className="flex h-screen items-center justify-center text-lg font-medium text-gray-600">
        Loading  product details...
      </div>)
}
return (
  <div className="mx-auto max-w-7xl px-6 py-10">
    <div className="grid gap-10 lg:grid-cols-2">
      
      {/* LEFT SIDE: IMAGE + THUMBNAILS */}
      <div className="space-y-4">
        
        {/* Main Image */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
          <img
            src={product.images?.[selectedImage]?.url}
            alt={product.title}
            className="h-[450px] w-full object-cover transition duration-300 hover:scale-105"
          />
        </div>

        {/* Thumbnail Row (BELOW IMAGE) */}
        <div className="flex gap-2 overflow-x-auto">
          {product.images?.map((image, index) => (
            <button
              key={image._id || index}
              onClick={() => setSelectedImage(index)}
              className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border transition
                ${
                  selectedImage === index
                    ? "border-indigo-600 ring-2 ring-indigo-200"
                    : "border-gray-200 hover:border-gray-400"
                }`}
            >
              <img
                src={image.url}
                alt={image.alt || product.title}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: PRODUCT INFO */}
      <div className="flex flex-col justify-between">
        <div className="space-y-6">
          
          <span className="inline-block rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-700">
            {product.category?.name}
          </span>

          <h1 className="text-4xl font-bold text-gray-900">
            {product.title}
          </h1>

          <p className="text-4xl font-extrabold text-indigo-600">
            ${product.price?.toFixed(2)}
          </p>

          <p className="leading-8 text-gray-600">
            {product.description}
          </p>

          <div>
            <Rating rating={product.rating || 0} />
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Rate this Product
            </h3>
            <InputRating productID={product._id} />
          </div>
        </div>

        {/* Purchase Section */}
        <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Choose Quantity
          </h3>

          <div className="flex flex-wrap items-center gap-6">
            
            {/* Quantity */}
            <div className="flex items-center overflow-hidden rounded-lg border border-gray-300 bg-white">
              <button
                onClick={() => controlQuantity(-1)}
                className="px-3 py-2 text-lg font-semibold hover:bg-gray-100"
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
                className="px-3 py-2 text-lg font-semibold hover:bg-gray-100"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => handleAddToCart(quantity)}
              disabled={cartLoading || product.status === "out_of_stock"}
              className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cartLoading ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}