import {useState,useContext,createContext} from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const cartContext = createContext();
const api = import.meta.env.VITE_API_URL;

export const CartProvider = ({children})=>
{
    const [cart,setCart] = useState(null);
    const [cartError,setCartError] = useState('');
    const [cartLoading,setCartLoading] = useState(false);
    const {user} = useAuth();

    const saveCart =(Cart)=>
    {
      localStorage.setItem("cart",JSON.stringify(Cart))
      setCart(Cart);
    }
    const getTotalAmount = (items) =>
    {
       return items.reduce((sum,item)=>sum + (item.priceAtTimeOfOrder * item.quantity),0);
    }

    const addToCart = async (product,quantity)=>
    {
        if(user)
        {
          try
          {
            setCartLoading(true);
            setCartError('');
            const res = await axios.post(`${api}/api/cart/addtocart`,{productId:product._id,quantity:quantity});
            setCart(res.data.cart);
          }
          catch(error)
          {
            setCartError(error.response?.data?.message || "Failed to add product to cart");
          }
          finally
          {
            setCartLoading(false);
          }
        }
        else
        {
            const localCart = JSON.parse(localStorage.getItem('cart')) || {items:[],totalAmount:0,totalItems:0};
            if(localCart)
            {
             const existingProductIndex = localCart.items.findIndex((item)=>item.product._id.toString()===product._id.toString());
             if(existingProductIndex !== -1)
             {
                localCart.items[existingProductIndex].quantity += quantity;
                localCart.totalAmount = getTotalAmount(localCart.items);
                saveCart(localCart);
             }
             else
             {
                let totalAmount = getTotalAmount(localCart.items);
                localCart.items.push({product:product,quantity:quantity,priceAtTimeOfOrder:product.price});
                localCart.totalAmount = totalAmount;
                localCart.totalItems = localCart.items.length;
                saveCart(localCart);

             }
            }
            else
            {
                localCart.items.push({product:product,quantity:quantity,priceAtTimeOfOrder:product.price});
                localCart.totalAmount = product.price;
                localCart.totalAmount = 1;
                saveCart(localCart);
            }
        }
    }

    const removeFromCart = async (productId)=>
    {
        if(user)
        {
            try 
            {
             setCartError("");
             setCartLoading(true)
             const res = await axios.delete(`${api}/api/cart/removefromcart`,{productId:productId});
             setCart(res.data.cart);
            }
            catch(error)
            {
              setCartError(error.response?.data?.message || "failed to remove product from cart");
            }
            finally
            {
               setCartLoading(true)
            }
            
        }
        else
        {
         const localCart = JSON.parse(localStorage.getItem('cart'));
         localCart.items = localCart.items.filter((item)=>item.product._id.toString() !==productId.toString());
         saveCart(localCart);
        }
    }

    const deleteCart = async()=>
    {
        if(user)
        {
            try
            {
                setCartLoading(true);
                setCartError('');
                await axios.delete(`${api}/api/cart/deletecart`);
                setCart(null);
            }
            catch(error)
            {
                setCartError(error.response?.data?.message || "failed to delete cart")
            }
            finally
            {
                setCartLoading(false);
            }
        }
        localStorage.removeItem("cart");
        setCart(null);

    }

    const updateCartQuantity = async (productId,quantity)=>
    {
        if(user)
        {
            try
            {
                setCartError("");
                setCartLoading(true);
                const res = await axios.put(`${api}/api/cart/updatecartquantity`,{productId:productId,quantity:quantity});
                setCart(res.data.cart);
            }
            catch(error)
            {
             setCartError(error.response?.data?.message || "failed to update cart quantity");
            }
            finally
            {
                setCartLoading(false)
            }
        }
        else
        {
            let localCart = JSON.parse(localStorage.getItem('cart'));
            const productIndex = localCart.items.findIndex((item)=>item.product._id.toString()===productId.toString());
            localCart.items[productIndex].quantity=quantity;
            saveCart(localCart);
        }
    }
    return (
        <cartContext.provider value ={{cart,updateCartQuantity,removeFromCart,addToCart,cartError,cartLoading,deleteCart}}>
            {children}
        </cartContext.provider>
    )
}

export const useCart = ()=> useContext(cartContext);




