import React, { useState } from 'react'
import { Link, NavLink } from 'react-router'
import logo from "@public/icons/logo.svg"
import navData from './NavData'
import { cn } from '@/lib/utils'
import images from '@public/assets'
import { icons } from '@public/assets'
export const NavItems = ({handleClick}:{handleClick?:()=>void}) => {
    const [isActive,setIsActive] = useState(Boolean);

    const user = {
    name: "yaqoob",
    email: "moyaqoob28@gmail.com",
    img : images.david
    };

  return (
    <section className='nav-items'>
        <Link to={'/'} className='link-logo max-md:hidden'>
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
                            })} onClick={handleClick}>
                                <img 
                                className='group-hover:stroke-black'
                                src={img} 
                                alt=""/>
                                <p className='text-2xl '>{name} </p>
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>
            <footer className='nav-footer'>
                <img src={user.img} alt=""/>
                <article>
                    <h2>
                        {user.name}
                    </h2>
                    <h2>
                        {user.email}
                    </h2>
                </article>


                <button
                 onClick={()=>{
                    console.log("logout")
                 }}
                >
                    
                </button>
            </footer>
        </div>
    </section>
  )
}

