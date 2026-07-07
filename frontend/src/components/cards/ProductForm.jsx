import React, { useState } from 'react'
import toast from 'react-hot-toast';
import axios from '../../api/axios';

export default function ProductForm({product,setProducts, setIsUpdateProduct,setIsAddProduct}) {
  
    const [productData,setProductData] = useState(product || {title:"",description:"",price:"",quantity:"",category:"",images:[]});
    const [isAddingProduct,setIsAddingProduct] = useState(false);

    const handleSubmit = async(e)=>
    {
        e.preventDefault();
        const validated = validateProductData();
        if(validated)
        {
        try
        {    setIsAddingProduct(true)
            if(product)
            {
            const res = await axios.put(`/api/admin/updateproduct/${product._id}`,productData);
            setIsAddingProduct(false);
            setProducts(prev=>[...prev,res.data.product]);
            }
            else
            {
            const res = await axios.post("/api/admin/addproduct",productData);
            setIsAddProduct(false);
            setProducts(prev=>[...prev,res.data.product]);
            }


        }
        catch(error)
        {
        toast.error(error.response?.data?.message || (product?"failed to update product":"Failed to add product"))
        }
        finally
        {
        setIsAddingProduct(false)
        }
       }
   }
   const validateProductData = ()=>
   {

        if(!product)
        {
        const productFields = ["title","description","price","quantity","category","images"];
        for (const field of productFields)
        {
            if(!productData[field])
            {
                toast.error(`product ${field} is required` );
                return
            }
        }
        return true;
        }
        else
        {
            const changed = JSON.stringify(productData) !==JSON.stringify(product);
            if(!changed)
            {
                toast.error("no changes detected");
                return false
            }
           return true;
        }
   }
   const handleProductData =(e)=>
   {
    setProductData((prev)=>{
        if(e.target.name==="images")
        {
          return {...prev,images:e.target.files}
        }
        else
        {
            return {...prev,[e.target.name]:e.target.value}
        }
    })
   }

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

    <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">

      {/* Header */}
      <div className="border-b px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {product ? "Update Product" : "Add New Product"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Fill in the product information below.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 p-6"
      >

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Product Title
          </label>

          <input
            type="text"
            name="title"
            value={productData.title}
            onChange={handleProductData}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Description
          </label>

          <textarea
            rows={3}
            name="description"
            value={productData.description}
            onChange={handleProductData}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleProductData}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Quantity
            </label>

            <input
              type="number"
              name="quantity"
              value={productData.quantity}
              onChange={handleProductData}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Category
          </label>

          <input
            type="text"
            name="category"
            value={productData.category?.name}
            onChange={handleProductData}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Product Images
          </label>

          <input
            type="file"
            name="images"
            multiple
            onChange={handleProductData}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-3 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">

          <button
            type="button"
            onClick={() => {
              if (product) {
                setIsUpdateProduct(false);
              } else {
                setIsAddProduct(false);
              }
            }}
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isAddingProduct}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isAddingProduct
              ? "Saving..."
              : product
              ? "Update Product"
              : "Add Product"}
          </button>

        </div>

      </form>

    </div>

  </div>
);}
