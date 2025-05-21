import React from 'react'

interface ButtonProps{
    text:string
}

const Button = ({text}:ButtonProps) => {
  return (
    <button className='button-class w-56 h-11'>
        <span>+</span>{text}
    </button>
  )
}

export default Button