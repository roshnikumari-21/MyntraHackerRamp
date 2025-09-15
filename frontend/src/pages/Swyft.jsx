import React, { useContext, useEffect } from "react";
import SwyftCard from "../components/SwyftCard";
import { ShopContext } from "../context/ShopContext";

const Swyft = () => {
  const { products } = useContext(ShopContext);

  return (
    <div
      className="
        h-screen
        overflow-y-scroll
        snap-y snap-mandatory
        scrollbar-hide
      "
    >
      {products.map((product) => (
        <SwyftCard
          key={product._id}
          className="snap-start"
          image={product.image || "/images/default.jpg"}
          brand={product.brand}
          title={product.name}
          price={product.price}
          likes={product.likes || 0}
          sizes={product.sizes || []}
        />
      ))}
    </div>
  );
};

export default Swyft;



