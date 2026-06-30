import React, { useEffect } from 'react'
import Navbar from './components/common/Navbar'
import { Routes,Route, } from 'react-router'
import { useState } from 'react'
import toast from 'react-hot-toast';
import Home from './pages/Home';
import axios from 'axios'

  const api = import.meta.env.VITE_API_URL;

export default function App() {

  console.log(api);
  const [user,setUser] = useState(null);
  const [isLoadingUser,setIsloadingUser] = useState(true);
  const [isLoadingProduct,setIsloadingProduct] = useState(true);
  const [products,setProducts] = useState([]);

  useEffect(()=>{

    const token = localStorage.getItem("token");

    const fetchUser = async () =>{
      try 
      {
      if(token)
      {
       const res = await axios.get(`${api}/api/user/me`,{
        headers:{Authorization:`Bearer ${token}`}
       });
       console.log("token")
       localStorage.setItem("token",res.data.token);
       console.log(res.data);
       setProduct(res.data.user);
      }
      }
      catch (error)
      {
        toast.error(error.response?.data?.message || "error fetching user data");
      }
      finally{
        setIsloadingUser(false);
      }
      
    }
  fetchUser() },[])


  useEffect(()=>{
     const fetchProduct = async ()=>
    {
       try
       {
          const res = await axios.get(`${api}/api/product/products`);
          console.log(res.data.products);
          setProducts(res.data);
       }
       catch(error)
       {
            toast.error(error.response?.data?.message || " failed to fetch products");
       }
       finally
       {
        setIsloadingProduct(false);
       }
    }
    fetchProduct();

  },[])

  if(isLoadingProduct || isLoadingUser )
  {
    return <div>Loading data</div>
  }
  return (
    <>
      <Navbar isLoggedIn={true}>
      </Navbar> 

      <Routes>
        <Route path='/' element ={<Home user ={user} products ={products}/>}/>
      </Routes> 
  </>
  )
}
