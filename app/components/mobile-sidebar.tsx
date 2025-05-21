//@ts-nocheck
import { icons } from "@public/assets";
import { type SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { Link } from "react-router";
import { NavItems } from "./NavItems";
import { useRef } from "react";

export const MobileSidebar = () => {
  const sidebarRef = useRef<SidebarComponent>(null);

  const toggleSidebar = () => {
    if (sidebarRef.current) {
      sidebarRef.current.toggle();
      console.log("Sidebar toggled");
    }
  };
  return (
    <div className="mobile-sidebar wrapper">
      <header>
        <Link to={"/"}>
          <img src={icons.logo} alt="Logo" className="size-[30px]" />
        </Link>
        {/* The left side bar whihc contains the dash,all users and trips */}

        <button onClick={()=>console.log("item clicked")}>
          <img src={icons.menu} alt="menu" className="size-8 " />
        </button>
    
      </header>
      {/* <sidebar
        width={270}
        ref={(Sidebar) => (sidebar = Sidebar)}
        created={() => sidebar.hide()}
        closeonDocument={true}
        type="over"
        className="w-1/2"
      >
        <NavItems handleClick={toggleSidebar} />
      </sidebar> */}
    </div>
  );
};
