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
    name: "All Users",
    href: "/all-users",
    alt: "All trips logo",
    img: itenaryIcon,
  },
  {
    id: 3,
    name: "AI Trips",
    href: "/all-trips",
    alt: "AI trips logo",
    img: usersIcon,
  },
];


export default navData;