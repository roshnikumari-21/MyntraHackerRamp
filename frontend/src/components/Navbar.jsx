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
    <div className="flex items-center justify-between py-3 px-4 shadow-sm border-b bg-white">
      <Link to="/">
        <img src={assets.logo} className="w-[60px]" alt="logo" />
      </Link>

      <ul className="hidden lg:flex gap-3 text-[13px] font-semibold text-gray-800">
        <NavLink
          to="/WishRoomHome"
          className="flex items-baseline gap-1 hover:text-pink-600 relative"
        >
          <span className="text-[10px] font-bold text-pink-500 absolute -top-2">
            WishList
          </span>
          <span className="text-[14px] font-bold ml-6 text-gray-800">
            TryON
          </span>
        </NavLink>
        <NavLink to="/men" className="hover:text-pink-600">
          MEN
        </NavLink>
        <NavLink to="/women" className="hover:text-pink-600">
          WOMEN
        </NavLink>
        <NavLink to="/kids" className="hover:text-pink-600">
          KIDS
        </NavLink>
        <NavLink to="/genz" className="hover:text-pink-600">
          GENZ
        </NavLink>
        <NavLink to="/swyft" className="hover:text-pink-600 relative">
          SWYFT{" "}
          <span className="absolute -top-2 -right-5 text-xs text-pink-500 font-bold">
            NEW
          </span>
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        <div
          className="hidden md:flex items-center rounded-md"
          onClick={() => {
            setShowSearch(true);
            navigate("/collection");
          }}
        >
          <img src={assets.search_icon} className="w-5 mr-2" alt="search" />
        </div>
        <div className="group relative">
          <img
            onClick={() => (token ? null : navigate("/login"))}
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt="profile"
          />
          <p className="text-xs text-gray-700 font-medium text-center">
            Profile
          </p>

          {token && (
            <div className="hidden group-hover:block absolute right-0 mt-2 w-36 py-3 px-5 bg-white border rounded shadow-md">
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
        <Link to="/Wishlist" className="relative text-center">
          <div className="text-center cursor-pointer">
            <img
              src={assets.heart_icon}
              className="w-5 mx-auto"
              alt="wishlist"
            />
            <p className="text-xs text-gray-700 font-medium">Wishlist</p>
          </div>
        </Link>
        <Link to="/cart" className="relative text-center">
          <img src={assets.cart_icon} className="w-5 mx-auto" alt="cart" />
          <p className="text-xs text-gray-700 font-medium">Bag</p>
          {getCartCount() > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              {getCartCount()}
            </span>
          )}
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer lg:hidden"
          alt="menu"
        />
      </div>

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
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 px-6 border-b hover:bg-gray-100"
            to="/men"
          >
            MEN
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 px-6 border-b hover:bg-gray-100"
            to="/women"
          >
            WOMEN
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 px-6 border-b hover:bg-gray-100"
            to="/kids"
          >
            KIDS
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 px-6 border-b hover:bg-gray-100"
            to="/home"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 px-6 border-b hover:bg-gray-100"
            to="/beauty"
          >
            BEAUTY
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 px-6 border-b hover:bg-gray-100"
            to="/studio"
          >
            STUDIO
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
