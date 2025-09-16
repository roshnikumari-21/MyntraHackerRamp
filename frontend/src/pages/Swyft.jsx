import React, { useContext, useEffect, useRef, useMemo, useState } from "react";
import SwyftCard from "../components/SwyftCard";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Pause } from "lucide-react";

const Swyft = () => {
  const { products } = useContext(ShopContext);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [autoScroll, setAutoScroll] = useState(false);

  const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };
  const shuffledProducts = useMemo(() => shuffleArray(products), [products]);
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
  useEffect(() => {
    let scrollInterval;
    if (autoScroll) {
      scrollInterval = setInterval(() => {
        if (containerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
          const isAtEnd = scrollTop + clientHeight >= scrollHeight;
          const nextScrollPosition = isAtEnd ? 0 : scrollTop + clientHeight;

          containerRef.current.scrollTo({
            top: nextScrollPosition,
            behavior: "smooth",
          });
        }
      }, 5000);
    }

    return () => clearInterval(scrollInterval);
  }, [autoScroll]);

  const handleToggleAutoScroll = () => {
    setAutoScroll((prev) => !prev);
  };

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

      <div className="fixed top-[20px] md:top-[100px] right-4 z-50 flex items-center gap-2">
        <span className="text-white text-xs font-semibold">Auto Scroll</span>
        <button
          onClick={handleToggleAutoScroll}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition"
        >
          {autoScroll ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {shuffledProducts.map((product) => (
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
