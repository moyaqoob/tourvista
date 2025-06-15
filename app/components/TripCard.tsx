import { cn } from "@/lib/utils";
import { icons } from "public/assets";
import { Link, useLocation } from "react-router";




const TripCard = ({
  id,
  name,
  imageUrl,
  location,
  tags,
  price,
}: TripCardProps) => {
  const path = useLocation();
  const generateDynamicStyle = (tag: string) => {
    const colors = [
      "#ECFDF3",
      "#F3F0FB",
      "#F0F9FF",
      "#F8F9FC",
      "#F7EDF6",
      "#FFF4ED",
      "#FFF1F3",
    ];
    const textColors = [
      "#027A48",
      "#6941C6",
      "#026AA2",
      "#363F72",
      "#C11574",
      "#B93815",
      "#C01048",
    ];

    // Use a simple hash function to determine the index
    const index =
      [...tag].reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;

    return `bg-[${colors[index]}] text-[${textColors[index]}]`;
  };
  return (
    <Link
      to={
        path.pathname === "/" || path.pathname === "/travels"
          ? `/travel/${id}`
          : `/trips/${id}`
      }
      className={" relative rounded-md bg-white"}
    >
      <img src={imageUrl} alt="Image Url" />

      <article className="pb-3">
        <h2>{name}</h2>
        <figure className="-bottom-2">
          <img src={icons.locationMark} className="size-4" alt="location " />

          <figcaption className="text-base">{location}</figcaption>
        </figure>
      </article>

      <div className="flex gap-2 pb-5 px-4 mt-1">
        {tags.map((tag:string) => (
          <div
            key={tag}
            className={cn(
              `text-sm border rounded-xl px-2 py-1 ${generateDynamicStyle(tag)}`
            )}
          >
            {tag}
          </div>
        ))}
      </div>

      <article className="tripCard-pill bg-white">{price}</article>
    </Link>
  );
};

export default TripCard;
