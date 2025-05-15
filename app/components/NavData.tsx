import homeIcon from "@public/icons/home.svg";
import itenaryIcon from "@public/icons/itinerary.svg";
import usersIcon from "@public/icons/users.svg"

const navData = [
  {
    id: 1,
    name: "Dashboard",
    href: "/dashboard",
    alt: "Dashboard logo",
    img: homeIcon,
  },
  {
    id: 2,
    name: "All Trips",
    href: "/all-trips",
    alt: "All trips logo",
    img: itenaryIcon,
  },
  {
    id: 3,
    name: "AI Trip",
    href: "/ai-trip",
    alt: "AI trips logo",
    img: usersIcon,
  },
];


export default navData;