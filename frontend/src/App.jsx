import React, { useEffect } from 'react'
import Navbar from './components/common/Navbar'
import { Routes,Route, } from 'react-router'
import { useState } from 'react'
import toast from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/register';
import axios from 'axios'
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Shop from './pages/Shop';

  const api = import.meta.env.VITE_API_URL;

export default function App() {
  return (
    <>
      <Navbar>
      </Navbar> 

      <Routes>
        <Route path='/' element ={<Home/>}/>
        <Route path='/login' element ={<Login/>}/>
        <Route path='/register' element ={<Register/>}/>
        <Route path='/product/:id' element ={<ProductDetails/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/shop' element={<Shop/>}/>
      </Routes> 
  </>
  )
}
