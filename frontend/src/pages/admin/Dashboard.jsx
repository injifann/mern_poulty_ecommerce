import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
const api = import.meta.env.VITE_API_URL;

export default function Dashboard()
 {
   const [newCategoryData,setNewCategoryData] = useState('');
   const [isFetchingCategory,setIsFetchingCategory] = useState(false);
   const [categories,setCategory] = useState(null);
   const [isCreatingCategory,setIsCreatingCategory] = useState(false);

   const fetchCategory = async() =>
   {
    try
    { isFetchingCategory(true);
      const res = axios.get(`${api}/api/category/getallcategory`);
      setCategory(res.data.category);
    }
    catch(error)
    {
     toast.error(error.response?.data?.message || "failed to Fetch category");
    }
    finally
    {
        isFetchingCategory(false);
    }
   }
   useEffect(()=>{fetchCategory()},[])

   const handleCategoryData = (e) =>
    {
        setNewCategoryData((prev)=>({...newCategoryData,[e.target.name]:e.target.value}))
    } 

    const handleCategoryCreation = async (e) =>
    {
        e.preventDefault();
        if(!newCategoryData.name)
        {
            return toast.error("Category name cannot be empty");
        }
        try
        {
         setIsCreatingCategory(true);
         const res = await axios.post(`${api}/api/addcategory`,{
            name:newCategoryData.name,
            description:newCategoryData.description??'',
            parent:newCategoryData.parent??''});
            fetchCategory();
        }
        catch(error)
        {
            toast.error(error.response?.data?.message || "Failed to create category");
        }
        finally
        {
         setIsCreatingCategory(false);
        }
    
    }

    if(isFetchingCategory ) return (
      
    <div className="flex h-screen items-center justify-center text-lg font-medium text-gray-600">
        fetching category....
    </div>

    )
  return (
    <div>
        <div>
          <h1>Controll stock products</h1>
          <button>Add product</button>
          <button>Update product</button>
          <button>Delete product</button>
        </div>
        <div>
            <div>
                <h1>Controll stock categories</h1>
                <h2>existing category</h2>
                {categories?.map((category)=>
                <div key={category._id}>
                <p>{category.name}</p>
                <p>{category.description??''}</p>
                <p>{category.parent.name??''}</p>
                </div>
                )}

            </div>
            <div>
                <h2>add category</h2>
                <form onSubmit={handleCategoryCreation}>
                    <label >Category Name</label>
                    <input type="text" id='categoryName' name='categoryName' value={newCategoryData.categoryName} onChange={handleCategoryData}/>
                    <label htmlFor="">Category Description(optional)</label>
                    <input type="text" id='categorydescription' name ="categorydescription" value={newCategoryData.categorydescription??''} onChange={handleCategoryData}/>
                    <label htmlFor="">Parent Category (optional)</label>
                    <input type="text" id='parent' name='parent' value={newCategoryData.categoryParent??''} onChange={handleCategoryData}/>
                    <button>Submitt</button>
                </form>
            </div>

        </div>

    </div>
  )
}
