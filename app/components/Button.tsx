import React from 'react'
import { cn } from '@/lib/utils'
interface ButtonProps{
    text:string,
    className?:string
    onClick?: ()=>void,
}

const Button = ({text,className}:ButtonProps) => {
  return (
    <button className={cn("button-class w-56 h-11",className)}>
        <span>+</span>{text}
    </button>
  )
}
export default Button