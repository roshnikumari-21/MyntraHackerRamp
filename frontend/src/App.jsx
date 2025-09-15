import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Men from './pages/Men'
import Women from './pages/Women'
import Kids from './pages/Kids'
import Product from './pages/Product'
import Swyft from './pages/Swyft'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import WishRoom from './pages/WishRoom'
import WishRoomHome from './pages/WishRoomHome'
import SearchBar from './components/SearchBar'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import WishList from './pages/WishList'

const App = () => {
  const location = useLocation()

  // track window width
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // hide navbar on /swyft only if mobile
  const hideNavbarOn = ['/swyft']
  const shouldHideNavbar = hideNavbarOn.includes(location.pathname) && isMobile

  return (
    <div>
      <ToastContainer />
      {!shouldHideNavbar && <Navbar />}
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/men' element={<Men />} />
        <Route path='/women' element={<Women />} />
        <Route path='/kids' element={<Kids />} />
        <Route path='/swyft' element={<Swyft />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/WishRoom' element={<WishRoom />} />
        <Route path='/WishRoomHome' element={<WishRoomHome />} />
        <Route path='/wishlist' element={<WishList />} />
      </Routes>
    </div>
  )
}

export default App

