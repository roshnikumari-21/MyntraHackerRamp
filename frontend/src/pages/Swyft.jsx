import React, { useContext, useEffect, useRef } from "react";
import SwyftCard from "../components/SwyftCard";
import { ShopContext } from "../context/ShopContext";
import { assets } from '../assets/assets';
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Swyft = () => {
  const { products } = useContext(ShopContext);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: window.innerHeight,
          behavior: "smooth",
        });
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      ref={containerRef}
      className="
        h-screen
        overflow-y-scroll
        snap-y snap-mandatory
        scrollbar-hide
        bg-gray-200
      "
    >
      <div className="relative snap-start h-screen">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 transition block md:hidden"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <img
          src={assets.swyft_front}
          alt="Welcome to Swyft"
          className="h-screen mx-auto object-cover"
        />
      </div>

      {products.map((product) => (
        <SwyftCard
          key={product._id}
          id={product._id}
          className="snap-start"
          images={product.image}
          brand={product.brand}
          title={product.name}
          price={product.price}
          likes={product.likes || 0}
          sizes={product.sizes || []}
          bestseller={product.bestseller || false}
        />
      ))}
    </div>
  );
};

export default Swyft;


