import React from "react";

// Import your images
import metallic from "../assets/images/u1.webp";
import olive from "../assets/images/u2.webp";
import cobalt from "../assets/images/u3.webp";
import white from "../assets/images/u4.jpg";
import pastels from "../assets/images/u5.webp";
import lime from "../assets/images/u6.webp";
import turquoise from "../assets/images/u7.webp";
import coffee from "../assets/images/u8.webp";

const ColoursOfTheSeason = () => {
  const colours = [
    { img: metallic, title: "Metallic Hues" },
    { img: olive, title: "Elegant Olive" },
    { img: cobalt, title: "Cobalt Blue" },
    { img: white, title: "Breezy White" },
    { img: pastels, title: "Soft Pastels" },
    { img: lime, title: "Electric Lime" },
    { img: turquoise, title: "Turquoise Blue" },
    { img: coffee, title: "Coffee Browns" },
  ];

  return (
    <section className="py-5">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        COLOURS OF THE SEASON
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {colours.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-52 object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ColoursOfTheSeason;
