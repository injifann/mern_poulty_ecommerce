import React, { useEffect, useState } from 'react'
import {useCart} from '../../context/CartContext'
import EmptyCart from '../../layout/EmptyCart';
import axios from '../../api/axios';
import AddressCard from '../../components/cards/AddressCard';
import toast from 'react-hot-toast';

export default function Order() {
 const {cart} = useCart();
 const [userAddress,setUserAddress] = useState(null);
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
              
                <div className="space-y-4">
                  {cart?.items?.map((item) => (
                    <div
                      key={item?.product._id}
                      className="flex items-center gap-4 rounded-lg border border-gray-200 p-4"
                    >
                      {/* Product Image */}
                      <img
                        src={item?.product?.images?.[0]?.url}
                        alt={item?.product.title}
                        className="h-20 w-20 rounded-lg object-cover"
                      />

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.product.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: <span className="font-medium">{item.quantity}</span>
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Unit Price:
                          <span className="ml-1 font-medium text-gray-700">
                            ${item.priceAtTimeOfOrder}
                          </span>
                        </p>
                      </div>

                      {/* Total */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">
                          ${(item.quantity * item.priceAtTimeOfOrder).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

                {/* Shipping */}
              <div className="rounded-xl bg-white p-6 shadow">

                  <h2 className="mb-5 text-xl font-semibold">
                      Shipping Address
                  </h2>
                {userAddress ? (
                  <div className="space-y-1 text-gray-700">
                    <p>{userAddress.fullName}</p>
                    <p>{userAddress.addressLine1}</p>

                    {userAddress.addressLine2 && (
                      <p>{userAddress.addressLine2}</p>
                    )}

                    <p>
                      {userAddress.city}, {userAddress.state}
                    </p>

                    <p>{userAddress.phone}</p>
                  </div>
                ) : (
                  <AddressCard setUserAddress={setUserAddress}/>
                )}
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
