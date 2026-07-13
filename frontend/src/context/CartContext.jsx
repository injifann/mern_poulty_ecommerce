import {useState,useContext,createContext, useEffect} from 'react';
import { useAuth } from './AuthContext';
import axios from '../api/axios'
import { useDebugValue } from 'react';

const cartContext = createContext();

export const CartProvider = ({children})=>
{
    const [cart,setCart] = useState(null);
    const [cartLoading,setCartLoading] = useState(false);
    const {user} = useAuth();

    useEffect(()=>{
        const fetchCarts = async () =>
        {
        if(!user)
        {
            let localCart = JSON.parse(localStorage.getItem("cart"))
            if(localCart)
            {
                setCart(localCart);
            }
        }
        else if(user.role === 'admin')
        {
            return
        }
        else
        {
          try
          {
           setCartLoading(true);
           const res = await axios.get(`/api/cart/getmycart`);
           setCart(res.data.cart);
          }
          catch(error)
          {
            return {success:false,message:error.response?.data?.message || "failed to fetch your cart"}
          }
          finally
          {
           setCartLoading(false)
          }
        }
    };fetchCarts();
    },[user]);
    

    const saveCart =(Cart)=>
    {
      localStorage.setItem("cart",JSON.stringify(Cart))
      setCart({...Cart});
    }
    const updateCartTool = (Cart) =>
    {
    const items = Cart.items??[];
    return {...Cart,items,totalAmount:Cart.items.reduce((sum,item)=>sum + (item.priceAtTimeOfOrder * item.quantity),0),totalItems:Cart.items.reduce((sum,item)=>sum + item.quantity,0)}
    }

    const addToCart = async (product,quantity)=>

    {
        if(user)
        {
          try
          {
            setCartLoading(true);
            const res = await axios.post(`/api/cart/addtocart`,{productId:product._id,quantity:quantity});
            setCart(res.data.cart);
            return {success:true,message:"Product added to cart successfully"}

          }
          catch(error)
          {
            return {success:false,message:error.response?.data?.message || "failed to add product to cart"}
          }
          finally
          {
            setCartLoading(false);
          }
        }
        else
        {
            let localCart = JSON.parse(localStorage.getItem('cart')) || {items:[],totalAmount:0,totalItems:0};
            if(localCart.items.length > 0)
            {
             const existingProductIndex = localCart.items.findIndex((item)=>item.product._id===product._id);
             if(existingProductIndex !== -1)
             {
                localCart.items[existingProductIndex].quantity += quantity;
                const updated = updateCartTool(localCart);
                saveCart(updated);
                return {success:true,message:"Product added to cart successfully"}
             }
             else
             {
                localCart.items.push({product:product,quantity:quantity,priceAtTimeOfOrder:product.price});
                const updated = updateCartTool(localCart);
                saveCart(updated);
                return {success:true,message:"Product added to cart successfully"}
             }
            }
            else
            {
                localCart.items.push({product:product,quantity:quantity,priceAtTimeOfOrder:product.price});
                const updated = updateCartTool(localCart);
                saveCart(updated);
                return {success:true,message:"Product added to cart successfully"}
            }
        }
    }

    const removeFromCart = async (productId)=>
    {
        if(user)
        {
            try 
            {
             setCartLoading(true)
             const res = await axios.delete(`/api/cart/removefromcart`,{data:{productId,}});
             setCart(res.data.cart);
             return {success:true,message:"Product removed from cart successfully"}
            }
            catch(error)
            {
              return {success:false,message:error.response?.data?.message || "failed to remove product from cart"};
            }
            finally
            {
               setCartLoading(false)
            }
            
        }
        else
        {

         let localCart = JSON.parse(localStorage.getItem('cart'))|| {items:[],totalAmount:0,totalItems:0};
         if(localCart.items.length===0)
         {
            return {success:false,message:"cart does not found"}
         }
         localCart.items = localCart.items.filter((item)=>item.product._id !==productId);
         const updated = updateCartTool(localCart);
         saveCart(updated);
         return {success:true,message:"Product removed from cart successfully"}
        }
    }

    const deleteCart = async()=>
    {
        if(user)
        {
            try
            {
                setCartLoading(true);
                await axios.delete(`/api/cart/deletecart`);
                setCart(null);
                return {success:true,message:"Cart deleted successfully"}
            }
            catch(error)
            {
                return {success:false,message:error.response?.data?.message || "failed to delete cart"}
            }
            finally
            {
                setCartLoading(false);
            }
        }
        localStorage.removeItem("cart");
        setCart(null);
        return {success:true,message:"Cart deleted successfully"}
    }

    const updateCart = async (updatedItems) =>
    {

        if(user)
        {
          if(!Array.isArray(updatedItems) || updatedItems.length === 0)
          {
            return {success:false,message:"please update first"}
          }
          try
          {
          setCartLoading(true);
          const res = await axios.put(`/api/cart/updateCart`,{updatedItems});
          setCart(res.data.cart);
          return {success:true,message:"Cart updated successfully"}
         }
         catch(error)
         {
            return {success:false,message:error.response?.data?.message || "failed to update cart"}
         }
         finally
         {
            setCartLoading(false);
         }

        }
    else
    {
        let localCart = JSON.parse(localStorage.getItem('cart'))|| {items:[],totalAmount:0,totalItems:0};
        if(localCart.items.length===0)
         {
           return {success:false,message:"cart not found"}
          }

        const updates = new Map (updatedItems.map((item)=>[
            item.product._id.toString(),
            item.quantity,]))
         for (const item of localCart.items)
         {
            const quantity = updates.get(item.product._id.toString());
            if(quantity !== undefined)
            {
                item.quantity = quantity;
            }
         }
         const updated = updateCartTool(localCart);
         saveCart(updated);
         return {success:true,message:"Cart updated successfully"}
    }
}
    return (
        <cartContext.Provider value ={{cart,updateCart,removeFromCart,addToCart,cartLoading,deleteCart}}>
            {children}
        </cartContext.Provider>
    )
}

export const useCart = ()=> useContext(cartContext);




