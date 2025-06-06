import React, { useState } from 'react'
import { Link, Navigate, NavLink, redirect, useLoaderData, useNavigate } from 'react-router'
import navData from './NavData'
import { cn } from '@/lib/utils'
import { getUser, logout } from '@/auth/auth'
import { FaUser } from "react-icons/fa"
export const NavItems = ({handleClick}:{handleClick?:()=>void}) => {
    const [isActive,setIsActive] = useState(Boolean);
    const navigate = useNavigate();
   
    const user = useLoaderData();

    const handleLogout =async ()=>{
       await logout();
       return navigate("/sign-in")
    }

  return (
    <section className='nav-items'>
        <Link to={'/'} className='link-logo max-md:hidden'>
            <img src={'/icons/logo.svg'} alt=""/>
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
                <img src={'/icons/user.svg'} alt="user image" referrerPolicy="no-referrer"/>
                <article>
                    <h2>
                        {user?.name}
                    </h2>
                    <h2>
                        {user?.email}
                    </h2>
                </article>


                <button
                 onClick={handleLogout}
                >
                <img src='/icons/logout.svg' alt='logout'  className='h-7 w-7 text-black'/>
                </button>
            </footer>
        </div>
    </section>
  )
}

