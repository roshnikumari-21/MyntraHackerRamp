import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 text-sm mt-10 border-t">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Online Shopping */}
        <div>
          <h3 className="font-bold mb-3">ONLINE SHOPPING</h3>
          <ul className="space-y-1">
            <li>Men</li>
            <li>Women</li>
            <li>Kids</li>
            <li>Home & Living</li>
            <li>Beauty</li>
            <li>Gift Cards</li>
            <li>Myntra Insider</li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="font-bold mb-3">USEFUL LINKS</h3>
          <ul className="space-y-1">
            <li>Contact Us</li>
            <li>FAQ</li>
            <li>T&C</li>
            <li>Terms Of Use</li>
            <li>Track Orders</li>
            <li>Shipping</li>
            <li>Cancellation</li>
            <li>Returns</li>
            <li>Whitehat</li>
            <li>Blog</li>
            <li>Careers</li>
            <li>Privacy Policy</li>
            <li>Site Map</li>
            <li>Corporate Information</li>
          </ul>
        </div>

        {/* App Download */}
        <div>
          <h3 className="font-bold mb-3">EXPERIENCE MYNTRA APP ON MOBILE</h3>
          <div className="flex gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
              className="h-12 cursor-pointer"
            />
          </div>

          <h3 className="font-bold mt-6 mb-3">KEEP IN TOUCH</h3>
          <div className="flex gap-4 text-xl">
            <FaFacebookF className="cursor-pointer hover:text-blue-600" />
            <FaTwitter className="cursor-pointer hover:text-blue-400" />
            <FaInstagram className="cursor-pointer hover:text-pink-500" />
            <FaYoutube className="cursor-pointer hover:text-red-600" />
          </div>
        </div>

        {/* Assurances */}
        <div className="space-y-4">
          <div>
            <p className="font-bold">100% ORIGINAL guarantee</p>
            <p>for all products at myntra.com</p>
          </div>
          <div>
            <p className="font-bold">Return within 30days</p>
            <p>of receiving your order</p>
          </div>
        </div>
      </div>

      {/* Popular Searches */}
      <div className="bg-white border-t py-6 px-6 max-w-7xl mx-auto">
        <h3 className="font-bold mb-2">POPULAR SEARCHES</h3>
        <p className="text-xs text-gray-600">
          Makeup | Dresses For Girls | T-Shirts | Sandals | Headphones | Babydolls | Blazers For Men |
          Handbags | Ladies Watches | Bags | Sport Shoes | Reebok Shoes | Puma Shoes | Boxers | Wallets |
          Tops | Earrings | Fastrack Watches | Kurtis | Nike | Smart Watches | Titan Watches | Designer Blouse |
          Gowns | Rings | Cricket Shoes | Forever 21 | Eye Makeup | Photo Frames | Punjabi Suits | Bikini |
          Myntra Fashion Show | Lipstick | Saree | Watches | Dresses | Lehenga | Nike Shoes | Goggles | Bras |
          Suit | Chinos | Shoes | Adidas Shoes | Woodland Shoes | Jewellery | Designers Sarees
        </p>
      </div>

      {/* Bottom Copyright */}
      <div className="text-center py-4 text-xs text-gray-500 border-t">
        © 2022 www.myntra.com. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
