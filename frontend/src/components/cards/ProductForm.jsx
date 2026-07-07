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
            const res = await axios.put("/api/admin/addproduct",productData);
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
          return {...prev,...images,[e.target.name]:e.target.files}
        }
        else
        {
            return {...prev,[e.target.name]:e.target.value}
        }
    })
   }
    return (
      <div>
        <h2>add product</h2>
        <form onSubmit={handleSubmit}>
          <label>Product title</label>
          <input type="text" name="title" value={productData.title } onChange={handleProductData}/>
          <label>Product description</label>
          <input type="text" name="description" value={productData.description} onChange={handleProductData}/>
          <label>Product price</label>
          <input type="number" name="price" value={productData.price} onChange={handleProductData}/>
          <label>Product quantity</label>
          <input type="number" name="quantity" value={productData.quantity} onChange={handleProductData}/>
          <label>Product category</label>
          <input type="" name="category" value={productData.category} onChange={handleProductData}/>
          <label>Product images</label>
          <input type="file" name='images' multiple onChange={handleProductData}/>
          <button disabled={isAddingProduct}>{product?"update product":"add product"}</button>
        </form>
      </div>
    )
}
