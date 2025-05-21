import { NavItems } from "@/components/NavItems";
import { Outlet } from "react-router";
import { MobileSidebar } from "../../components/mobile-sidebar";

const adminLayout = () => {
  return (
    <div className="admin-layout">
      <MobileSidebar />
      <aside className="w-[270px] h-screen max-lg:hidden">
          <NavItems handleClick={()=>{}}/>
      </aside>
      <aside className="children pl-3">
        <Outlet />
      </aside>
    </div>
  );
};

export default adminLayout;
