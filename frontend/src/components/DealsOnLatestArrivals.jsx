import React from "react";

// Import your images
import deal1 from "../assets/images/mm1-1.gif";
import deal2 from "../assets/images/mm1-2.gif";
import deal3 from "../assets/images/mm2-1.gif";
import deal4 from "../assets/images/mm2-2.gif";

const DealsOnLatestArrivals = () => {
  const deals = [deal1, deal2, deal3, deal4];

  return (
    <section className="max-w-9xl mx-auto py-10">
      <h2 className="text-xl md:text-2xl font-bold mb-6">
        DEALS ON LATEST ARRIVALS
      </h2>

      {/* Horizontal scrollable container */}
      <div className="flex overflow-x-auto scrollbar-hide">
        {deals.map((deal, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 h-[350px] w-[250px] sm:w-[300px] md:w-[400px]"
          >
            <img
              src={deal}
              alt={`Deal ${idx + 1}`}
              className="rounded-lg h-[350px] shadow-md w-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default DealsOnLatestArrivals;
