import React, { useEffect } from 'react'
import Navbar from './components/common/Navbar'
import { Routes,Route, } from 'react-router'
import { useState } from 'react'
import toast from 'react-hot-toast';
import Home from './pages/user/Home';
import Login from './pages/Login';
import Register from './pages/register';
import axios from 'axios'
import ProductDetails from './pages/user/ProductDetails';
import Cart from './pages/user/Cart';
import Shop from './pages/user/Shop';
import Dashboard from './pages/admin/Dashboard';
import { useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Profile from './pages/user/Profile';

export default function App() {
  
  return (
<>
      <Navbar/>
      <Routes>
        <Route path='/' element ={<Home/>}/>
        <Route path='/login' element ={<Login/>}/>
        <Route path='/register' element ={<Register/>}/>
        <Route path='/product/:id' element ={<ProductDetails/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/shop' element={<Shop/>}/>
        <Route path='/profile' element = {<Profile/>}/>
        <Route path='/admin/dashboard' element={<Dashboard/>}/>
      </Routes> 
</>
)
}
