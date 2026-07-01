import {useState,useContext,createContext, useEffect} from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const cartContext = createContext();
const api = import.meta.env.VITE_API_URL;

export const CartProvider = ({children})=>
{
    const [cart,setCart] = useState(null);
    const [cartLoading,setCartLoading] = useState(false);
    const {user} = useAuth();

    useEffect(()=>{
        if(!user)
        {
            let localCart = JSON.parse(localStorage.getItem("cart"))
            if(localCart)
            {
                setCart(localCart);
            }
        }
    },[user]);
    

    const saveCart =(Cart)=>
    {
      localStorage.setItem("cart",JSON.stringify(Cart))
      setCart(Cart);
    }
    const updateCartTool = (Cart) =>
    {
      Cart.totalAmount = Cart.items.reduce((sum,item)=>sum + (item.priceAtTimeOfOrder * item.quantity),0);
      Cart.totalItems = Cart.items.reduce((sum,item)=>sum + item.quantity,0);
    }

    const addToCart = async (product,quantity)=>
    {
        if(user)
        {
          try
          {
            setCartLoading(true);
            const res = await axios.post(`${api}/api/cart/addtocart`,{productId:product._id,quantity:quantity});
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
            const localCart = JSON.parse(localStorage.getItem('cart')) || {items:[],totalAmount:0,totalItems:0};
            if(localCart.items.length > 0)
            {
             const existingProductIndex = localCart.items.findIndex((item)=>item.product._id===product._id);
             if(existingProductIndex !== -1)
             {
                localCart.items[existingProductIndex].quantity += quantity;
                updateCartTool(localCart);
                saveCart(localCart);
                return {success:true,message:"Product added to cart successfully"}
             }
             else
             {
                localCart.items.push({product:product,quantity:quantity,priceAtTimeOfOrder:product.price});
                updateCartTool(localCart);
                saveCart(localCart);
                return {success:true,message:"Product added to cart successfully"}
             }
            }
            else
            {
                localCart.items.push({product:product,quantity:quantity,priceAtTimeOfOrder:product.price});
                updateCartTool(localCart);
                saveCart(localCart);
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
             const res = await axios.delete(`${api}/api/cart/removefromcart`,{data:{productId,}});
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
         const localCart = JSON.parse(localStorage.getItem('cart'));
         localCart.items = localCart.items.filter((item)=>item.product._id !==productId);
         updateCartTool(localCart);
         saveCart(localCart);
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
                await axios.delete(`${api}/api/cart/deletecart`);
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

    const updateCartQuantity = async (productId,quantity)=>
    {
        if(user)
        {
            try
            {
                setCartLoading(true);
                const res = await axios.put(`${api}/api/cart/updatecartquantity`,{productId:productId,quantity:quantity});
                setCart(res.data.cart);
                return {success:true,message:"Cart quantity updated successfully"}
            }
            catch(error)
            {
                return {success:false,message:error.response?.data?.message || "failed to update cart quantity"}
            }
            finally
            {
                setCartLoading(false)
            }
        }
        else
        {
            let localCart = JSON.parse(localStorage.getItem('cart'));
            const productIndex = localCart.items.findIndex((item)=>item.product._id===productId);
            localCart.items[productIndex].quantity=quantity;
            updateCartTool(localCart);
            saveCart(localCart);
            return {success:true,message:"Cart quantity updated successfully"}
        }
    }
    return (
        <cartContext.Provider value ={{cart,updateCartQuantity,removeFromCart,addToCart,cartLoading,deleteCart}}>
            {children}
        </cartContext.Provider>
    )
}

export const useCart = ()=> useContext(cartContext);




