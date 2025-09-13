import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Carousel from '../components/Carousel'
import DealOfTheDay from '../components/DealOfTheDay'
import CategoriesToBag from '../components/CategoriesToBag'
import DealsOnLatestArrivals from '../components/DealsOnLatestArrivals'
import ColoursOfTheSeason from '../components/ColoursOfTheSeason'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <Carousel/>
      <DealOfTheDay/>
      <CategoriesToBag/>
      <DealsOnLatestArrivals/>
      <ColoursOfTheSeason/>
      <Footer/>
    </div>
  )
}

export default Home
