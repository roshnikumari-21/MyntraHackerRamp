import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 sm:px-6 shadow-sm border-b bg-white">
      {/* Logo */}
      <Link to="/">
        <img src={assets.myntra2} className="w-[60px] sm:w-[70px]" alt="logo" />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden lg:flex gap-4 text-[13px] font-semibold text-gray-800">
        <NavLink
          to="/WishRoomHome"
          className="flex items-baseline gap-1 hover:text-pink-600 relative"
        >
          <span className="text-[10px] font-bold text-pink-500 absolute -top-2">
            Style
          </span>
          <span className="text-[14px] ml-6 text-gray-800">SYNC</span>
        </NavLink>
        <NavLink to="/men" className="hover:text-pink-600">MEN</NavLink>
        <NavLink to="/women" className="hover:text-pink-600">WOMEN</NavLink>
        <NavLink to="/kids" className="hover:text-pink-600">KIDS</NavLink>
        <NavLink to="/genz" className="hover:text-pink-600">GENZ</NavLink>
        <NavLink to="/swyft" className="hover:text-pink-600 relative flex items-center gap-1">
          <img src={assets.swyft_logo} className="w-5 h-5" alt="swyft" />
          SWYFT
          <span className="absolute -top-2 -right-5 text-xs text-pink-500 font-bold">NEW</span>
        </NavLink>
      </ul>

      {/* Right Icons */}
      <div className="flex items-center gap-5 md:gap-6">
        {/* Search */}
        <div
          className="flex flex-col items-center cursor-pointer text-center"
          onClick={() => {
            setShowSearch(true);
            navigate("/collection");
          }}
        >
          <img src={assets.search_icon} className="w-6 md:w-[27px]" alt="search" />
          <p className="text-[10px] sm:text-xs text-gray-700 font-medium">Search</p>
        </div>

        {/* Wishlist (desktop only) */}
        <Link to="/Wishlist" className="hidden lg:flex flex-col items-center text-center">
          <img src={assets.heart_icon} className="w-5 md:w-7" alt="wishlist" />
          <p className="text-[10px] sm:text-xs text-gray-700 font-medium">Wishlist</p>
        </Link>

        {/* Cart (desktop only) */}
        <Link to="/cart" className="hidden sm:flex flex-col items-center relative text-center">
          <img src={assets.cart_icon} className="w-5 md:w-6" alt="cart" />
          <p className="text-[10px] sm:text-xs text-gray-700 font-medium">Bag</p>
          {getCartCount() > 0 && (
            <span className="absolute -top-1 right-1 bg-red-500 text-white text-[9px] sm:text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              {getCartCount()}
            </span>
          )}
        </Link>

        {/* Profile (desktop) */}
        <div className="hidden lg:block group relative text-center">
          <div className="flex flex-col items-center">
            <img
              onClick={() => (token ? null : navigate("/login"))}
              src={assets.profile_icon}
              className="w-5 md:w-6 cursor-pointer mx-auto"
              alt="profile"
            />
            <p className="text-[10px] sm:text-xs text-gray-700 font-medium">Profile</p>
          </div>
          
          {token && (
            <div className="hidden group-hover:block absolute right-0 mt-0 w-36 py-3 px-4 bg-white border rounded shadow-md z-50">
              <p
                onClick={() => navigate("/orders")}
                className="cursor-pointer hover:text-black text-gray-600 mb-2"
              >
                Orders
              </p>
              <p
                onClick={logout}
                className="cursor-pointer hover:text-black text-gray-600"
              >
                Logout
              </p>
            </div>
          )}
        </div>

        {/* Mobile SWYFT Logo */}
        <div className="flex flex-col items-center lg:hidden text-center">
          <Link to="/swyft">
            <img src={assets.swyft_logo} className="w-7 h-7" alt="swyft" />
          </Link>
          <p className="text-[10px] text-gray-700 font-medium">SWYFT</p>
        </div>

        {/* Mobile Menu */}
        <div
          className="flex flex-col items-center lg:hidden cursor-pointer"
          onClick={() => setVisible(true)}
        >
          <img src={assets.menu_icon} className="w-6" alt="menu" />
          <p className="text-[10px] text-gray-700 font-medium">Menu</p>
        </div>
      </div>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 bg-white transition-all duration-300 shadow-md z-50 ${
          visible ? "w-64" : "w-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-4 cursor-pointer border-b"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>

          {/* Profile in Sidebar */}
          <div className="py-3 px-6 border-b hover:bg-gray-100 cursor-pointer">
            {token ? (
              <div>
                <p
                  onClick={() => {
                    setVisible(false);
                    navigate("/orders");
                  }}
                  className="mb-2"
                >
                  Orders
                </p>
                <p
                  onClick={() => {
                    logout();
                    setVisible(false);
                  }}
                >
                  Logout
                </p>
              </div>
            ) : (
              <p
                onClick={() => {
                  setVisible(false);
                  navigate("/login");
                }}
              >
                Profile
              </p>
            )}
          </div>

          {/* Sidebar Links */}
          <NavLink onClick={() => setVisible(false)} className="py-3 px-6 border-b hover:bg-gray-100" to="/WishRoomHome">
            Style Sync
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 px-6 border-b hover:bg-gray-100" to="/Wishlist">
            Wishlist
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 px-6 border-b hover:bg-gray-100" to="/cart">
            Cart
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 px-6 border-b hover:bg-gray-100" to="/men">
            MEN
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 px-6 border-b hover:bg-gray-100" to="/women">
            WOMEN
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 px-6 border-b hover:bg-gray-100" to="/kids">
            KIDS
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 px-6 border-b hover:bg-gray-100" to="/genz">
            GENZ
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 px-6 border-b hover:bg-gray-100 flex items-center gap-2" to="/swyft">
            <img src={assets.swyft_logo} className="w-6" alt="swyft" />
            SWYFT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

