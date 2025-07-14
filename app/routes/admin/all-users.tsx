import { getAllUsers } from "@/auth/auth";
import Header from "@/components/Header";
import { cn, formatDate } from "@/lib/utils";
import { FaTrash } from "react-icons/fa";

export async function loader({ params }: any) {
  const { users, total } = await getAllUsers(10, 0);
  return { users, total };
}

const AllUsers = ({ loaderData }: any) => {
  const { users } = loaderData;

  return (
    <main className="min-h-screen flex flex-col gap-10 w-full max-w-7xl mx-auto px-4 lg:px-8">
      <Header
        title="Manage Users"
        description="Filter, sort, and access detailed user profiles"
      />

      <div className="container mx-auto p-4 min-h-screen">
        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-6 py-3 w-64">Name</th>
              <th className="px-6 py-3 w-80">Email Address</th>
              <th className="px-6 py-3 w-52">Date Joined</th>
              <th className="px-6 py-3 w-32">Status</th>
              <th className="px-6 py-3 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any, idx: number) => (
              <tr
                key={user.accountId || idx}
                className="border-b last:border-none hover:bg-gray-50"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={"/images/users.png"}
                    alt="user"
                    className="rounded-full w-9 h-9"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xl">{user.name}</span>
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{formatDate(user.joinedAt)}</td>
                <td className="px-6 py-4">
                  <div
                    className={cn(
                      "flex items-center gap-2 px-2 py-1 rounded-md w-fit",
                      user.status === "user" ? "bg-green-100" : "bg-gray-200"
                    )}
                  >
                    <span
                      className={cn(
                        "w-3 h-3 rounded-full",
                        user.status === "user" ? "bg-green-500" : "bg-gray-500"
                      )}
                    ></span>
                    <span className="text-sm font-medium capitalize">
                      {user.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default AllUsers;
