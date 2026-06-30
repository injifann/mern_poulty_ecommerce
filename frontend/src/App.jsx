import React, { useEffect } from 'react'
import Navbar from './components/common/Navbar'
import { Routes,Route, } from 'react-router'
import { useState } from 'react'
import toast from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import axios from 'axios'

  const api = import.meta.env.VITE_API_URL;

export default function App() {
  return (
    <>
      <Navbar>
      </Navbar> 

      <Routes>
        <Route path='/' element ={<Home/>}/>
        <Route path='/login' element ={<Login/>}/>
      </Routes> 
  </>
  )
}
