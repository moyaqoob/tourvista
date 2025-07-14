import { getAllUsers, getUser } from "@/auth/auth";
import Button from "@/components/Button";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import TripCard from "@/components/TripCard";
import { user } from "@/constants/constants";
import { parseTripsData } from "@/lib/utils";
import {
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { LoaderFunctionArgs } from "react-router";
import {
  getTripsByTravelStyle,
  getUserGrowthPerDay,
  getUsersAndTripsStats,
} from "../api/dashboard";
import { getAllTrips } from "../api/trips";
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const limit = 8;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;

    const { allTrips, total } = await getAllTrips(limit, offset);

    const [users, dashboardStats, usersGrowth, tripsByTravelStyle, allUsers] =
      await Promise.all([
        getUser(),
        getUsersAndTripsStats(),
        getUserGrowthPerDay(),
        getTripsByTravelStyle(),
        getAllUsers(4, 0),
      ]);

    const mappedUsers = allUsers.users.map((user) => ({
      imageUrl: "/images/users.png",
      name: user.name,
      count: user.itineraryCount ?? Math.floor(Math.random() * 10),
      email: user.email,
      joinedAt: user.joinedAt,
      status: user.status,
    }));

    const trips = allTrips.map(({ $id, tripDetail, imageUrls }) => ({
      id: $id,
      imageUrls,
      ...parseTripsData(tripDetail),
    }));

    return {
      trips,
      total,
      dashboardStats,
      users,
      usersGrowth,
      tripsByTravelStyle,
      allUsers: mappedUsers,
    };
  } catch (error) {
    console.error("Error in loader:", error);
    throw new Response("Failed to load trips", { status: 500 });
  }
};

const DashBoard = ({
  loaderData,
}: {
  loaderData: {
    trips: Trip[];
    total: number;
    dashboardStats: DashboardStats;
    users: string;
    usersGrowth: any[];
    tripsByTravelStyle: any[];
    allUsers: any[];
  };
}) => {
  const { trips, dashboardStats, usersGrowth, tripsByTravelStyle, allUsers } =
    loaderData;

  // Chart data for User Growth
  const userGrowthChartData = {
    labels: usersGrowth.map((d) => d.day),
    datasets: [
      {
        label: "User Growth",
        data: usersGrowth.map((d) => d.count),
        backgroundColor: "rgba(71,132,238,0.7)",
        borderColor: "rgba(71,132,238,1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart data for Trips Growth
  const tripsGrowthChartData = {
    labels: tripsByTravelStyle.map((d) => d.travelStyle),
    datasets: [
      {
        label: "Trips Growth",
        data: tripsByTravelStyle.map((d) => d.count),
        backgroundColor: "rgba(234,56,46,0.7)",
        borderColor: "rgba(234,56,46,1)",
        borderWidth: 1,
      },
    ],
  };

  const alltrips = trips.slice(0, 3).map((trip) => ({
    imageUrl: trip.imageUrls[0],
    name: trip.name,
    interest: trip.interests,
  }));

  const usersAndTrips = [
    {
      title: "Latest user signups",
      dataSource: allUsers,
      columns: [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "joinedAt", label: "Joined At" },
        { key: "status", label: "Status" },
      ],
    },
    {
      title: "Latest trips booked",
      dataSource: alltrips,
      columns: [
        { key: "name", label: "Trip Name" },
        { key: "interest", label: "Interest" },
      ],
    },
  ];

  return (
    <main className="dashboard wrapper">
      <div className="flex-between">
        <Header
          title={`Welcome ${user.name} 👋`}
          description="Track activity, trends, and popular destinations in real time"
        />
        <Button text="Create a trip" to="/create-trips" />
      </div>
      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            headerTitle={"Total Users"}
            total={dashboardStats.totalUsers}
            currentMonthCount={dashboardStats.usersJoined.currentMonth}
            lastMonthCount={dashboardStats.usersJoined.lastMonth}
          />
          <StatsCard
            headerTitle={"Total Trips"}
            total={dashboardStats.totalTrips}
            currentMonthCount={dashboardStats.tripsCreated.currentMonth}
            lastMonthCount={dashboardStats.tripsCreated.lastMonth}
          />
          <StatsCard
            headerTitle={"Active Users Today "}
            total={dashboardStats.userRole.total}
            currentMonthCount={dashboardStats.userRole.currentMonth}
            lastMonthCount={dashboardStats.userRole.lastMonth}
          />
        </div>
      </section>

      <section className="flex flex-col gap-9 mt-2.5">
        <div className="text-2xl">Trips</div>
        <div className="trip-card grid grid-cols-2 md:grid-cols-4">
          {trips.slice(0, 4).map((trip, id) => (
            <TripCard
              key={id}
              id={trip?.id}
              name={trip.name}
              imageUrl={trip.imageUrls[2]}
              location={trip.itinerary?.[0]?.location}
              tags={[trip.interests, trip.travelStyle]}
              price={trip.estimatedPrice}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <Bar
            data={userGrowthChartData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
        {/* Trips Growth Chart */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">Trips Growth</h3>
          <Bar
            data={tripsGrowthChartData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
      </section>

      <section className="user-trip wrapper mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {usersAndTrips.map(({ title, dataSource, columns }, i) => (
            <div key={i} className="flex flex-col gap-5">
              <h3 className="p-20-semibold text-dark-100">{title}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      {columns.map((col) => (
                        <th key={col.key} className="px-6 py-3">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataSource.map((row: any, idx: number) => (
                      <tr
                        key={idx}
                        className="border-b last:border-none hover:bg-gray-50"
                      >
                        {columns.map((col) => (
                          <td key={col.key} className="px-6 py-4">
                            {col.key === "status" ? (
                              <span
                                className={`px-2 py-1 rounded ${
                                  row.status === "user"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {row.status}
                              </span>
                            ) : col.key === "joinedAt" ? (
                              <span>
                                {row.joinedAt
                                  ? new Date(row.joinedAt).toLocaleDateString()
                                  : ""}
                              </span>
                            ) : (
                              row[col.key]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default DashBoard;
