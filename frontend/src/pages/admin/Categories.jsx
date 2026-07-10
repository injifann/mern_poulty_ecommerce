import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import toast from 'react-hot-toast';
import CategoryForm from '../../components/Forms/CategoryForm'
import axios from '../../api/axios';
import LoadingScreen from '../../layout/LoadingScreen';
import BackButton from '../../components/common/BackButton';

export default function Categories() {
  const [categories,setCategories] = useState([]);
  const [isFetchingCategories,setIsFetchingCategories] = useState(true);
  const [deletingCategoryId,setDeletingCategoryId] = useState(null);
  const [isAddingCategory,setIsAddingCategory] = useState(false);
  const [isUpdatingCategory,setIsUpdatingCategory] = useState(false);
  const [updatedCategory,setUpdatedCategory] = useState({name:"",description:"",parent:""});


  useEffect(()=>{fetchCategories()},[])
  const fetchCategories = async ()=>
  {
    try
    {
      setIsFetchingCategories(true);
      const res = await axios.get("api/category/getAllCategory");
      setCategories(res.data.categories);
    }
    catch(error)
    {
       toast.error(error.response?.data?.message || "Failed to fetch categories");
    }
    finally
    {
      setIsFetchingCategories(false)

    }

  }
 const handleDelete = async (category)=>
 {
  try
  {
     setDeletingCategoryId(category._id);
     const res = await axios.delete(`api/category/deletecategory/${category._id}`);
     setCategories(prev=>prev.filter(cat=>cat._id!==category._id));
     toast.success(res.data.message);
  }
  catch(error)
  {
    toast.error(error.response?.data?.message || "Failed to fetch categories")
  }
  finally
  {
     setDeletingCategoryId(null);

  }
 }

 const handleCategoryUpdate  = (category) =>
  {
    setIsUpdatingCategory(true);
    setUpdatedCategory(category);
  } 

  if (isFetchingCategories) {
    return (
      <LoadingScreen message="Loading categories" />
    );
  }
  return (
  <div className="min-h-screen bg-gray-100 p-6">
    <div className="mx-auto max-w-7xl">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Categories
          </h1>

          <p className="mt-1 text-gray-500">
            Create and manage product categories.
          </p>
        </div>

        <button
          onClick={() => setIsAddingCategory(true)}
          className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700"
        >
          + Add Category
        </button>
      </div>

      {/* Forms */}
      {(isAddingCategory || isUpdatingCategory) && (
        <div className="mb-8">
          {isAddingCategory && (
            <CategoryForm
              setCategories={setCategories}
              categories={categories}
              setIsAddingCategory={setIsAddingCategory}
            />
          )}

          {isUpdatingCategory && (
            <CategoryForm
              category={updatedCategory}
              setCategories={setCategories}
              categories={categories}
              setIsUpdatingCategory={setIsUpdatingCategory}
            />
          )}
        </div>
      )}

      {/* Category List */}
      <div className="overflow-hidden rounded-xl bg-white shadow">

        <div className="border-b bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-700">
            All Categories
          </h2>
        </div>

        {categories.length === 0 ? (

          <div className="p-12 text-center text-gray-500">
            No categories found.
          </div>

        ) : (

          <div className="overflow-x-auto">
            <table className="min-w-full">

              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Name
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Description
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Parent
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">

                {categories?.map(category => (

                  <tr
                    key={category._id}
                    className="transition hover:bg-gray-50"
                  >

                    <td className="px-6 py-4 font-medium text-gray-800">
                      {category?.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {category?.description || "-"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {category.parent?.name || "None"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() => handleCategoryUpdate(category)}
                          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                          Update
                        </button>

                        <button
                          onClick={() => handleDelete(category)}
                          disabled={deletingCategoryId === category._id}
                          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingCategoryId === category._id
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

        )}

      </div>
       <BackButton to={"/admin/dashboard"}/>

    </div>
  </div>
)}
