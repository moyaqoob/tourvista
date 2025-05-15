import React, { useState } from 'react'
import { Link, NavLink } from 'react-router'
import logo from "@public/icons/logo.svg"
import navData from './NavData'
import { cn } from '@/lib/utils'


export const NavItems = () => {
    const [isActive,setIsActive] = useState(Boolean);
  return (
    <section className='nav-items'>
        <Link to={'/'} className='link-logo'>
            <img src={logo} alt=""/>
            <p>Tourvista</p>
        </Link>

        <div className='container'> 
            <nav>
                {navData.map(({id,name,href,img})=>(
                    <NavLink to={href} key={id}>
                        {({isActive}:{isActive:boolean})=>(
                            <div className={cn('group nav-item',{
                                'bg-primary-100 !text-white':isActive
                            })}>
                                <img 
                                className='group-hover:stroke-white'
                                src={img} 
                                alt=""/>
                                <p className='text-2xl '>{name} </p>
                            </div>
                        )}
                    </NavLink>
                ))}

            </nav>
        </div>
    </section>
  )
}
