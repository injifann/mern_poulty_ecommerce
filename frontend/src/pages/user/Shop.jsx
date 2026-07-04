import React, { useEffect, useState } from 'react'
import { useCart } from '../../context/CartContext'
import ProductCard from '../../components/cards/ProductCard'
import axios from 'axios'
import toast from 'react-hot-toast'

const api = import.meta.env.VITE_API_URL

export default function Shop() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [isProductLoading, setIsProductLoading] = useState(true)

  const fetchProducts = async () => {
    setIsProductLoading(true)
    setError('')

    try {
      const res = await axios.get(`${api}/api/products/getallproducts`)
      setProducts(res.data.products)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load products")
    } finally {
      setIsProductLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Loading State
  if (isProductLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading products...
          </p>
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Something went wrong
          </h2>

          <p className="text-gray-600 mb-6">{error}</p>

          <button
            onClick={fetchProducts}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Empty State
  if (!isProductLoading && products.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            No products found
          </h2>
          <p className="text-gray-500">
            Try refreshing or check back later
          </p>

          <button
            onClick={fetchProducts}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  // Main UI
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-4">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Our Products
          </h1>
          <p className="text-gray-500 mt-2">
            Discover amazing items at great prices
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              product={product}
              key={product._id}
            />
          ))}
        </div>

      </div>
    </div>
  )
}