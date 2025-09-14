import React from "react";
import img1 from "../assets/images/b1.webp";
import img2 from "../assets/images/b2.webp";
import img3 from "../assets/images/b3.webp";
import img4 from "../assets/images/b4.webp";
import img5 from "../assets/images/b5.webp";

const deals = [
  {
    img: img1,
    title: "Lakmé",
    offer: "Up To 50% Off",
    desc: "22-Hours Long-Lasting Peta Approved",
  },
  {
    img: img2,
    title: "Style With Ease",
    offer: "T-Shirts Starting ₹199",
    desc: "",
  },
  {
    img: img3,
    title: "Anouk & Libas",
    offer: "Kurta Sets 50-70% Off",
    desc: "",
  },
  {
    img: img4,
    title: "Forever Classics",
    offer: "Denim Styles 50-70% Off",
    desc: "",
  },
  {
    img: img5,
    title: "Inc.5 & More",
    offer: "Flat & Heels Min. 50% Off",
    desc: "",
  },
];

const DealOfTheDay = () => {
  return (
    <div className="py-5">
      <h2 className="text-2xl font-bold mb-6">DEAL OF THE DAY</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {deals.map((deal, i) => (
          <div
            key={i}
            className=" shadow hover:shadow-lg transition cursor-pointer"
          >
            <img
              src={deal.img}
              alt={deal.title}
              className="w-full h-[230px] object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealOfTheDay;
