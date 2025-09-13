import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
  const { setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('collection')) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  const handleSearch = () => {
    setSearch(localSearch.trim());
  };

  return showSearch && visible ? (
    <div className="flex justify-center my-4 px-2 sm:px-4">
      <div className="p-[3px] rounded-full bg-gradient-to-r from-red-300 via-pink-300 via-orange-300 to-yellow-300 w-full max-w-2xl">
        <div className="relative flex items-center bg-white rounded-full px-4 sm:px-5 py-2 sm:py-2.5 w-full">
          <div className="flex items-center text-black justify-center mr-2 sm:mr-3 text-xl sm:text-2xl">
            🧠
          </div>
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="flex-1 bg-transparent text-black font-bold placeholder-black placeholder:font-bold text-sm sm:text-base focus:ring-0 border-none outline-none"
            type="text"
            placeholder="Vibe Search..."
          />
          <img
            onClick={handleSearch}
            className="w-5 sm:w-6 cursor-pointer opacity-80 hover:opacity-100 transition-opacity ml-2 sm:ml-3"
            src={assets.search_icon}
            alt="Search"
          />

          <img
            onClick={() => setShowSearch(false)}
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer opacity-70 hover:opacity-100 ml-2 sm:ml-3"
            src={assets.cross_icon}
            alt="Close Search"
          />
        </div>
      </div>
    </div>
  ) : null;
};

export default SearchBar;






