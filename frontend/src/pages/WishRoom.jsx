import { useContext, useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import { Camera, RefreshCcw, Download, Heart, Upload, Search, Sparkles, Wand2 } from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import {assets} from '../assets/assets'

const WishRoom = () => {
  const { products, addMultipleToCart } = useContext(ShopContext);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [tryOnImage, setTryOnImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [triggerAiSearch, setTriggerAiSearch] = useState(false);
  const [topSearchQuery, setTopSearchQuery] = useState('');
  const [bottomSearchQuery, setBottomSearchQuery] = useState('');
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [activeMode, setActiveMode] = useState("Search"); 
  const [aiKeywords, setAiKeywords] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [refinedTitles, setRefinedTitles] = useState([]);
  const [isRefining, setIsRefining] = useState(false);
  const fileInputRef = useRef(null);
  const aiSearchInputRef = useRef(null);


  const FITROOM_API_KEY = import.meta.env.VITE_API_KEY;
  const API_BASE_URL = 'https://platform.fitroom.app/api/tryon/v2';
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;
 
 const allTops = products.filter(
    (item) => item.subCategory === "Topwear"
  );
  const allBottoms = products.filter(
    (item) => item.subCategory === "Bottomwear"
  );

  const fetchKeywordsFromAI = async (query) => {
    if (!query) {
      setAiKeywords([]);
      return;
    }
    setIsAiLoading(true);

    const systemPrompt = "You are an expert fashion stylist. Based on the user's query, provide a list of relevant keywords to filter products by. only give me single word keywords and not double or triple . Include categories,colors,materials,types of clothes ,related keywords and styles for eg : for barbie it would be pink , for diwali or holi it would be ethnic or festival or festive. Respond only with a JSON array of strings.";
    const userQuery = `Generate keywords for: "${query}"`;
    
    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "STRING",
          },
        },
      },
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const keywords = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (keywords) {
        const parsedKeywords = JSON.parse(keywords);
        setAiKeywords(parsedKeywords);
      } else {
        setAiKeywords([]);
      }
    } catch (error) {
      setAiKeywords([]);
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const fetchRefinedTitlesFromAI = async (originalQuery, productTitles) => {
    if (!originalQuery || !productTitles || productTitles.length === 0) {
      setRefinedTitles([]);
      return;
    }
    setIsRefining(true);
    const systemPrompt = "You are a fashion expert. Given a list of product titles and an original search query, your task is to identify and return the titles that are relevant to the query, always respond with a bunch of titles keeping the relevant ones and only removing those which are highly unrelevant. Respond only with a JSON array of strings containing the relevant product titles.";
    const userQuery = `Original query: "${originalQuery}". Products to filter: ${JSON.stringify(productTitles)}`;
    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "STRING",
          },
        },
      },
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
    };
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const refinedTitles = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (refinedTitles) {
        const parsedTitles = JSON.parse(refinedTitles);
        setRefinedTitles(parsedTitles);
      } else {
        setRefinedTitles(productTitles);
      }
    } catch (error) {
      setRefinedTitles(productTitles);
    } finally {
      setIsRefining(false);
    }
  };

const fncArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
const allItemmm = [
  ...products.slice(0,40),
  ...products.slice(86, 90),
];
const Itemmm = fncArray(allItemmm);

const getFilteredTops = () => {
  let filtered = allTops;
  if (activeMode === "Wishlist") {
    filtered = filtered.filter(item => item.bestseller);
  } else if (activeMode === "Search") {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(topSearchQuery.toLowerCase())
    );
  } else if (activeMode === "AI Search") {
    if (isAiLoading || isRefining) {
      return [];
    }
    if (refinedTitles.length > 0) {
      filtered = filtered.filter(item => refinedTitles.includes(item.name) && item.subCategory === "Topwear");
    } else if (aiKeywords.length > 0) {
      filtered = filtered.filter(item =>
        aiKeywords.some(keyword =>
          item.name.toLowerCase().includes(keyword.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(keyword.toLowerCase()))
        )
      );
    }
  } else if (activeMode === "Recommendations") {
    filtered = Itemmm.filter(item => item.subCategory === "Topwear");
  }

  return filtered;
};
const getFilteredBottoms = () => {
  let filtered = allBottoms;
  if (activeMode === "Wishlist") {
    filtered = filtered.filter(item => item.bestseller);
  } else if (activeMode === "Search") {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(bottomSearchQuery.toLowerCase())
    );
  } else if (activeMode === "AI Search") {
    if (isAiLoading || isRefining) {
      return [];
    }
    if (refinedTitles.length > 0) {
      filtered = filtered.filter(item => refinedTitles.includes(item.name) && item.subCategory === "Bottomwear");
    } else if (aiKeywords.length > 0) {
      filtered = filtered.filter(item =>
        aiKeywords.some(keyword =>
          item.name.toLowerCase().includes(keyword.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(keyword.toLowerCase()))
        )
      );
    }
  } else if (activeMode === "Recommendations") {
    filtered = Itemmm.filter(item => item.subCategory === "Bottomwear");
  }
  return filtered;
};

  const filteredTops = getFilteredTops();
  const filteredBottoms = getFilteredBottoms();

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
    if (allTops.length > 0 && !selectedTop) {
      setSelectedTop(allTops[0]._id);
    }
    if (allBottoms.length > 0 && !selectedBottom) {
      setSelectedBottom(allBottoms[0]._id);
    }
  }, [products, selectedTop, selectedBottom, allBottoms, allTops]);

useEffect(() => {
  const runAiSearch = async () => {
    if (!triggerAiSearch) return;

    if (aiSearchQuery) {
      await fetchKeywordsFromAI(aiSearchQuery);
    } else {
      setAiKeywords([]);
    }
    console.log(aiKeywords);

    if (aiKeywords.length > 0) {
      const initialFilteredTitles = products
        .filter(item =>
          aiKeywords.some(keyword =>
            item.name.toLowerCase().includes(keyword.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(keyword.toLowerCase()))
          )
        )
        .map(item => item.name);

      await fetchRefinedTitlesFromAI(aiSearchQuery, initialFilteredTitles);
    } else {
      setRefinedTitles([]);
    }
    setTriggerAiSearch(false);
  };

  runAiSearch();
}, [triggerAiSearch, aiSearchQuery, activeMode]);

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
      toast.error("Please upload a photo and select both a top and a bottom.");
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
      const topImageResponse = await fetch(selectedTopProduct.image[0]);
      const topImageBlob = await topImageResponse.blob();
      const topImageFile = new File([topImageBlob], "upper_cloth.jpg");
      
      const bottomImageResponse = await fetch(selectedBottomProduct.image[0]);
      const bottomImageBlob = await bottomImageResponse.blob();
      const bottomImageFile = new File([bottomImageBlob], "lower_cloth.jpg");
      console.log("Product images fetched successfully.");

      const formData = new FormData();
      formData.append('model_image', uploadedImageFile);
      formData.append('cloth_image', topImageFile);
      formData.append('lower_cloth_image', bottomImageFile);
      formData.append('cloth_type', 'combo');
      formData.append('hd_mode', 'false');
      console.log("FormData for API created:", {
        model_image: uploadedImageFile.name,
        cloth_image: topImageFile.name,
        lower_cloth_image: bottomImageFile.name,
        cloth_type: 'combo',
        hd_mode: 'false'
      });

      const createResponse = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'X-API-KEY': FITROOM_API_KEY,
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
          headers: { 'X-API-KEY': FITROOM_API_KEY },
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
          src={item.image[0] || item.imageUrl}
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

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <div className="min-h-screen relative pt-10 px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500">
            Style Sync
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base italic">
            Try on your <span className="text-pink-500 font-medium">outfits</span> virtually before you buy
          </p>
        </div>

        {/* Feature Bar */}
        <div className="flex justify-center mb-10 md:mb-16">
          {/* Desktop & Tablet Feature Bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-full p-1 shadow-inner mx-auto">
            <button
              onClick={() => setActiveMode("Search")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                activeMode === "Search"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Search size={20} />
              <span className="font-semibold">Search</span>
            </button>
            <button
              onClick={() => setActiveMode("AI Search")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                activeMode === "AI Search"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Sparkles size={20} />
              <span className="font-semibold">AI Search</span>
            </button>
            <button
              onClick={() => setActiveMode("Wishlist")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                activeMode === "Wishlist"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Heart size={20} />
              <span className="font-semibold">Wishlist</span>
            </button>
            <button
              onClick={() => setActiveMode("Recommendations")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                activeMode === "Recommendations"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Wand2 size={20} />
              <span className="font-semibold">Recommendations</span>
            </button>
          </div>
          {/* Mobile Feature Bar */}
          <div className="md:hidden flex items-center bg-gray-100 rounded-full p-1 shadow-inner max-w-full mx-auto">
            <button
              onClick={() => setActiveMode("Search")}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
                activeMode === "Search"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Search size={16} />
              {activeMode === "Search" && <span className="font-semibold text-xs">Search</span>}
            </button>
            <button
              onClick={() => setActiveMode("AI Search")}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
                activeMode === "AI Search"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Sparkles size={16} />
              {activeMode === "AI Search" && <span className="font-semibold text-xs">AI Search</span>}
            </button>
            <button
              onClick={() => setActiveMode("Wishlist")}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
                activeMode === "Wishlist"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Heart size={16} />
              {activeMode === "Wishlist" && <span className="font-semibold text-xs">Wishlist</span>}
            </button>
            <button
              onClick={() => setActiveMode("Recommendations")}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
                activeMode === "Recommendations"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Wand2 size={16} />
              {activeMode === "Recommendations" && <span className="font-semibold text-xs">Recommendations</span>}
            </button>
          </div>
        </div>
        
        {/* AI Search Bar */}
        {/* AI Search Bar */}
{activeMode === "AI Search" && (
  <div className="flex justify-center mb-6 px-4">
    <div className='flex items-center bg-gray-100 rounded-full w-full max-w-lg px-4 py-2 shadow-inner'>
      <input
        type="text"
        value={aiSearchQuery}
        onChange={(e) => setAiSearchQuery(e.target.value)}
        placeholder="Describe the style or mood you want..."
        className="flex-1 border-none outline-none bg-inherit text-sm text-gray-800 placeholder-gray-500 ml-2"
        ref={aiSearchInputRef}
      />
      {/* Add the search button here */}
      <button
       onClick={() => setTriggerAiSearch(true)}
        className="p-2 ml-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
      >
        <Search size={16} />
      </button>
    </div>
  </div>
)}

        {/* Desktop Layout */}
        <div className="hidden md:flex w-full justify-center gap-12 mt-10 items-start">
          <div className="flex flex-col items-center w-1/5">
            <div className="flex justify-between items-center w-full mb-3">
              <h2 className="font-bold text-pink-600 text-lg border-b-2 border-pink-500 inline-block px-4">
                Tops
              </h2>
            </div>
            {activeMode === "Search" && (
              <div className='flex items-center bg-pink-50 rounded-2xl w-full px-4 py-2 mb-3'>
                <input
                  type="text"
                  value={topSearchQuery}
                  onChange={(e) => setTopSearchQuery(e.target.value)}
                  placeholder="Search tops..."
                  className="flex-1 border-none outline-none bg-inherit text-sm text-gray-700 placeholder-gray-500"
                />
              </div>
            )}
            <div className="h-[480px] w-full p-4 rounded-2xl bg-pink-50 shadow-[0_10px_25px_rgba(0,0,0,0.3)] overflow-y-auto hide-scrollbar scroll-smooth">
              {(isAiLoading || isRefining) && activeMode === "AI Search" ? (
                <div className="flex flex-col items-center justify-center h-full text-pink-500 animate-pulse">
                  <RefreshCcw size={32} className="animate-spin" />
                  <p className="mt-4 font-semibold text-center">Finding your perfect vibe...</p>
                </div>
              ) : (
                filteredTops.map((item) => (
                  <ProductCard
                    key={item._id}
                    item={item}
                    selected={selectedTop === item._id}
                    onClick={() => {
                      console.log("Selected top:", item.name);
                      setSelectedTop(item._id);
                    }}
                  />
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-start w-1/3">
            <h2 className="font-semibold text-pink-600 mb-3 text-lg border-b-2 border-pink-500 inline-block px-4">
              Try-On Room
            </h2>
            <div className="flex flex-col items-center justify-center w-full h-[530px] border-8 border-double border-pink-300 rounded-xl bg-white shadow-md text-center p-6 relative">
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
                   <Camera size={40}/>
                  </div>
                  <p className="text-pink-500 text-sm italic">
                    Upload your photo here to start virtual try-on
                  </p>
                </>
              )}
              {!isLoading && (
                <div className="absolute bottom-6 right-6">
                  <button 
                    onClick={handleIconClick} 
                    className="p-3 bg-white rounded-full shadow-lg text-pink-500 hover:scale-110 transition-transform"
                  >
                    <Upload size={24} />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center w-1/5">
            <div className="flex justify-between items-center w-full mb-3">
              <h2 className="font-semibold text-pink-600 text-lg border-b-2 border-pink-500 inline-block px-4">
                Bottoms
              </h2>
            </div>
            {activeMode === "Search" && (
              <div className='flex items-center bg-pink-50 rounded-2xl w-full px-4 py-2 mb-3'>
                <input
                  type="text"
                  value={bottomSearchQuery}
                  onChange={(e) => setBottomSearchQuery(e.target.value)}
                  placeholder="Search bottoms..."
                  className="flex-1 border-none outline-none  bg-inherit text-sm text-gray-700 placeholder-gray-500"
                />
              </div>
            )}
            <div className="h-[480px] w-full p-4 rounded-2xl bg-pink-50 shadow-[0_10px_25px_rgba(0,0,0,0.3)] overflow-y-auto hide-scrollbar scroll-smooth">
              {(isAiLoading || isRefining) && activeMode === "AI Search" ? (
                <div className="flex flex-col items-center justify-center h-full text-pink-500 animate-pulse">
                  <RefreshCcw size={32} className="animate-spin" />
                  <p className="mt-4 font-semibold text-center">Finding your perfect vibe...</p>
                </div>
              ) : (
                filteredBottoms.map((item) => (
                  <ProductCard
                    key={item._id}
                    item={item}
                    selected={selectedBottom === item._id}
                    onClick={() => {
                      console.log("Selected bottom:", item.name);
                      setSelectedBottom(item._id);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Layout */}
        <div className="flex flex-col md:hidden gap-6 mt-8">
          <div>
            <div className="flex justify-between items-center w-full mb-2">
              <h2 className="font-bold text-pink-600 text-base border-b-2 border-pink-500 inline-block px-2">
                Tops
              </h2>
            </div>
            {activeMode === "Search" && (
              <div className='flex items-center bg-pink-50 rounded-2xl w-full px-3 py-2 mb-2'>
                <input
                  type="text"
                  value={topSearchQuery}
                  onChange={(e) => setTopSearchQuery(e.target.value)}
                  placeholder="Search tops..."
                  className="flex-1 border-none outline-none bg-inherit text-xs text-gray-800 placeholder-gray-400"
                />
              </div>
            )}
            <div className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth py-2">
              {(isAiLoading || isRefining) && activeMode === "AI Search" ? (
                <div className="flex flex-col items-center justify-center w-full h-full text-pink-500 animate-pulse">
                  <RefreshCcw size={24} className="animate-spin" />
                  <p className="mt-2 text-xs font-semibold">Finding your vibe...</p>
                </div>
              ) : (
                filteredTops.map((item) => (
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
                )))}
          </div>
          </div>

          <div className="flex flex-col items-center justify-start w-full h-[400px]">
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
                    <Camera size={50}/>
                  </div>
                  <p className="text-gray-500 text-sm italic">
                    Upload your photo here
                  </p>
                </>
              )}
              {!isLoading && (
                <div className="absolute bottom-6 right-6">
                  <button 
                    onClick={handleIconClick} 
                    className="p-3 bg-white rounded-full shadow-lg text-pink-500 hover:scale-110 transition-transform"
                  >
                    <Upload size={24} />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center w-full mb-2">
              <h2 className="font-semibold text-pink-600 text-base border-b-2 border-pink-500 inline-block px-2">
                Bottoms
              </h2>
            </div>
            {activeMode === "Search" && (
              <div className='flex items-center bg-pink-50 rounded-2xl w-full px-3 py-2 mb-2'>
                <input
                  type="text"
                  value={bottomSearchQuery}
                  onChange={(e) => setBottomSearchQuery(e.target.value)}
                  placeholder="Search bottoms..."
                  className="flex-1 border-none outline-none bg-inherit text-xs text-gray-700 placeholder-gray-400"
                />
              </div>
            )}
            <div className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth py-2">
              {(isAiLoading || isRefining) && activeMode === "AI Search" ? (
                <div className="flex flex-col items-center justify-center w-full h-full text-pink-500 animate-pulse">
                  <RefreshCcw size={24} className="animate-spin" />
                  <p className="mt-2 text-xs font-semibold">Finding your vibe...</p>
                </div>
              ) : (
                filteredBottoms.map((item) => (
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
                )))}
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
                : "bg-gradient-to-r from-pink-500 via-pink-600 to-purple-500 hover:scale-105"
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