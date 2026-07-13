import React, { useEffect } from 'react'
import Navbar from './layout/Navbar/Navbar'
import { Routes,Route, Navigate} from 'react-router'
import Home from './pages/user/Home';
import Login from './pages/Login';
import Register from './pages/register';
import ProductDetails from './pages/user/ProductDetails';
import Cart from './pages/user/Cart';
import Shop from './pages/user/Shop';
import Dashboard from './pages/admin/Dashboard';
import { useAuth } from './context/AuthContext';
import Profile from './pages/user/Profile';
import ProductList from './pages/admin/Products';  
import Categories from './pages/admin/Categories';
import ControllUser from './pages/admin/ControllUser'
import LoadingScreen from './layout/LoadingScreen';
import Order from './pages/user/Order';
import Footer from './layout/Footer';

export default function App() {
  
   const {user,isLoading} = useAuth();

  function AdminRoute({children})
  {
       if(user?.role !=="admin")
        {
          return <Navigate to = "/login"/>
        } 
        return children;
  }
  function UserRoute ({children})
  {
    if(user.role!=='client')
    {
       return <Navigate to = "/login"/>
    }
    return children
  }
  if(isLoading)
  {
    return <LoadingScreen message='Loading'/>
  }
  return (
<>
      <Navbar/>
      <Routes>
        <Route path='/' element ={<Home/>}/>
        <Route path='/login' element ={<Login/>}/>
        <Route path='/register' element ={<Register/>}/>
        <Route path='/product/:sku' element ={<ProductDetails/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/shop' element={<Shop/>}/>
        <Route path='/order' element={<Order/>}/>
        <Route path='/profile' element ={<UserRoute> <Profile/> </UserRoute>}/>
        <Route path='admin/dashboard' element = {<AdminRoute> <Dashboard/> </AdminRoute>} />
        <Route path='admin/products' element = {<AdminRoute> <ProductList/> </AdminRoute>} />
        <Route path='admin/manageusers' element = {<AdminRoute> <ControllUser/> </AdminRoute>} />
        <Route path='admin/categories' element = {<AdminRoute> <Categories/> </AdminRoute>} />
      </Routes> 
      <Footer/>
</>
)
}
