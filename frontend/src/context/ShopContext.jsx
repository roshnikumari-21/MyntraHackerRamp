import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { prod } from "../assets/assets";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([...prod]);
  const [token, setToken] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [wishlistedItems, setWishlistedItems] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const navigate = useNavigate();

  // ---------------- Search ----------------
  const getSearchResults = (searchQuery) => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  // ---------------- Cart ----------------
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const addMultipleToCart = async (items) => {
    if (!items || items.length === 0) return;

    let cartData = structuredClone(cartItems);

    items.forEach(({ itemId, size }) => {
      if (!size) {
        toast.error("Select Product Size");
        return;
      }

      if (cartData[itemId]) {
        if (cartData[itemId][size]) {
          cartData[itemId][size] += 1;
        } else {
          cartData[itemId][size] = 1;
        }
      } else {
        cartData[itemId] = {};
        cartData[itemId][size] = 1;
      }
    });

    setCartItems(cartData);

    if (token) {
      try {
        await Promise.all(
          items.map(({ itemId, size }) =>
            axios.post(
              backendUrl + "/api/cart/add",
              { itemId, size },
              { headers: { token } }
            )
          )
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch {}
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch {}
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts((prevProducts) => [
          ...prevProducts,
          ...response.data.products.reverse(),
        ]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
const getRecommendations = async () => {
  try {
    const simplifiedProducts = products.slice(0, 10).map(({ name, _id }) => ({ name, _id }));
    const simplifiedWishlist = wishlistedItems.slice(0, 10).map(({ name, _id }) => ({ name, _id }));
    
    const simplifiedCart = Object.entries(cartItems).slice(0, 10).map(([itemId, sizes]) => ({
      itemId,
      sizes: Object.entries(sizes).map(([size, quantity]) => ({ size, quantity }))
    }));

    const hasUserData =
      Object.keys(cartItems).length > 0 ||
      wishlistedItems.length > 0 ||
      searchHistory.length > 0;

    if (!hasUserData) {
      setRecommendedItems([]); 
      return;
    }

    const prompt = `
      You are a shopping assistant. Based on the following user data, recommend the relevant products from the given product catalog.
      
      Cart Items: ${JSON.stringify(simplifiedCart, null, 2)}
      Wishlisted Items: ${JSON.stringify(simplifiedWishlist, null, 2)}
      Search History: ${JSON.stringify(searchHistory, null, 2)}
      
      Product Catalog: ${JSON.stringify(simplifiedProducts, null, 2)}
      
      Return only a JSON array of recommended product IDs from the catalog, nothing else.
    `;

    const response = await axios.post(apiUrl, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    let aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    if (aiText.startsWith("```json")) {
      aiText = aiText.substring(7);
    }
    if (aiText.endsWith("```")) {
      aiText = aiText.slice(0, -3);
    }
    aiText = aiText.trim();

    let recommendedIds = [];
    try {
      recommendedIds = JSON.parse(aiText);
    } catch (e) {
      console.error("Failed to parse Gemini response:", e);
      console.log("Raw AI response text:", aiText);
    }

    const aiRecommended = products.filter((p) =>
      recommendedIds.includes(p._id)
    );

    const combined = [
      ...wishlistedItems,
      ...aiRecommended.filter(
        (aiItem) => !wishlistedItems.some((w) => w._id === aiItem._id)
      ),
    ];
    
    setRecommendedItems(combined);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    setRecommendedItems(wishlistedItems);
  }
};

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
    if (token) {
      getUserCart(token);
    }
  }, [token]);

  useEffect(() => {
    const bestsellers = products.filter((p) => p.bestseller === true);
    setWishlistedItems(bestsellers);
  }, [products]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (products.length > 0) {
        getRecommendations();
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [cartItems, wishlistedItems ,searchHistory ]);

  

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    addMultipleToCart,
    searchHistory,
    setSearchHistory,
    searchResults,
    getSearchResults,
    wishlistedItems,
    recommendedItems,
    getRecommendations,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
