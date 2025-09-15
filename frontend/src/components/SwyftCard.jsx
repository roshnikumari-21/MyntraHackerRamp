import React, { useState } from "react";
 import { Heart, Share2, ArrowLeft, ShoppingCart, } from "lucide-react"; 
 import { useNavigate } from "react-router-dom";

export default function SwyftCard({
  image,
  brand,
  title,
  price,
  sizes = [],
  likes: initialLikes,
  className = "",        
}) {
  const navigate = useNavigate();

  const [wishlisted, setWishlisted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes || 0);

  const handleWishlist = () => setWishlisted(!wishlisted);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikes(likes + 1);
    } else {
      setLiked(false);
      setLikes(likes - 1);
    }
  };

  const handleAddToCart = () => {
    alert(`${title} added to cart`);
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

  return (
    <div
      className={`
        relative h-screen mb-6 w-full 
        md:h-screen md:mb-0
        md:max-w-sm md:mx-auto
        rounded-none md:rounded-3xl
        overflow-hidden shadow-2xl bg-black/90 text-white
        ${className}
      `}
    >
      {/* Image */}
      {/* Image */}
<div className="absolute inset-2 rounded-2xl overflow-hidden"> 
  <img
    src={image}
    alt={title}
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-2xl" />
</div>


      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-lg font-semibold">
        <button
          onClick={() => navigate("/")}
          className="p-1 rounded-full bg-black/40 hover:bg-black/60 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Right Icons */}
      <div className="absolute right-4 top-1/2 flex flex-col gap-8 -translate-y-1/2 items-center z-10">
        {/* Wishlist */}
        <button onClick={handleWishlist} className="flex flex-col items-center">
          <Heart
            className={`w-8 h-8 ${
              wishlisted ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </button>

        {/* Love emoji */}
        <button onClick={handleLike} className="flex flex-col items-center">
          <span className="text-4xl">{liked ? "😍" : "🤍"}</span>
          <span className="text-sm">{likes}</span>
        </button>

        {/* Add to cart */}
        <button onClick={handleAddToCart} className="flex flex-col items-center">
          <ShoppingCart className="w-8 h-8" />
        </button>

        {/* Share */}
        <button onClick={handleShare} className="flex flex-col items-center">
          <Share2 className="w-8 h-8" />
        </button>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-6 mb-8 w-full px-5 pb-6">
        <h3 className="text-2xl font-bold">{brand}</h3>
        <p className="text-lg">{title}</p>
        <div className="flex items-center mt-1 text-xl font-semibold">
          ${price}
          <span className="ml-2">👜</span>
        </div>

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="flex gap-2 mt-4">
            {sizes.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


