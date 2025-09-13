import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Camera, RefreshCcw, X, Download } from "lucide-react";

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [showTryOnModal, setShowTryOnModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [tryOnImage, setTryOnImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_BASE_URL = 'https://platform.fitroom.app/api/tryon/v2';

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setUploadedImageFile(file);
      setTryOnImage(null);
    }
  };

  const handleTryOn = async () => {
    if (!uploadedImageFile) {
      alert("Please upload your photo first.");
      return;
    }

    setIsLoading(true);
    setTryOnImage(null);

    try {
      const clothImageUrl = productData.image[0] || productData.imageUrl;
      const clothImageResponse = await fetch(clothImageUrl);
      const clothImageBlob = await clothImageResponse.blob();
      const clothImageFile = new File([clothImageBlob], "cloth.jpg");
      
      const formData = new FormData();
      formData.append('model_image', uploadedImageFile);
      formData.append('cloth_image', clothImageFile);
      
      let clothType;
      if (productData.subCategory === "Topwear") {
        clothType = "upper";
      } else if (productData.subCategory === "Bottomwear") {
        clothType = "lower";
      } else if (productData.subCategory === "full_set") {
        clothType = "full_set";
      } else {
        throw new Error("Cannot determine cloth type for try-on.");
      }
      
      formData.append('cloth_type', clothType);
      formData.append('hd_mode', 'true');

      const createResponse = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'X-API-KEY': API_KEY },
        body: formData,
      });

      if (!createResponse.ok) {
        throw new Error(`Failed to create task: ${createResponse.statusText}`);
      }
      const createData = await createResponse.json();
      const taskId = createData.task_id;

      let downloadUrl = null;
      let status = null;
      while (status !== 'COMPLETED' && status !== 'FAILED') {
        const statusResponse = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
          method: 'GET',
          headers: { 'X-API-KEY': API_KEY },
        });
        const statusData = await statusResponse.json();
        status = statusData.status;

        if (status === 'COMPLETED') {
          downloadUrl = statusData.download_signed_url;
          break;
        } else if (status === 'FAILED') {
          throw new Error(`Task failed: ${statusData.error}`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      if (downloadUrl) {
        setTryOnImage(downloadUrl);
      } else {
        alert("Try-on failed: Could not get download URL.");
      }

    } catch (error) {
      console.error("An error occurred during the try-on workflow:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
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
      link.download = `virtual-tryon-${productData.name}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
      alert("Failed to download the image.");
    }
  };

  const resetModal = () => {
    setShowTryOnModal(false);
    setUploadedImage(null);
    setUploadedImageFile(null);
    setTryOnImage(null);
    setIsLoading(false);
  }

  return productData ? (
    <>
      <Navbar />
      <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
        <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
          <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
            <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
              {productData.image.map((item, index) => (
                <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
              ))}
            </div>
            <div className='w-full sm:w-[80%]'>
              <img className='w-full h-auto' src={image} alt="" />
            </div>
          </div>

          <div className='flex-1'>
            <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
            <div className=' flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_dull_icon} alt="" className="w-3 5" />
              <p className='pl-2'>(122)</p>
            </div>
            <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
            <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
            <div className='flex flex-col gap-4 my-8'>
              <p>Select Size</p>
              <div className='flex gap-2'>
                {productData.sizes.map((item, index) => (
                  <button onClick={() => setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} key={index}>{item}</button>
                ))}
              </div>
            </div>
            <button onClick={() => addToCart(productData._id, size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
            
            <button
                onClick={() => setShowTryOnModal(true)}
                className='ml-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 text-sm active:bg-gray-700 rounded-lg'
            >
                TRY ON
            </button>
            
            <hr className='mt-8 sm:w-4/5' />
            <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
            </div>
          </div>
        </div>

        <div className='mt-20'>
          <div className='flex'>
            <b className='border px-5 py-3 text-sm'>Description</b>
            <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
          </div>
        </div>

        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

      </div>
      <Footer />
      {showTryOnModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm'>
          <div className='bg-white p-6 rounded-2xl shadow-2xl relative w-[90%] md:w-[70%] lg:w-[50%] animate-fade-in max-h-[90vh] overflow-y-auto'>
            <button onClick={resetModal} className='absolute top-4 right-4 text-gray-500 hover:text-gray-900'>
              <X size={24} />
            </button>
            <h2 className='text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500'>Virtual Try-On</h2>
            <p className="text-gray-500 text-sm italic text-center mb-4">See how this item looks on you!</p>
            
            <div className="flex flex-col items-center justify-center w-full flex-1 border-2 border-dashed border-pink-300 rounded-xl bg-white shadow-md text-center p-6 relative">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center text-pink-500 animate-pulse">
                  <RefreshCcw size={48} className="animate-spin" />
                  <p className="mt-4 font-semibold">Generating Try-On...</p>
                </div>
              ) : tryOnImage ? (
                <img
                  src={tryOnImage}
                  alt="Virtual try-on result"
                  className="max-h-full object-contain rounded-lg w-full"
                />
              ) : uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Uploaded preview"
                  className="max-h-full object-contain rounded-lg w-full"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <div className="text-pink-400 mb-4">
                    <Camera size={48} />
                  </div>
                  <p className="text-gray-500 text-sm italic">
                    Upload your photo here
                  </p>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="block w-full mt-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
            />
            
            <div className="flex justify-center gap-4 mt-6">
                <button
                    onClick={handleTryOn}
                    disabled={isLoading || !uploadedImageFile}
                    className={`px-8 py-3 text-white font-semibold rounded-full shadow-lg transform transition ${
                        isLoading || !uploadedImageFile
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:scale-105"
                    }`}
                >
                    {isLoading ? "Generating..." : "GENERATE"}
                </button>
                {tryOnImage && (
                  <button
                    onClick={handleDownload}
                    className="px-8 py-3 text-white font-semibold rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 hover:scale-105 transform transition flex items-center justify-center gap-2"
                  >
                    <Download size={20} />
                    Download
                  </button>
                )}
            </div>

          </div>
        </div>
      )}

    </>
  ) : <><Navbar /><div className=' opacity-0'></div><Footer /></>;
}

export default Product;
