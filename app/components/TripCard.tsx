import { icons } from "public/assets";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Link, useLocation } from "react-router";

const TripCard = ({
  id,
  name,
  imageUrl,
  location,
  tags,
  price,
  onDelete, // Make onDelete optional
}: TripCardProps & { onDelete?: (id: string) => void }) => {
  const path = useLocation();
  const [showModal, setShowModal] = useState(false);

  const generateDynamicStyle = (tag: string) => {
    const colors = [
      "#D8FFE8", // Fresh Mint Green
      "#EAD9FF", // Soft Lavender
      "#D2F4FF", // Crystal Blue
      "#EFF0FF", // Misty Lilac
      "#FDD6EE", // Rosy Blush
      "#FFE6D6", // Creamy Apricot
      "#FFD6E0", // Rose Quartz
    ];

    const textColors = [
      "#005D37", // Deep Forest Green
      "#5D31A5", // Rich Royal Purple
      "#016A91", // Bold Sapphire
      "#2F3566", // Classic Navy
      "#AB0E61", // Vibrant Magenta
      "#A13610", // Burnt Sienna
      "#A90C3D", // Ruby Red
    ];

    // Use a simple hash function to determine the index
    const index =
      [...tag].reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;

    return {
      backgroundColor: colors[index],
      color: textColors[index],
    };
  };

  return (
    <div className="relative rounded-md bg-white">
      {/* Link wraps only the main content */}
      <Link
        to={
          path.pathname === "/" || path.pathname === "/travels"
            ? `/travel/${id}`
            : `/trips/${id}`
        }
      >
        <img src={imageUrl} alt="Image Url" />
        <article className="pb-3">
          <h2>{name}</h2>
          <figure className="-bottom-2">
            <img src={icons.locationMark} className="size-4" alt="location " />
            <figcaption className="text-base">{location}</figcaption>
          </figure>
        </article>
      </Link>

      {/* Trash button and modal are outside the Link */}
      <button
        className="absolute right-0 top-[0%] p-2 text-red-500 opacity-100 bg-transparent rounded-full cursor-pointer hover:opacity-100 hover:text-red-600"
        onClick={(e) => {
          e.preventDefault(); // Prevent navigation
          setShowModal(true);
        }}
      >
        <FaTrash />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-dark-100">
              Are you sure you want to delete this trip?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-700"
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation
                  setShowModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation
                  if (onDelete) {
                    onDelete(id); // Call onDelete only if provided
                  }
                  setShowModal(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 pb-5 px-4 mt-1">
        {Array.isArray(tags) &&
          tags.map((tag: string) => {
            if (typeof tag !== "string") {
              console.error("Invalid tag:", tag); // Debugging log
              return null; // Skip invalid tags
            }

            const style = generateDynamicStyle(tag);
            return (
              <div
                key={tag}
                className="text-sm border rounded-xl px-2 py-1"
                style={style}
              >
                {tag}
              </div>
            );
          })}
      </div>

      <article className="tripCard-pill bg-white">{price}</article>
    </div>
  );
};

export default TripCard;
