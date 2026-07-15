import React, { useEffect, useState } from "react";
import ProductCard from "../../components/cards/ProductCard";
import toast from "react-hot-toast";
import axios from '../../api/axios'
import { FiArrowRight,FiInfo,FiRefreshCw} from "react-icons/fi";
import { FaLeaf, FaTruck,FaShieldAlt} from "react-icons/fa";
import LoadingScreen from "../../layout/LoadingScreen";
import { useNavigate } from "react-router";
export default function Home() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([]);
  const [error,setError] = useState('')
  const [fetchingProducts, setIsFetchingProducts] = useState(false);

const fetchProducts = async () => {
      try {
        setIsFetchingProducts(true);

        const res = await axios.get(
          `/api/products/getallproducts`,{params:{
            page:1,
            limit:10
          }}
        );

        setProducts(res.data.products);
      } catch (error)
       {
        setError(error.response?.data?.message || "failed to fetch featured products")
      } finally {
        setIsFetchingProducts(false);
      }
    };

  useEffect(() => 
  {
    fetchProducts();
  }, []);

  if (fetchingProducts) {
 
      return (
        <LoadingScreen message={"Loading fresh products"}/>
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

          <div className="mt-6 flex gap-2 sm:gap-4">
            <button onClick={()=>navigate("/shop")} className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 sm:px-6 sm:py-3 sm:text-base">
              Shop Now
              <FiArrowRight />
            </button>

            <button onClick={()=>toast.success("this is demo app and only for demonstration")} className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 sm:px-6 sm:py-3 sm:text-base">
              <FiInfo />
              Learn More
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-600">

        <div className="flex items-center gap-2">
            <FaLeaf className="text-green-600" />
            Fresh Daily Supply
          </div>

          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-indigo-600" />
            Trusted Farms
          </div>

          <div className="flex items-center gap-2">
            <FaTruck className="text-orange-500" />
            Fast Delivery
        </div>

      </div>
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
       
          {products.length===0 &&(<p className="mt-2 text-gray-600">no products available</p>)}
     
        {error && (
          <div className="flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            <p className="truncate">Failed to fetch featured products</p>

          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-red-700"
          >
            <FiRefreshCw />
            Retry
          </button>
          </div>
        )}
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

        <button onClick={()=>toast.success("this is dema app")} className="mx-auto mt-6 flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-indigo-600 transition hover:bg-gray-100">
          Join Now
          <FiArrowRight />
        </button>
        </div>
      </section>
    </div>
  );
}