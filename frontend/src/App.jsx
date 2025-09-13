import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'
import Collection from './pages/Collection'
import Men from './pages/Men'
import Women from './pages/Women'
import Kids from './pages/Kids'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import WishRoom from './pages/WishRoom'
import WishRoomHome from './pages/WishRoomHome'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import WishList from './pages/WishList'

const App = () => {
  return (
    <div className="px-2 sm:px-[2vw] md:px-[3vw] lg:px-[4vw]">
      <ToastContainer />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/men' element = {<Men/>}/>
        <Route path='/women' element = {<Women/>}/>
        <Route path='/kids' element = {<Kids/>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/verify' element={<Verify />} />
        <Route path = '/WishRoom' element = {<WishRoom/>}/>
        <Route path = '/WishRoomHome' element = {<WishRoomHome/>}/>
        <Route path='/wishlist' element = {<WishList/>}/>
        <Route path='/adminLogin/*' element = {<AdminLogin/>}/>
      </Routes>
    </div>
  )
}

export default App
