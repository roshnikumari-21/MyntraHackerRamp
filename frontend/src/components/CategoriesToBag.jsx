import React from "react";
import img1 from "../assets/images/c1.webp";
import img2 from "../assets/images/c2.webp";
import img3 from "../assets/images/c3.webp";
import img4 from "../assets/images/c4.webp";
import img5 from "../assets/images/c5.webp";
import img6 from "../assets/images/c6.webp";

const categories = [
  { img: img1, name: "Kurta Sets" },
  { img: img2, name: "Handbags" },
  { img: img3, name: "T-Shirts" },
  { img: img4, name: "Sarees" },
  { img: img5, name: "Jewellery" },
  { img: img6, name: "Teens Wear" },
];

const CategoriesToBag = () => {
  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold mb-6">CATEGORIES TO BAG</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-[10px] text-center">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="flex flex-col items-center cursor-pointer group"
          >
            {/* Responsive Image Box */}
            <div className="w-32 h-32 sm:w-32 sm:h-32 md:w-42 md:h-42 lg:w-48 lg:h-48 overflow-hidden border border-transparent group-hover:border-blue-500 transition">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesToBag;

