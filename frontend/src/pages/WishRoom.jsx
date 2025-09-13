import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Camera } from "lucide-react";

const WishRoom = () => {
  const { products, addMultipleToCart } = useContext(ShopContext);

  const bestsellerTops = products.filter(
    (item) => item.subCategory === "Topwear" && item.bestseller
  );
  const bestsellerBottoms = products.filter(
    (item) => item.subCategory === "Bottomwear" && item.bestseller
  );

  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  useEffect(() => {
    if (bestsellerTops.length > 0 && !selectedTop)
      setSelectedTop(bestsellerTops[0]._id);
    if (bestsellerBottoms.length > 0 && !selectedBottom)
      setSelectedBottom(bestsellerBottoms[0]._id);
  }, [products]);

 const handleAddBothToCart = () => {
  const itemsToAdd = [];

  if (selectedTop) {
    const topProduct = products.find((p) => p._id === selectedTop);
    if (topProduct) {
      const topSize = topProduct?.sizes?.[0] || "S";
      itemsToAdd.push({ itemId: selectedTop, size: topSize });
    }
  }

  if (selectedBottom) {
    const bottomProduct = products.find((p) => p._id === selectedBottom);
    if (bottomProduct) {
      const bottomSize = bottomProduct?.sizes?.[0] || "S";
      itemsToAdd.push({ itemId: selectedBottom, size: bottomSize });
    }
  }

  addMultipleToCart(itemsToAdd);
};



  const ProductCard = ({ item, selected, onClick, small }) => (
    <div
      onClick={onClick}
      className={`transition-all duration-300 rounded-xl cursor-pointer border bg-white shadow-sm p-2 flex-shrink-0
      ${small ? "w-28 sm:w-32" : "mb-4"}
      ${
        selected
          ? "border-4 border-pink-500 shadow-lg scale-105"
          : "border-gray-200 opacity-80"
      }`}
    >
      {/* Product Image */}
      <div
        className={`w-full ${
          small ? "h-24 sm:h-28" : "h-40"
        } flex items-center justify-center rounded-md overflow-hidden bg-gray-50`}
      >
        <img
          src={item.image || item.imageUrl}
          alt={item.name}
          className="object-contain max-h-full"
        />
      </div>

      {/* Info only for desktop */}
      {!small && (
        <div className="mt-3 text-center">
          <h3
            className={`text-sm font-semibold ${
              selected ? "text-gray-900" : "text-gray-600"
            }`}
          >
            {item.name}
          </h3>
          <p className="text-xs text-gray-500">
            {item.color}, {item.material}
          </p>
          <p
            className={`mt-1 font-bold ${
              selected ? "text-pink-600" : "text-gray-500"
            }`}
          >
            ₹{item.price}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen relative pt-10 px-4 sm:px-6 lg:px-12">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500">
            Wishlist TryOn
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base italic">
            Try on your{" "}
            <span className="text-pink-500 font-medium">wishlist</span> virtually
            before you buy
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex w-full justify-center gap-12 mt-10 items-start">
          {/* Left - Topwear carousel */}
          <div className="flex flex-col items-center w-1/5">
            <h2 className="font-bold text-pink-600 mb-3 text-lg border-b-2 border-pink-500 inline-block px-4">
              Tops
            </h2>
            <div className="h-[480px] w-full p-4 rounded-2xl bg-pink-50 shadow-[0_10px_25px_rgba(0,0,0,0.3)] overflow-y-auto hide-scrollbar scroll-smooth">
              {bestsellerTops.map((item) => (
                <ProductCard
                  key={item._id}
                  item={item}
                  selected={selectedTop === item._id}
                  onClick={() => setSelectedTop(item._id)}
                />
              ))}
            </div>
          </div>

          {/* Center - Upload box */}
          <div className="flex flex-col items-center justify-start w-1/3">
            <h2 className="font-semibold text-pink-600 mb-3 text-lg border-b-2 border-pink-500 inline-block px-4">
              Upload Your Photo
            </h2>
            <div className="flex flex-col items-center justify-center w-full h-[450px] border-2 border-dashed border-pink-300 rounded-xl bg-white shadow-md text-center p-6">
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Uploaded preview"
                  className="max-h-[300px] object-contain rounded-lg"
                />
              ) : (
                <>
                  <div className="text-pink-400 mb-4">
                    <Camera size={48} />
                  </div>
                  <p className="text-gray-500 text-sm italic">
                    Upload your photo here to start virtual try-on
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="mt-6 text-sm"
              />
            </div>
          </div>

          {/* Right - Bottomwear carousel */}
          <div className="flex flex-col items-center w-1/5">
            <h2 className="font-semibold text-pink-600 mb-3 text-lg border-b-2 border-pink-500 inline-block px-4">
              Bottoms
            </h2>
            <div className="h-[480px] w-full p-4 rounded-2xl bg-pink-50 shadow-[0_10px_25px_rgba(0,0,0,0.3)] overflow-y-auto hide-scrollbar scroll-smooth">
              {bestsellerBottoms.map((item) => (
                <ProductCard
                  key={item._id}
                  item={item}
                  selected={selectedBottom === item._id}
                  onClick={() => setSelectedBottom(item._id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col md:hidden gap-6 mt-8">
          {/* Topwear horizontal scroller */}
          <div>
            <h2 className="font-bold text-pink-600 mb-2 text-base border-b-2 border-pink-500 inline-block px-2">
              Tops
            </h2>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth py-2">
              {bestsellerTops.map((item) => (
                <ProductCard
                  key={item._id}
                  item={item}
                  selected={selectedTop === item._id}
                  onClick={() => setSelectedTop(item._id)}
                  small
                />
              ))}
            </div>
          </div>

          {/* Upload box */}
          <div className="flex flex-col items-center justify-start w-full">
            <h2 className="font-semibold text-pink-600 mb-2 text-base border-b-2 border-pink-500 inline-block px-2">
              Upload Your Photo
            </h2>
            <div className="flex flex-col items-center justify-center w-full h-[350px] border-2 border-dashed border-pink-300 rounded-xl bg-white shadow-md text-center p-6">
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Uploaded preview"
                  className="max-h-[250px] object-contain rounded-lg"
                />
              ) : (
                <>
                  <div className="text-pink-400 mb-4">
                    <Camera size={40} />
                  </div>
                  <p className="text-gray-500 text-sm italic">
                    Upload your photo here
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="mt-4 text-sm"
              />
            </div>
          </div>

          {/* Bottomwear horizontal scroller */}
          <div>
            <h2 className="font-semibold text-pink-600 mb-2 text-base border-b-2 border-pink-500 inline-block px-2">
              Bottoms
            </h2>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth py-2">
              {bestsellerBottoms.map((item) => (
                <ProductCard
                  key={item._id}
                  item={item}
                  selected={selectedBottom === item._id}
                  onClick={() => setSelectedBottom(item._id)}
                  small
                />
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-10 mb-16">
          <button className="px-8 sm:px-12 py-3 text-white font-semibold rounded-full shadow-lg bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:scale-105 transform transition">
            TRY ON
          </button>
          <button
            onClick={handleAddBothToCart}
            className="px-8 sm:px-12 py-3 text-white font-semibold rounded-full shadow-lg bg-black hover:scale-105 transform transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default WishRoom;







