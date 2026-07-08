import axios from '../../api/axios';
import React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast';

export default function CategoryForm({category, setCategories,categories,setIsAddingCategory,setIsUpdatingCategory})
 {
    const [categoryData,setCategoryData] = useState (category || {name:"",description:"",parent:""});
    const [isSubmitting,setIsSubmitting] = useState(false);

    const handleChange = (e) =>
    {
      setCategoryData((prev)=>{
        return {...prev,[e.target.name]:e.target.value};
      })
    }

    const validateData = () =>
    {
      if(category)
      {
        const changed = JSON.stringify(categoryData) !==JSON.stringify(category);
        if(!changed)
        {
          toast.error("no change detected");
          return false
        }
        return true
      }
      else
      {
        if(!categoryData.name)
        {
          toast.error("category name is required");
          return false
        }
        return true;
      }
    }
    const handleSubmit = async(e) =>
    {
      e.preventDefault();
       const validated = validateData();
       if(validated)
       {
        try
        {
          setIsSubmitting(true)
        if(category)
        {
          const res = await axios.put(`/api/category/updatecategory/${category._id}`,categoryData);
          setCategories(prev=>(prev.map(cat=>{
            return cat._id === category._id?res.data.category:cat
          })))
          setIsUpdatingCategory(false)
          toast.success("success fully updated category")
        }
        else
        {
         const res = await axios.post("/api/category/addcategory",categoryData);
          setCategories((prev)=>{
            return [...prev,res.data.category]
          })
          setIsAddingCategory(false)
          toast.success("success fully added category")
        }
       }
       catch(error)
       {
        toast.error(error.response?.data?.message || ( category?"Failed to update category ":"Failed to add category"))
       }
       finally
       {
        setIsSubmitting(false)
       }
      } 
    }
  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

      {/* Header */}
      <div className="border-b px-6 py-5">
        <h2 className="text-2xl font-bold text-gray-800">
          {category ? "Update Category" : "Add Category"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {category
            ? "Update the category information."
            : "Create a new product category."}
        </p>
      </div>


      <form
        onSubmit={handleSubmit}
        className="space-y-5 p-6"
      >

        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Category Name
          </label>

          <input
            type="text"
            name="name"
            value={categoryData.name}
            onChange={handleChange}
            placeholder="Enter category name"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>


        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Description
            <span className="ml-1 text-gray-400">
              (optional)
            </span>
          </label>

          <textarea
            name="description"
            value={categoryData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Describe this category..."
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>


        {/* Parent Category */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Parent Category
          </label>

          <select
            name="parent"
            value={categoryData.parent?._id || categoryData.parent || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          >

            <option value="">
              No Parent Category
            </option>

            {categories
              ?.filter(cat => cat._id !== category?._id)
              .map(cat => (
                <option
                  value={cat._id}
                  key={cat._id}
                >
                  {cat.name}
                </option>
              ))}

          </select>
        </div>


        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">

          <button
            onClick={()=>category?setIsUpdatingCategory(false):setIsAddingCategory(false)}
            type="button"
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>


          <button
            disabled={isSubmitting}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {
              isSubmitting
              ? "Saving..."
              : category
              ? "Update Category"
              : "Add Category"
            }
          </button>

        </div>

      </form>

    </div>

  </div>
)}