import React, { useEffect, useState } from 'react'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast';
import LoadingScreen from '../../layout/LoadingScreen';
import BackButton from '../../components/common/BackButton';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import EmptyCart from '../../layout/EmptyCart';
import { useAuth } from '../../context/AuthContext';
export default function Cart() {
    const {user} = useAuth();
    const { cart, cartLoading, updateCart,deleteCart,removeFromCart } = useCart();
    const [updatedProducts, setUpdatedProducts] = useState([]);
    const [deletingId,setIsDeletingId] = useState(null);
    const navigate = useNavigate()
    const handleSave = async () => {
        try {
            const res = await updateCart(updatedProducts);

            if (res.success) {
                toast.success(res.message);
                setUpdatedProducts([]);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error(error?.message || "failed to save cart");
        }
    }
    const handleDelete = async()=>
    {
        const res = await deleteCart();
        if(res.success)
        {
            toast.success(res.message);
        }
        else
        {
           toast.error(res.message)
        }
    }

    const saveProductQuantity = (item, change) => {
        setUpdatedProducts((prev) => {
            const findIndex = prev.findIndex(
                (i) => i.product._id === item.product._id
            );

            if (findIndex > -1) {
                const updated = [...prev];
                const newQuantity = updated[findIndex].quantity + change;

                if (newQuantity < 1) return prev;

                updated[findIndex] = {
                    ...updated[findIndex],
                    quantity: newQuantity
                };

                return updated;
            } else {
                
                return [...prev, {product:item.product, quantity: item.quantity + change }];
            }
        });
    }

    const displayedItem = (cart?.items??[]).map((item) => {
        const updatedProduct = updatedProducts.find(
            (u) => u.product._id === item.product._id
        );

        return {
            ...item,
            quantity: updatedProduct?.quantity ?? item.quantity
        };
    });

    const handleRemoveFromCart = async(productId)=>
    {
        setIsDeletingId(productId)
        const res = await removeFromCart(productId);
        if(res.success===false)
        {
            toast.error(res.message)
        }
        else
        {
        toast.success(res.message);
        }
        setIsDeletingId(null);
    }

    const handleProcedToCheckout = ()=>
    {
        if(!user)
        {
            toast.success("please create account first")
        }
        else
        {
            navigate("/order")
        }
    }
    if (cartLoading) {
        return (
        <LoadingScreen message={"Loading Cat"}/>
        )
    }
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6">
            <div className="max-w-4xl mx-auto">

                {/* Cart Title */}
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    Your Cart
                </h1>
             {cart && cart.items?.length === 0 || !cart && (
                <EmptyCart/>
            )} 

                {/* Cart Items */}
                <div className="space-y-4">
                    {displayedItem?.map((item) => (
                       <div
                            key={item?.product._id}
                            className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md md:flex-row md:items-center md:justify-between"                            >
                            {/* Left Side */}
                             <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left flex-1">
                                {/* Product Image */}
                                <img
                                src={item?.product?.images?.[0].url}
                                alt={item?.product?.title}
                                className="h-24 w-24 rounded-lg border object-cover"
                                />

                                {/* Product Details */}
                                <div >
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {item?.product?.title}
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Price: ${item?.priceAtTimeOfOrder}
                                </p>

                                <p className="text-sm text-green-600 font-medium mt-1">
                                    In Stock
                                </p>
                                </div>
                            </div>

                            {/* Right Side */}
                           <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-end md:w-auto">
                                {/* Quantity */}
                                <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">

                                <button
                                    onClick={() => saveProductQuantity(item, -1)}
                                    className="flex h-10 w-10 items-center justify-center bg-gray-100 text-lg hover:bg-gray-200"
                                >
                                    -
                                </button>

                                <input
                                    type="number"
                                    value={item?.quantity}
                                    readOnly
                                    className="w-14 text-center font-medium outline-none"
                                />

                                <button
                                    onClick={() => saveProductQuantity(item, 1)}
                                    className="flex h-10 w-10 items-center justify-center bg-gray-100 text-lg hover:bg-gray-200"
                                >
                                    +
                                </button>
                                </div>

                                {/* Item Total */}
                            <div className="text-center sm:w-24 sm:text-right">
                                <p className="font-semibold text-gray-800">
                                    ${(item.quantity * item.priceAtTimeOfOrder).toFixed(2)}
                                </p>
                                </div>

                                {/* Delete */}
                                <button
                                disabled={item.product._id === deletingId}
                                onClick={() => handleRemoveFromCart(item.product._id)}
                                className="flex h-10 w-10 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
                                >
                                <FaTrash />
                                </button>

                            </div>
                            </div> ))}
                </div>

                {/* Summary */}
               {cart && cart?.items?.length!==0 && <div className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
                    <p className="text-gray-700">
                        <span className="font-semibold">Total Amount:</span>{" "}
                        {displayedItem.reduce(
                            (sum, item) =>
                                sum + item.quantity * item.priceAtTimeOfOrder,
                            0
                        ).toFixed(2)}
                    </p>

                    <p className="text-gray-700 mt-1">
                        <span className="font-semibold">Total Items:</span>{" "}
                        {displayedItem.reduce((sum, item) => sum + item.quantity, 0)}
                    </p>
                </div>
                 }

                {/* Actions */}
                {cart && cart?.items?.length!==0 && <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                        onClick={handleSave}
                       className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700 sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={updatedProducts.length===0}
                    >
                        Save Cart
                    </button>

                    <button onClick={handleProcedToCheckout}
                        className="w-full rounded-lg bg-green-600 px-4 py-3 text-white transition hover:bg-green-700 sm:w-auto"                    >
                        Proceed to Checkout
                    </button>
                    <button onClick={handleDelete}
                      className="w-full rounded-lg bg-red-600 px-4 py-3 text-white transition hover:bg-green-700 sm:w-auto"                    >
                        delete
                    </button>
                </div>
                }

            </div>
               
            <BackButton to={"/"}/>
        </div>
    );
}