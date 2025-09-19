import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

export default function SwyftBanner() {
  const navigate = useNavigate();

  const banners = [
    { src: assets.SwyftHomeBanner, link: "/swyft" },
    { src: assets.StyleSyncBanner, link: "/WishRoomHome" },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="relative w-full">
      <img
        src={banners[index].src}
        alt={`Banner ${index}`}
        onClick={() => navigate(banners[index].link)}
        className="w-full mb-6 cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
      />

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-gray-800" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}


