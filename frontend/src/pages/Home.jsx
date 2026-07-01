import React, { useEffect, useState } from "react";
import ProductCard from "../components/cards/ProductCard";
import toast from "react-hot-toast";
import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [fetchingProducts, setIsFetchingProducts] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsFetchingProducts(true);

        const res = await axios.get(
          `${api}/api/products/getallproducts`
        );
        
        console.log(res.data.products)
        setProducts(res.data.products);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch products"
        );
      } finally {
        setIsFetchingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  if (fetchingProducts) {
    return (
      <div className="flex h-screen items-center justify-center text-lg font-medium text-gray-600">
        Loading fresh products...
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* HERO SECTION */}
      <section className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-10 px-6 py-16 md:flex-row">
        {/* Text */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
            Fresh Poultry Products <br />
            Delivered Daily
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Get high-quality, farm-fresh poultry products delivered straight
            to your doorstep. Clean, fresh, and affordable — every day.
          </p>

          <div className="mt-6 flex gap-4">
            <button className="rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 transition">
              Shop Now
            </button>

            <button className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-100 transition">
              Learn More
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            ✔ Fresh daily supply • ✔ Trusted farms • ✔ Fast delivery
          </p>
        </div>

        {/* Image */}
        <div className="flex-1">
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d"
              alt="Fresh poultry"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900">
          Featured Products
        </h2>

        <p className="mt-2 text-gray-600">
          Handpicked fresh products available today
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      </section>

      {/* PROMO SECTION */}
      <section className="bg-indigo-600 py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-bold">
            Get 10% Off Your First Order
          </h2>

          <p className="mt-4 text-indigo-100">
            Sign up today and enjoy exclusive discounts on fresh poultry
            products. Limited time offer for new customers.
          </p>

          <button className="mt-6 rounded-lg bg-white px-6 py-3 font-semibold text-indigo-600 hover:bg-gray-100 transition">
            Join Now
          </button>
        </div>
      </section>
    </div>
  );
}