import React from 'react'
import type { Route } from './+types/dashboard'
import DashBoard from './dashboard'
import { Outlet } from 'react-router'
import { NavItems } from '@/components/NavItems'
const adminLayout = () => {
  return (
    <div className='admin-layout'>
        <aside className='w-[270px] h-screen  '>
            <NavItems/>
        </aside>
        <aside className='children pl-3'>
            <Outlet/>
        </aside>
        
        
    </div>
  )
}

export default adminLayout