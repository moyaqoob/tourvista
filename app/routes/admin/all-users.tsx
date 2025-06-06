import { getAllUsers } from "@/auth/auth";
import Header from "@/components/Header";
import { cn, formatDate } from "@/lib/utils";
import { ColumnsDirective } from "@syncfusion/ej2-react-charts";
import { ColumnDirective, GridComponent } from "@syncfusion/ej2-react-grids";
import type { Route } from "../+types/home";
import Button from "@/components/Button";
import { FaTrash } from "react-icons/fa";

export async function loader({params}:Route.LoaderArgs){
  const {users,total} = await getAllUsers(10,0);

  return {users,total}
}

const AllUsers = ({loaderData}:Route.ComponentProps) => {
// @ts-ignore
  const { users} = loaderData;
  // console.log(users,"new users")
  return (
    <main className=" min-h-screen  flex flex-col gap-10 w-full max-w-7xl mx-auto px-4 lg:px-8">
        <Header
          title="Manage Users"
          description="Filter,sort, and access detailed user profiles"
        />

        {/* <Button text="Add user" /> */}
     <div className="container mx-auto p-4 -ml-4 min-h-screen">
  <GridComponent
    dataSource={users}
    gridLines="None"
    className="w-full overflow-x-auto"
    style={{ minHeight: "80vh" }} // Adjust grid height as needed
  >
    <ColumnsDirective>
      <ColumnDirective
        field="name"
        headerText="Name"
        width={250}
        textAlign="Left"
        template={(props: UserData) => (
          <div className="flex items-center gap-2 px-4">
            <img
              src={props.imageUrl || '/ico'}
              alt="user"
              className="rounded-full w-8 h-8 p-1"
              referrerPolicy="no-referrer"
            />
            <span className="text-xl">{props.name}</span>
          </div>
        )}
      />
      <ColumnDirective
        field="email"
        headerText="Email Address"
        width={300}
        textAlign="Left"
      />
      <ColumnDirective
        field="joinedAt"
        headerText="Date Joined"
        width={200}
        textAlign="Left"
        template={({ joinedAt }: { joinedAt: string }) => formatDate(joinedAt)}
      />
      <ColumnDirective
        field="status"
        headerText="Status"
        width={100}
        textAlign="Left"
        template={({ status }: UserData) => (
          <div
            className={cn(
              "flex items-center gap-2 px-2 py-1 rounded-md",
              status === "user" ? "bg-green-100" : "bg-gray-200"
            )}
          >
            <span
              className={cn(
                "w-3 h-3 rounded-full",
                status === "user" ? "bg-green-500" : "bg-gray-500"
              )}
            ></span>
            <span className={cn("text-sm font-medium", "capitalize")}>
              {status}
            </span>
          </div>
        )}
      />
      <ColumnDirective
        field=""
        width={200}
        template={()=>(
          <div className="pl-7">
              <FaTrash/>
          </div>
        )}

      />
      
    </ColumnsDirective>
  </GridComponent>
</div>

    </main>
  );
};

export default AllUsers;
