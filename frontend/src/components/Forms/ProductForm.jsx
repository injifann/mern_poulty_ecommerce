import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import LoadingScreen from '../../layout/LoadingScreen';

export default function ProductForm({product,setProducts, setIsUpdateProduct,setIsAddProduct}) {
  
    const [productData,setProductData] = useState(product || {title:"",description:"",price:"",quantity:"",category:"",images:[]});
    const [isAddingProduct,setIsAddingProduct] = useState(false);
    const [categories,setCategories] = useState([]);
    const [isFetchingCategories,setIsFetchingCategories] = useState(true)

    useEffect(()=>
      {
     const fetchCategories =async() =>
     {
      try
      {
        setIsFetchingCategories(true);
        const res = await axios.get("api/category/getAllCategory");
        setCategories(res.data.categories);
      }
      catch(error)
      {
        toast.error(error.response?.data?.message)
      }
      finally
      {
       setIsFetchingCategories(false);
      }

     };
     fetchCategories()
    },[])

    const handleSubmit = async(e)=>
    {
        e.preventDefault();
        const validated = validateProductData();
        if(validated)
        {
        try
        {   const formData = new FormData();
            formData.append("title",productData.title);
            formData.append("description",productData.description);
            formData.append("price",productData.price);
            formData.append("quantity",productData.quantity);
            formData.append("category",productData.category);

            for (const image of productData.images)
            {
              formData.append("images",image)
            }

           setIsAddingProduct(true)
            if(product)
            {        
            const res = await axios.put(`/api/admin/updateproduct/${product._id}`,productData);
            setIsAddingProduct(false);
            setProducts(prev=>prev.map(p=>p._id===product._id?res.data.product:p));
            toast.success("product success fully updated");
            }
            else
            {
            const res = await axios.post("/api/admin/addproduct",formData);
            setIsAddProduct(false);
            setProducts(prev=>[...prev,res.data.product]);
             toast.success("product success fully updated");
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
 
   if(isFetchingCategories)
   {
    return (
      <LoadingScreen message='"fetching categories'/>
    )
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

             <select
              name="category"
              value={productData.category?._id || productData.category || ""}
              onChange={handleProductData}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">
                Select category
              </option>

              {categories?.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>
              ))}

            </select>
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
