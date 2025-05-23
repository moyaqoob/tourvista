import React from 'react'
import { Link, useLocation } from 'react-router'
import { icons } from '@public/assets';
import pkg from "@syncfusion/ej2-react-buttons"
import { cn, getFirstWord } from '@/lib/utils';
const {ChipDirective,ChipListComponent}  = pkg;
const TripCard = ({id,name,imageUrl,location,tags,price}:TripCardProps) => {
  const path = useLocation();
  return (
    <Link to={path.pathname === "/" || path.pathname === "/travels"?
      `/travel/${id}` : `/trips/${id}`} className={" relative rounded-md bg-white "}>
        <img src={imageUrl} alt="Image Url"/>

        <article>
            <h2>{name}</h2>
          <figure>
            <img src={icons.locationMark} className='size-4' alt="location "/>
            
            <figcaption>
            {location}
            </figcaption>
          </figure>
        </article>

        <div className='mt-5 pl-[18px] pr-3.5 text-black pb-5'>
            <ChipListComponent id='travel-chip'>
                {tags.map((tag,index)=>(
                  <ChipDirective
                    key={index}
                    text={getFirstWord(tag)}
                    cssClass={cn(index===1?"bg-pink-50 !text-pink-500":"!bg-success-50 !text-success-700")}
                  />
              
                ))}
            </ChipListComponent>
        </div>

        <article className='tripCard-pill bg-white'>
          {price}
        </article>
    </Link>
  )
}

export default TripCard