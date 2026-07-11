import React, { useEffect, useState } from 'react'
import { useCart } from '../../context/CartContext'
import ProductCard from '../../components/cards/ProductCard'
import { FaSearch } from 'react-icons/fa'
import axios from '../../api/axios'
import toast from 'react-hot-toast'


export default function Shop() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [page,setPage] = useState(1)
  const [categories,setCategories] = useState([]);
  const [replace,setReplace] = useState(true);
  const [searchingText,setSearchingText] = useState("");
  const [filters,setFilters] = useState({
    search:"",
    sort:"",
    category:"",
  })

  const fetchProducts = async () => {
    setIsProductLoading(true)
    setError('')
    try {
      const res = await axios.get(`/api/products/getallproducts`,{params:{
        page:page,
        limit:10,
       ...filters
      }})
      setProducts(prev=>replace?res.data.products:[...prev,...res.data.products]);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load products")
    } finally {
      setIsProductLoading(false)
    }
  }

  const fetchCategories = async()=>
  {
    try
    {
     const res = await axios.get("/api/category/getallcategory");
     setCategories(res.data.categories);
    }
    catch(error)
    {
     console.log(error);
    }
  }
  useEffect(() => {
    fetchProducts(1)
  }, [filters,page]);

  useEffect(()=>{fetchCategories()},[])

 const handleSearch = (e)=>
 {
  e.preventDefault();
  const search = searchingText.trim();
  if(!search)
  {
    toast.error("Please Enter what you want to search");
    return
  }
   resetProducts()
  setFilters(prev=>({...prev,search:search}))
 }

 const handleSort = (e)=>
 {
  const sortBy = e.target.value;
  console.log(sortBy);
  resetProducts()
  setFilters(prev=>({...prev,sort:sortBy}));

 }
 const handleFilter = (e)=>
 {
  const filterBy = e.target.value;
  console.log(filterBy);
  resetProducts()
  setFilters(prev=>({...prev,category:filterBy}));

 }

 const resetProducts = () => {
    setReplace(true);
    setPage(1);
};
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
  if (!isProductLoading && products?.length === 0) {
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
{/* Search & Filters */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        {/* Search */}
            <form
              onSubmit={handleSearch}
              className="flex flex-1 overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200"
            >
              <div className="flex items-center px-4 text-gray-400">
                <FaSearch />
              </div>

              <input
                type="text"
                value={searchingText}
                onChange={(e) => setSearchingText(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-2 py-3 outline-none"
              />

              <button
                type="submit"
                className="bg-blue-600 px-6 font-medium text-white transition hover:bg-blue-700"
              >
                Search
              </button>
            </form>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">

              {/* Sort */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">
                  Sort By
                </label>

                <select
                  value={filters.sort}
                  onChange={handleSort}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-blue-500"
                >
                  <option value="">Select Sort</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="highestRated">Highest Rated</option>
                </select>
              </div>

              {/* Category */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  value={filters.category}
                  onChange={handleFilter}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-blue-500"
                >
                  <option value="">All Categories</option>

                  {categories.map(category => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>
        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products?.map((product) => (
            <ProductCard
              product={product}
              key={product._id}
            />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => {
              setReplace(false);
              setPage(prev => prev + 1);
            }}
            className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700">
            Load More
          </button>
        </div>

      </div>
    </div>
  )
}