// SwyftCard.jsx

import React, { useState, useContext } from "react";
import {
  Heart,
  Share2,
  ArrowLeft,
  ThumbsUp,
  ShoppingCart,
  Link as LinkIcon,
  Shirt,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

export default function SwyftCard({
  id,
  images,
  brand,
  title,
  price,
  sizes = [],
  likes: initialLikes,
  className = "",
  bestseller: initialBestseller,
}) {
  const navigate = useNavigate();
  const { addToCart, updateWishlist, products, updateLikes } = useContext(ShopContext);
  const [wishlisted, setWishlisted] = useState(initialBestseller);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes || 0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  // Handlers for product interactions
  const handleWishlist = () => {
    setWishlisted((prev) => !prev);
    // You should have a function in ShopContext to handle this persistence
    // For now, it's just a state update.
    // updateWishlist(id, !wishlisted);
  };

  const handleLike = () => {
    const newLiked = !liked;
    const newLikes = newLiked ? likes + 1 : likes - 1;
    setLiked(newLiked);
    setLikes(newLikes);
    // You should have a function in ShopContext to handle this persistence
    // For now, it's just a state update.
    // updateLikes(id, newLikes);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please choose a size first.");
      return;
    }
    // Now you can add to cart since a size is selected
    addToCart(id, selectedSize);
    toast.success("Item added to cart!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${brand} - ${title}`,
        text: "Check out this product!",
        url: window.location.href,
      });
    } else {
      alert("Sharing not supported");
    }
  };

  const handleKnowMore = () => {
    navigate(`/product/${id}`);
  };

  const handleTryOn = () => {
    navigate(`/product/${id}`);
  };

  // Swipe handlers using react-swipeable
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    },
    onSwipedRight: () => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    },
    trackMouse: true,
  });

  return (
    <div
      className={`relative h-screen w-full
        md:h-[90vh] md:mb-0
        md:max-w-sm md:mx-auto
        overflow-hidden shadow-2xl bg-black text-white
        ${className}`}
    >
      {/* Image container */}
      <div
        className="relative flex ml-2 mr-2 items-center justify-center h-[80%] cursor-grab"
        {...swipeHandlers}
      >
        <img
          src={images[currentImageIndex] || "/images/default.jpg"}
          alt={title}
          className="h-full w-auto inset-2 object-cover rounded-xl transition-opacity duration-300"
        />

        {/* Carousel Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? "bg-white scale-150" : "bg-gray-500"
                }`}
              />
            ))}
          </div>
        )}

        {/* Top gradient */}
        <div className="absolute top-0 left-0 w-full h-[5%] bg-gradient-to-b from-black via-gray-800/60 to-transparent z-10" />
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 w-full h-[25%] bg-gradient-to-t from-black via-gray-800/80 to-transparent z-10" />
      </div>

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 text-lg font-semibold">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-full bg-black/60 hover:bg-black/80 transition"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Right Icons */}
      <div className="absolute right-4  top-1/2 flex flex-col gap-4 -translate-y-1/2 items-center z-20">
        <button onClick={handleWishlist} className="flex flex-col items-center gap-1">
          <div className="p-1.5 rounded-full bg-black/20 hover:bg-white/30 transition">
            <Heart className={`w-5 h-5 ${wishlisted ? "fill-red-500 text-red-500" : "text-white"}`} />
          </div>
        </button>
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <div className="p-1.5 rounded-full bg-black/20 hover:bg-white/30 transition">
            <ThumbsUp className={`w-5 h-5 ${liked ? "fill-pink-500 text-pink-500" : "text-white"}`} />
          </div>
          <span className="text-xs">{likes}</span>
        </button>
        <button onClick={handleAddToCart} className="flex flex-col items-center gap-1">
          <div className="p-1.5 rounded-full bg-black/20 hover:bg-white/30 transition">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
        </button>
        <button onClick={handleShare} className="flex flex-col items-center gap-1">
          <div className="p-1.5 rounded-full bg-black/20 hover:bg-white/30 transition">
            <Share2 className="w-5 h-5 text-white" />
          </div>
        </button>
        <button onClick={handleKnowMore} className="flex flex-col items-center gap-1">
          <div className="p-1.5 rounded-full bg-black/20 hover:bg-white/30 transition">
            <LinkIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs">More</span>
        </button>
        <button onClick={handleKnowMore} className="flex flex-col items-center gap-1">
          <div className="p-1.5 rounded-full bg-black/20 hover:bg-white/30 transition">
            <Shirt className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs">Try On</span>
        </button>
        <button onClick={handleKnowMore} className="flex flex-col items-center gap-1">
          <div className="p-1.5 rounded-full transition">
            
          </div>
          <span className="text-xs"></span>
        </button>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-6 mb-8 w-full px-5 pb-6 z-20">
        <h3 className="text-2xl font-bold">{brand}</h3>
        <p className="text-lg">{title}</p>
        <div className="flex items-center mt-1 text-xl font-semibold">
          ₹{price}
         
        </div>
        {sizes.length > 0 && (
          <div className="flex gap-2 mt-4">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm ${
                  selectedSize === s ? "ring-2 ring-white" : ""
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}