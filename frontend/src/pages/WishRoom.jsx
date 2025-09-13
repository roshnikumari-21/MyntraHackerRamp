import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Camera, RefreshCcw, Download } from "lucide-react";

const WishRoom = () => {
  const { products, addMultipleToCart } = useContext(ShopContext);

  const bestsellerTops = products.filter(
    (item) => item.subCategory === "Topwear" && item.bestseller
  );
  const bestsellerBottoms = products.filter(
    (item) => item.subCategory === "Bottomwear" && item.bestseller
  );

  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [tryOnImage, setTryOnImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = import.meta.VITE_API_KEY;
  const API_BASE_URL = 'https://platform.fitroom.app/api/tryon/v2';

  const handleUpload = (e) => {
    console.log("handleUpload called.");
    const file = e.target.files[0];
    if (file) {
      console.log("File uploaded:", file.name, file.size, "bytes");
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setUploadedImageFile(file);
      setTryOnImage(null);
    } else {
      console.log("No file selected.");
    }
  };

  const handleDownload = async () => {
    if (!tryOnImage) return;
    try {
      const response = await fetch(tryOnImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'my-virtual-outfit.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log("Image downloaded successfully.");
    } catch (error) {
      console.error("Failed to download image:", error);
      alert("Failed to download the image.");
    }
  };

  useEffect(() => {
    if (bestsellerTops.length > 0 && !selectedTop) {
      console.log("Setting default top product:", bestsellerTops[0]._id);
      setSelectedTop(bestsellerTops[0]._id);
    }
    if (bestsellerBottoms.length > 0 && !selectedBottom) {
      console.log("Setting default bottom product:", bestsellerBottoms[0]._id);
      setSelectedBottom(bestsellerBottoms[0]._id);
    }
  }, [products, selectedTop, selectedBottom, bestsellerBottoms, bestsellerTops]);

  const handleAddBothToCart = () => {
    console.log("Add both to cart button clicked.");
    const itemsToAdd = [];
    if (selectedTop) {
      const topProduct = products.find((p) => p._id === selectedTop);
      if (topProduct) {
        const topSize = topProduct?.sizes?.[0] || "S";
        itemsToAdd.push({ itemId: selectedTop, size: topSize });
        console.log("Added top to cart:", topProduct.name);
      }
    }
    if (selectedBottom) {
      const bottomProduct = products.find((p) => p._id === selectedBottom);
      if (bottomProduct) {
        const bottomSize = bottomProduct?.sizes?.[0] || "S";
        itemsToAdd.push({ itemId: selectedBottom, size: bottomSize });
        console.log("Added bottom to cart:", bottomProduct.name);
      }
    }
    addMultipleToCart(itemsToAdd);
    console.log("Items to add:", itemsToAdd);
  };

  const handleTryOn = async () => {
    console.log("handleTryOn called.");
    if (!uploadedImageFile || !selectedTop || !selectedBottom) {
      console.error("Validation failed: Missing uploaded image, top, or bottom.");
      alert("Please upload a photo and select both a top and a bottom.");
      return;
    }
    
    console.log("Starting try-on process...");
    setIsLoading(true);
    setTryOnImage(null);

    try {
      const selectedTopProduct = products.find(p => p._id === selectedTop);
      const selectedBottomProduct = products.find(p => p._id === selectedBottom);

      if (!selectedTopProduct || !selectedBottomProduct) {
        console.error("Product details not found.");
        throw new Error("Could not find product details.");
      }
      
      console.log("Fetching product images...");
      const topImageResponse = await fetch(selectedTopProduct.image || selectedTopProduct.imageUrl);
      const topImageBlob = await topImageResponse.blob();
      const topImageFile = new File([topImageBlob], "upper_cloth.jpg");
      
      const bottomImageResponse = await fetch(selectedBottomProduct.image || selectedBottomProduct.imageUrl);
      const bottomImageBlob = await bottomImageResponse.blob();
      const bottomImageFile = new File([bottomImageBlob], "lower_cloth.jpg");
      console.log("Product images fetched successfully.");

      const formData = new FormData();
      formData.append('model_image', uploadedImageFile);
      formData.append('cloth_image', topImageFile);
      formData.append('lower_cloth_image', bottomImageFile);
      formData.append('cloth_type', 'combo');
      formData.append('hd_mode', 'true');
      console.log("FormData for API created:", {
        model_image: uploadedImageFile.name,
        cloth_image: topImageFile.name,
        lower_cloth_image: bottomImageFile.name,
        cloth_type: 'combo',
        hd_mode: 'true'
      });

      const createResponse = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'X-API-KEY': API_KEY,
        },
        body: formData,
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error("API Error Response:", createResponse.status, errorText);
        throw new Error(`Failed to create task: ${createResponse.statusText}`);
      }
      const createData = await createResponse.json();
      const taskId = createData.task_id;
      console.log("Task created. Task ID:", taskId);

      let downloadUrl = null;
      let status = null;
      console.log("Starting polling for task status...");
      while (status !== 'COMPLETED' && status !== 'FAILED') {
        const statusResponse = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
          method: 'GET',
          headers: { 'X-API-KEY': API_KEY },
        });
        const statusData = await statusResponse.json();
        status = statusData.status;
        console.log(`Polling status for task ${taskId}: ${status}`);

        if (status === 'COMPLETED') {
          downloadUrl = statusData.download_signed_url;
          console.log("Task completed successfully. Download URL:", downloadUrl);
          break;
        } else if (status === 'FAILED') {
          console.error(`Task failed with error: ${statusData.error}`);
          throw new Error(`Task failed: ${statusData.error}`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      if (downloadUrl) {
        setTryOnImage(downloadUrl);
      } else {
        console.error("Try-on failed: Could not get download URL from API.");
        alert("Try-on failed: Could not get download URL.");
      }

    } catch (error) {
      console.error("An error occurred during the try-on workflow:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      console.log("Loading state set to false.");
    }
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
      <div className="min-h-screen relative pt-10 px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500">
            Wishlist TryOn
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base italic">
            Try on your <span className="text-pink-500 font-medium">wishlist</span> virtually before you buy
          </p>
        </div>

        <div className="hidden md:flex w-full justify-center gap-12 mt-10 items-start">
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
                  onClick={() => {
                    console.log("Selected top:", item.name);
                    setSelectedTop(item._id);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-start w-1/3">
            <h2 className="font-semibold text-pink-600 mb-3 text-lg border-b-2 border-pink-500 inline-block px-4">
              Try-On Room
            </h2>
            <div className="flex flex-col items-center justify-center w-full h-[600px] border-2 border-dashed border-pink-300 rounded-xl bg-white shadow-md text-center p-6 relative">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center text-pink-500 animate-pulse">
                  <RefreshCcw size={48} className="animate-spin" />
                  <p className="mt-4 font-semibold">Generating Try-On...</p>
                </div>
              ) : tryOnImage ? (
                <img
                  src={tryOnImage}
                  alt="Virtual try-on result"
                  className="max-h-[500px] object-contain rounded-lg"
                />
              ) : uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Uploaded preview"
                  className="max-h-[500px] object-contain rounded-lg"
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
              {!isLoading && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="mt-6 text-sm"
                />
              )}
            </div>
          </div>

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
                  onClick={() => {
                    console.log("Selected bottom:", item.name);
                    setSelectedBottom(item._id);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:hidden gap-6 mt-8">
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
                  onClick={() => {
                    console.log("Selected top:", item.name);
                    setSelectedTop(item._id);
                  }}
                  small
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-start w-full">
            <h2 className="font-semibold text-pink-600 mb-2 text-base border-b-2 border-pink-500 inline-block px-2">
              Try-On Room
            </h2>
            <div className="flex flex-col items-center justify-center w-full h-[450px] border-2 border-dashed border-pink-300 rounded-xl bg-white shadow-md text-center p-6 relative">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center text-pink-500 animate-pulse">
                  <RefreshCcw size={40} className="animate-spin" />
                  <p className="mt-4 font-semibold">Generating...</p>
                </div>
              ) : tryOnImage ? (
                <img
                  src={tryOnImage}
                  alt="Virtual try-on result"
                  className="max-h-[350px] object-contain rounded-lg"
                />
              ) : uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Uploaded preview"
                  className="max-h-[350px] object-contain rounded-lg"
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
              {!isLoading && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="mt-4 text-sm"
                />
              )}
            </div>
          </div>

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
                  onClick={() => {
                    console.log("Selected bottom:", item.name);
                    setSelectedBottom(item._id);
                  }}
                  small
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-10 mb-16">
          <button
            onClick={handleTryOn}
            disabled={isLoading}
            className={`px-8 sm:px-12 py-3 text-white font-semibold rounded-full shadow-lg transform transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:scale-105"
            }`}
          >
            {isLoading ? "Generating..." : "TRY ON"}
          </button>
          <button
            onClick={handleAddBothToCart}
            disabled={isLoading}
            className={`px-8 sm:px-12 py-3 text-white font-semibold rounded-full shadow-lg bg-black transform transition ${
              isLoading
                ? "bg-gray-700 cursor-not-allowed"
                : "hover:scale-105"
            }`}
          >
            Add to Cart
          </button>
          {tryOnImage && (
            <button
              onClick={handleDownload}
              className="px-8 sm:px-12 py-3 text-white font-semibold rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 hover:scale-105 transform transition flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Download
            </button>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WishRoom;
