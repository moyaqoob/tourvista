import React from 'react'
import { Outlet } from 'react-router'

const pagelayout = () => {
  return (
    <div className='page-layout'>
      <aside>
          <Outlet/>
      </aside>
    </div>
  )
}

export default pagelayout