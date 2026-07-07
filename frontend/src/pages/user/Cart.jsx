import React, { useEffect, useState } from 'react'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast';

export default function Cart() {
    const { cart, cartLoading, updateCart,deleteCart } = useCart();
    const [updatedProducts, setUpdatedProducts] = useState([]);
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

    if (cartLoading) {
        return (
            <div className="flex h-screen items-center justify-center text-gray-600 text-lg font-medium">
                Loading cart...
            </div>
        );
    }
    if(!cart)
    {
        return (
            <div className="flex h-screen items-center justify-center text-red-500 text-lg font-medium">
                cart does not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">

                {/* Cart Title */}
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    Your Cart
                </h1>

                {/* Cart Items */}
                <div className="space-y-4">
                    {displayedItem.map((item) => (
                        <div
                            key={item.product._id}
                            className="bg-white shadow-sm border rounded-lg p-4 flex justify-between items-center"
                        >
                            {/* Product Info */}
                            <div>
                                <p className="font-semibold text-gray-800">
                                    {item.product.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                    ${item.priceAtTimeOfOrder}
                                </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => saveProductQuantity(item, -1)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    -
                                </button>

                                <input
                                    
                                    type="number"
                                    value={item.quantity}
                                    readOnly
                                    className="w-14 text-center border rounded py-1"
                                />

                                <button
                                    onClick={() => saveProductQuantity(item, 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="mt-6 bg-white border rounded-lg p-4">
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

                {/* Actions */}
                <div className="mt-6 flex gap-4">
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-red-300 disabled:cursor-not-allowed"
                        disabled={updatedProducts.length==0}
                    >
                        Save Cart
                    </button>

                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        Proceed to Checkout
                    </button>
                    <button onClick={handleDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-400 transition "
                    >
                        delete
                    </button>
                </div>

            </div>
        </div>
    );
}