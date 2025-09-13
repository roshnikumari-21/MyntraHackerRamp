import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HowItWorks from "../components/HowItWorks";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/imageeee.png";
import img2 from "../assets/imageeee2.png";
import img3 from "../assets/download.gif";
import img4 from "../assets/imageeee3.png";
import img5 from "../assets/imageeee4.png";

const WishRoomHome = () => {
  const images = [img1, img2, img3, img4, img5];
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  let touchStartX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) nextSlide();
    else if (touchEndX - touchStartX > 50) prevSlide();
  };

  const handleClick = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - box.left;
    clickX < box.width / 2 ? prevSlide() : nextSlide();
  };

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <>

      <div className="flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 md:px-10 py-12 md:py-20">
        <div className="w-full md:w-1/2 text-center md:text-left mb-10 md:mb-0">
          <h3 className="text-gray-600 font-semibold uppercase tracking-[0.25em] text-base sm:text-lg md:text-xl">
            ✨ Introducing
          </h3>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mt-4 leading-tight">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
              WishList
            </span>{" "}
            <span className="text-gray-900 font-black drop-shadow-md">
              TryON
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl font-light text-gray-700 mt-6 leading-snug">
            Try Your Pieces, <br />
            <span className="font-semibold text-pink-600">
              One Combination at a Time 🎨👗
            </span>
          </p>

          <button onClick={() => navigate("/WishRoom")}
 className="mt-8 sm:mt-10 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white text-lg sm:text-xl font-bold shadow-lg hover:scale-105 hover:shadow-xl transition transform">
            Try Now!
          </button>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center relative">
          <div
            className="relative w-[90%] sm:w-[400px] md:w-[520px] h-[320px] sm:h-[400px] md:h-[500px] flex justify-center items-center cursor-pointer"
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {images.map((img, index) => {
              let position =
                (index - activeIndex + images.length) % images.length;
              let style =
                "absolute transition-all duration-700 ease-in-out";

              if (position === 0) {
                style += " w-36 sm:w-48 md:w-60 h-52 sm:h-64 md:h-80 z-30 scale-110 opacity-100";
              } else if (position === 1 || position === images.length - 1) {
                style +=
                  " w-28 sm:w-36 md:w-44 h-40 sm:h-52 md:h-64 z-20 scale-95 opacity-90";
                style +=
                  position === 1
                    ? " translate-x-[100px] sm:translate-x-[140px] md:translate-x-[180px] rotate-[6deg]"
                    : " -translate-x-[100px] sm:-translate-x-[140px] md:-translate-x-[180px] rotate-[-6deg]";
              } else {
                style +=
                  " w-20 sm:w-28 md:w-32 h-28 sm:h-40 md:h-48 z-10 scale-75 opacity-70";
                style +=
                  position === 2
                    ? " translate-x-[150px] sm:translate-x-[200px] md:translate-x-[280px] rotate-[8deg]"
                    : " -translate-x-[150px] sm:-translate-x-[200px] md:-translate-x-[280px] rotate-[-8deg]";
              }

              return (
                <img
                  key={index}
                  src={img}
                  alt={`carousel-${index}`}
                  className={`${style} rounded-xl shadow-2xl object-cover border-[2px] md:border-[3px] border-black`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex flex-col items-center group">
        <span className="mb-1 sm:mb-2 text-xs sm:text-sm text-gray-700 text-center">
          Scroll to know more
        </span>
        <button
          onClick={scrollToNext}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black flex items-center justify-center text-white shadow-lg 
          group-hover:animate-bounce hover:scale-110 transition transform"
          title="Scroll to know more"
        >
          ↓
        </button>
      </div>
      <HowItWorks/>
      <Footer />
    </>
  );
};

export default WishRoomHome;
