import axios from '../../api/axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import ProductForm from '../../components/Forms/ProductForm';
import LoadingScreen from '../../layout/LoadingScreen';
import BackButton from '../../components/common/BackButton';
import { FaTrash } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';

export default function Products() {

     const [products,setProducts] = useState([]);
     const [isFetchingProducts,setIsFetchingProducts] = useState(false);
     const [isLoadingMore,setIsLoadingMore] = useState(false);
     const [page,setPage] = useState(1);
     const [deletingId,setdeletingId] = useState(null);
     const [isaddProduct,setIsAddProduct] = useState(false);
     const [isUpdateProduct,setIsUpdateProduct] = useState(false);
     const [updatedProduct,setupdatedProduct] = useState(null);
     const [filters,setFilters] = useState({search:"",sort:"",category:""});
     const [searchingText,setSearchingText] = useState("");
     const [replace,setReplace] = useState(true);
     const [categories,setCategories] = useState([]);

     const fetchProducts = async () =>
     {
       try
       {
        setIsFetchingProducts(true);
        const res = await axios.get(`/api/admin/getProducts` ,{
          params:{
           page:page,
           limit:10,
           ...filters,
          }
        });
        setProducts(prev=>replace?res.data.products:([...prev,...res.data.products]))
       }
       catch(error)
       {
        toast.error(error.response?.data?.message || "Failed to Load products"
        )
       }
       finally
       {
        setIsFetchingProducts(false);
       }
     }
     useEffect(()=>{fetchProducts()},[filters])
     useEffect(()=>{
      const fetchCategories = async()=>
      {
        try
        {
          const res = await axios.get("api/category/getallcategory");
          setCategories(res.data.categories);
        }
        catch(error)
        {
         console.log("error");
        }
      }
      fetchCategories();
     },[])

    const searchProduct = ()=>
    {
      setPage(1);
      setReplace(true)
      setFilters(prev=>({...filters,search:searchingText}));
    }

    const handleProductDeletion = async (productId)=>
    {
       try
       {
        if(!window.confirm("are you sure to delete this product"))
        {
          return;
        }
         setdeletingId(productId);
         await axios.delete(`/api/admin/deleteproduct/${productId}`)
         setProducts((prev)=>prev.filter((product)=>product._id!==productId));
         toast.success("product success fully deleted");
       }
       catch(error)
       {
        toast.error(error.response?.data?.message || "Failed to delete products");
       }
       finally
       {
        setdeletingId(null)
       }
    }
    
    const handleProductUpdate = (product)=>
    {
      setIsUpdateProduct(true)
      setupdatedProduct(product);
    }
    const handleLoadMore = async()=>
    {
     const nextPage = page + 1;
     setPage(nextPage);
     setReplace(false);
     setIsLoadingMore(true);
     await fetchProducts(nextPage);
     setIsLoadingMore(false)
    }
    
    const handleFilter = async (e)=>
    {
      setPage(1);
      setReplace(true);
      setFilters(prev=>({...filters,category:e.target.value}));
    }
    const handleSort = async (e)=>
    {
     setPage(1);
     setReplace(true);
     setFilters(prev=>({...filters,sort:e.target.value}))  
    }
    if(isFetchingProducts || isLoadingMore)return (
    <LoadingScreen message={"Loading fresh products..."}/>
    )
 return (
  <div className="min-h-screen bg-gray-100 p-6">
    <div className="mx-auto max-w-7xl">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Products
          </h1>
          <p className="mt-1 text-gray-500">
            Manage your store products.
          </p>
        </div>
         <div className='flex items-center gap-2'>
        <input
          type="search"
          placeholder="Search products..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none transition focus:border-blue-500 md:w-80"
          onChange={(e)=>setSearchingText(e.target.value)}
        />
        <button onClick={searchProduct} className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 active:scale-95">
           <FaSearch/>
        </button>
      </div>
      </div>

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

            {categories?.map(category => (
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

      <div>
        <button onClick={()=>setIsAddProduct(true)} className='rounded-md bg-green-600 px-4 py-2 my-2 text-sm font-medium text-white transition hover:bg-green-700'>addProduct</button>
      </div>
       {isaddProduct &&(<ProductForm setProducts={setProducts} setIsAddProduct={setIsAddProduct}/>)}
      {isUpdateProduct &&(<ProductForm product ={updatedProduct} setProducts={setProducts}  setIsUpdateProduct={setIsUpdateProduct}/>)}
       

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow">

        <div className="overflow-x-auto">
          <table className="min-w-full">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Product
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Quantity
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Category
                </th>
     
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Rating
                </th>
     

                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">

              {products?.map((product) => (
                <tr
                  key={product?._id}
                  className="transition hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {product?.title}
                  </td>

                  <td className="px-6 py-4">
                    {product?.quantity}
                  </td>

                  <td className="px-6 py-4">
                    {product?.category?.name}
                  </td>
                   <td className="px-6 py-4">
                    {product?.averageRating}
                  </td>


                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => handleProductUpdate(product)}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        <FaEdit/>
                      </button>

                      <button
                        onClick={() =>
                          handleProductDeletion(product?._id)
                        }
                        disabled={deletingId === product?._id}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === product?._id
                          ? "Deleting..."
                          : <FaTrash/>}
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

            </tbody>

          </table>
        </div>

      </div>

      {/* Load More */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoadingMore ? "Loading..." : "Load More"}
        </button>
      </div>
        <BackButton to={"/admin/dashboard"}/>
    </div>
  </div>
)}
