import { NavItems } from "@/components/NavItems";
import { Outlet, redirect } from "react-router";
import { MobileSidebar } from "../../components/mobile-sidebar";
import { account } from "@/auth/client";
import { getExistingUser, storeUserData } from "@/auth/auth";
import Callback from "@/constants/callback";


export async function clientLoader() {
  try {
    const user = await account.get();
    if (!user.$id) return redirect("/sign-in");

    let existingUser = await getExistingUser(user.$id);

    if (!existingUser) {
      await storeUserData();
      existingUser = await getExistingUser(user.$id);
    }
    if (existingUser?.status === "user") {
      return redirect("/");
    } else if (existingUser?.status === "admin") {
      return existingUser; 
    }
    

  } catch (e) {
    console.error("Error fetching user", e);
    return redirect("/sign-in"); // Redirect on error
  }
}


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
