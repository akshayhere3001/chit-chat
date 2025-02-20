import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router-dom';
import { LogOut, MessageSquare, Settings, User } from 'lucide-react';

const Navbar = () => {
  const { logout } = useAuthStore();

  return (
    <header className='fixed top-0 w-full border-b z-40 bg-white'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <div className='flex justify-between items-center h-full'>
          <Link to="/" className='flex items-center gap-1 hover:opacity-80 transition-all'>
            <div className='size-9 rounded-lg bg-[#f7f7f7] flex items-center justify-center'>
              <MessageSquare className='size-5 text-primary' />
            </div>
            <h1 className='font-bold text-lg'>𝚌𝚑𝚒𝚝-𝚌𝚑𝚊𝚝</h1>
          </Link>
        </div>

        <div className='flex items-center gap-5'>
            <Link to='/profile' className='flex items-center gap-1'>
              <User className='size-4'/>
              <span className='hidden sm:inline'>Profile</span>
            </Link>

          <Link to='/login' onClick={logout} className='flex items-center gap-1'>
            <LogOut className='size-4'/>
            <span className='hidden sm:inline'>Logout</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar