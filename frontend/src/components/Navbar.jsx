
import { Button } from './ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/userSlice';

function Navbar() {
  const {user} = useSelector(store=>store.user)
  const [showMenu, setShowMenu] = useState(false)
  const accessToken = localStorage.getItem('accessToken')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const logoutHandler = async()=>{
      try {
        const res = await axios.post(`http://localhost:8000/api/v1/user/logout`, {}, {
          headers:{
            Authorization:`Bearer ${accessToken}`
          }
        })        
        if(res.data.success){
          dispatch(setUser(null))
          toast.success(res.data.message)
        }
      } catch (error) {
        console.log(error);
        toast.error("Logout error")
      }
  }  
  return (
    <header className="top-0 bg-pink-50 fixed w-full z-20 border-b border-pink-200">
      <div className="relative max-w-7xl mx-auto flex justify-between items-center py-5 px-2">

        {/* logo section */}
        <div >
          <img src="/logo.png" className='max-w-40' alt="" />
        </div>

        {/* nav section */}
        <nav className="flex gap-10 justify-between items-center ">
          {/* Desktop */}
          <ul className="hidden sm:flex  md:gap-10 gap-5  items-center text-lg font-semibold">
            <Link to={"/"}><li>Home</li></Link>
            <Link to={"/products"}><li>Products</li></Link>
            {user && (
              <Link to={`/profile/${user._id}`}><li>Hello, {user.firstName}</li></Link>
            )}
            <div className='flex items-center justify-center md:gap-12 gap-10 '>
              <Link to={"/cart"} className="relative">
                <ShoppingCart />
                <span className="bg-blue-600 rounded-full absolute text-white -top-3 -right-5 px-2">
                  0
                </span>
              </Link>
              {user ? (
                <Button onClick={logoutHandler} className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer text-[18px] px-6 py-5.5">Logout</Button>
              ) : (
                <Button onClick={()=>navigate('/login')} className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer text-[18px] px-6 py-5.5">Login</Button>
              )}
            </div>

          </ul>

          {/* Mobile Menu  */}

          <div className='flex sm:hidden gap-10'>
            {showMenu && (
              <ul className="absolute bg-pink-50 border z-50 border-gray-500/20 top-21 left-1/2 -translate-x-1/2 right-5 w-4/5 max-w-120 mr-6 items-center py-5 rounded-md  flex flex-col gap-4    text-md font-semibold">
                <Link to={"/"}><li>Home</li></Link>
                <Link to={"/products"}><li>Products</li></Link>
                <div className='flex  flex-col gap-3'>
                  {user && (
                    <Link to={"/profile"}>Hello User</Link>
                  )}
                  {user ? (
                    <Button onClick={logoutHandler} className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer text-lg px-4 py-4.5">Logout</Button>
                  ) : (
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer text-lg px-4 py-4.5">Login</Button>
                  )}
                </div>
              </ul>
            )}
            <Link to={"/cart"} className="relative">
              <ShoppingCart />
              <span className="bg-blue-600 rounded-full absolute text-white -top-3 -right-5 px-2">
                0
              </span>
            </Link>
            {showMenu ? (
              < IoClose onClick={() => setShowMenu(false)} className='w-7 h-7' />
            ) : (
              <FiMenu onClick={() => setShowMenu(true)} className='w-7 h-7' />
            )}
          </div>


        </nav>
      </div>
    </header>
  )
}

export default Navbar
