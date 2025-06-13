import { logout } from "@/auth/auth";
import { account } from "@/auth/client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link, NavLink, useLoaderData, useNavigate } from "react-router";
import navData from "./NavData";
export const NavItems = ({ handleClick }: { handleClick?: () => void }) => {
  const [isActive, setIsActive] = useState(Boolean);
  const navigate = useNavigate();
  

  const user = useLoaderData();
  const secret = localStorage.getItem("secret");
  const handleLogout = async () => {
    await logout();
    await account.deleteSession("current");
    return navigate("/sign-in");
  };

  return (
    <section className="nav-items">
      <Link to={"/"} className="link-logo max-md:hidden">
        <img src={"/images/logo.svg"} alt="" />
        <p>Tourvista</p>
      </Link>

      <div className="container">
        <nav>
          {navData.map(({ id, name, href, img }) => (
            <NavLink to={href} key={id}>
              {({ isActive }: { isActive: boolean }) => (
                <div
                  className={cn("group nav-item", {
                    "bg-primary-100 !text-white": isActive,
                  })}
                  onClick={handleClick}
                >
                  <img className="group-hover:stroke-black" src={img} alt="" />
                  <p className="text-2xl ">{name} </p>
                </div>
              )}
            </NavLink>
          ))}
        </nav>
        <footer className="nav-footer">
          <img
            src="/icons/user.svg"
            alt="user image"
            referrerPolicy="no-referrer"
            className="rounded-full w-10 h-10"
          />
          <article >
            <h2>{user?.name || "mo"} </h2>
            <h2>{user?.email || "xyz@gmail"}</h2>
          </article>

          <button
            onClick={handleLogout}
            className="-ml-4 cursor-pointer rounded hover:bg-gray-50 flex items-center justify-center"
          >
            <img src="/icons/logout.svg" alt="logout" className="w-10 h-10" style={{display:""}}/>
          </button>
        </footer>
      </div>
    </section>
  );
};
