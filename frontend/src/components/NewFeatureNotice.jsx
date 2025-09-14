import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const NewFeatureNotice = () => {
  return (
    <div className="flex mb-2 justify-center items-center bg-gradient-to-r from-purple-300 to-pink-300 animate-fade-in">
      <Link to="/WishRoomHome" className="flex items-center space-x-2 text-white font-medium text-xs sm:text-sm md:text-base px-2 py-2 rounded-full transform transition-transform duration-300 group">
        <div className="flex items-center space-x-1">
          <Sparkles size={16} className="text-pink-900 animate-pulse" />
          <span>New Features Released:</span>
        </div>
        <span className="font-bold ml-1">Virtual Try-On, Style Sync, and Vibe Search!</span>
        <ArrowRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform hidden sm:block" />
      </Link>
    </div>
  );
};

export default NewFeatureNotice;

