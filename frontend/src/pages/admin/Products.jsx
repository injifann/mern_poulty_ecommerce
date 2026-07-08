import axios from '../../api/axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import ProductForm from '../../components/Forms/ProductForm';
import LoadingScreen from '../../layout/LoadingScreen';
export default function Products() {

     const [products,setProducts] = useState([]);
     const [isFetchingProducts,setIsFetchingProducts] = useState(false);
     const [isLoadingMore,setIsLoadingMore] = useState(false);
     const [page,setPage] = useState(1);
     const [deletingId,setdeletingId] = useState(null);
     const [isaddProduct,setIsAddProduct] = useState(false);
     const [isUpdateProduct,setIsUpdateProduct] = useState(false);
     const [updatedProduct,setupdatedProduct] = useState(null);

     const fetchProducts = async (pageNumber,replace=false) =>
     {
       try
       {
        setIsFetchingProducts(true);
        const res = await axios.get(`/api/admin/getProducts?page=${pageNumber}&limit=10`);
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
     useEffect(()=>{fetchProducts(1,true)},[])
    const searchProduct = ()=>
    {

    }

    const handleProductDeletion = async (productId)=>
    {
       try
       {
         setdeletingId(productId);
         await axios.delete(`${api}/api/admin/deleteproduct/${productId}`)
         setProducts((prev)=>prev.filter((product)=>product._id!==productId));
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
     setPage(nextPage)
     setIsLoadingMore(true);
     await fetchProducts(nextPage);
     setIsLoadingMore(false)
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

        <input
          type="search"
          placeholder="Search products..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none transition focus:border-blue-500 md:w-80"
          onChange={searchProduct}
        />
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
                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => handleProductUpdate(product)}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        Update
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
                          : "Delete"}
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

    </div>
  </div>
)}
