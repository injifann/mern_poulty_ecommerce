import React, { useEffect, useState } from 'react'
import {useCart} from '../../context/CartContext'
import EmptyCart from '../../layout/EmptyCart';
import axios from '../../api/axios';
import AddressCard from '../../components/cards/AddressCard';
import toast from 'react-hot-toast';

export default function Order() {
 const {cart} = useCart();
 const [userAddress,setUserAddress] = useState({});
 const [error,setError] = useState("");

 useEffect(()=>{
  const fetchAddress = async ()=>
  {
    try
    {
      const res = await axios.get("/api/address/getmyaddress");
      setUserAddress(res.data.address);
    }
    catch(error)
    {
      setError(error.response?.data?.message || "failed to load  user address");
    }

  };fetchAddress()
 },[])
 

 if(!cart || cart.items.length===0)
 {
    return <EmptyCart/>
 }
  return (
   <div className="min-h-screen bg-gray-100 py-10">
    <div className="mx-auto max-w-7xl px-5">

        {/* Page Title */}
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
            Checkout
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Left */}
          <div className="space-y-6 lg:col-span-2">

              {/* Cart Items */}
              <div className="rounded-xl bg-white p-6 shadow">

                  <h2 className="mb-5 text-xl font-semibold">
                      Order Items
                  </h2>

                  {/* Product Card */}

              </div>

                {/* Shipping */}
                <div className="rounded-xl bg-white p-6 shadow">

                    <h2 className="mb-5 text-xl font-semibold">
                        Shipping Address
                    </h2>

                    <AddressCard />

                </div>

            </div>

            {/* Right */}

            <div>

            <div className="sticky top-24 rounded-xl bg-white p-6 shadow">

                <h2 className="mb-6 text-xl font-semibold">
                    Order Summary
                </h2>

                <div className="space-y-4">

                    <div className="flex justify-between">
                        <span>Items</span>
                        <span>{cart.totalItems}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${cart.totalAmount}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-green-600">
                            Free
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Tax</span>
                        <span>$0</span>
                    </div>

                    <hr />

                    <div className="flex justify-between text-xl font-bold">

                        <span>Total</span>

                        <span>${cart.totalAmount}</span>

                    </div>

                </div>

                <button onClick={()=>toast.success("this is demo app")}
                    className="mt-8 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                    Place Order
                </button>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}
