import React, { useEffect, useState } from 'react'
import Navbar2 from '../components/Navbar2'
import Sidebar from '../components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from '../pages/Add'
import List from '../pages/List'
import Ordersadmin from '../pages/Ordersadmin'
import Login2 from '../components/Login2'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '$'

const AdminLogin = () => {

  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');

  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

  return (
    <div className="px-2 sm:px-[2vw] md:px-[3vw] lg:px-[4vw]">
      <ToastContainer />
      {token === ""
        ? <Login2 setToken={setToken} />
        : <>
          <Navbar2 setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-4 text-gray-600 text-base'>
              <Routes>
                <Route path='add' element={<Add token={token} />} />
                <Route path='list' element={<List token={token} />} />
                <Route path='orders' element={<Ordersadmin token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default AdminLogin