import React from 'react'
import { Link, useLocation } from 'react-router'
import { icons } from 'public/assets';
import { cn } from '@/lib/utils';

export type TagVariant = 'Historical' | 'Culture' | 'Shopping' | 'Culinary' | 'Relaxation' | 'Luxury' | 'Adventure';

const variantMap: Record<TagVariant,string> = {
  Historical : "bg-[#ECFDF3] text-[#027A48]",
  Culture: "bg-[#F3F0FB]  text-[#6941C6]",
  Luxury : "text-[#026AA2] bg-[#F0F9FF]",
  Culinary:'bg-[#F8F9FC] text-[#363F72]',
  Relaxation: "text-[#C11574] bg-[#F7EDF6]",
  Shopping: 'bg-[#FFF4ED] text-[#B93815] ',
  Adventure:'bg-[#FFF1F3] text-[#C01048]'
};



const TripCard = ({id,name,imageUrl,location,tags,price}:TripCardProps) => {
  const path = useLocation();
  return (
    <Link to={path.pathname === "/" || path.pathname === "/travels"?
      `/travel/${id}` : `/trips/${id}`} className={" relative rounded-md bg-white "}>
        <img src={imageUrl} alt="Image Url"/>

        <article className='pb-3'>
            <h2>{name}</h2>
          <figure className='-bottom-2'>
            <img src={icons.locationMark} className='size-4' alt="location "/>
            
            <figcaption className='text-base'>
            {location}
            </figcaption>
          </figure>
        </article>

        <div className='flex gap-2 pb-5 px-4 mt-1' >
        {tags.map((item: TagVariant)=>(
                <div key={item} className={cn(`text-md border rounded-full px-2 py-1 ${variantMap[item]}`)}>
                  {item}
                </div>
        ))}
        </div>

        <article className='tripCard-pill bg-white'>
          {price}
        </article>
    </Link>
  )
}

export default TripCard