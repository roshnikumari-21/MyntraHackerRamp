import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductItem from '../components/ProductItem'
import Title from '../components/Title'

const WishList = () => {
  const { products } = useContext(ShopContext)
  const [bestSeller, setBestSeller] = useState([])

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller)
    setBestSeller(bestProduct)
  }, [products])

  return (
    <>
      <div className="pt-10 px-[10px] border-t">
        <div className="flex justify-between items-center mb-6">
          <Title text1={'MY'} text2={'WISHLIST'} />
          <p className="text-gray-600 text-sm sm:text-base">
            {bestSeller.length} items
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSeller.length > 0 ? (
            bestSeller.map((item, index) => (
              <div
                key={index}
                className="relative group border rounded-xl shadow-sm hover:shadow-md transition p-2"
              >
                <ProductItem
                  id={item._id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                />
                <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md opacity-80 hover:opacity-100">
                  <img
                    src="https://img.icons8.com/ios-glyphs/30/fa314a/like.png"
                    alt="wishlist"
                    className="h-5 w-5"
                  />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No bestseller items available
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default WishList
