import { getAllUsers, getUser } from "@/auth/auth";
import Button from "@/components/Button";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import TripCard from "@/components/TripCard";
import {
  allTrips,
  dashboardStats,
  tripXAxis,
  tripyAxis,
  user,
  userXAxis,
  useryAxis,
} from "@/constants/constants";
import { parseTripsData } from "@/lib/utils";
import {
  Category,
  ChartComponent,
  ColumnsDirective,
  ColumnSeries,
  DataLabel,
  Inject,
  SeriesCollectionDirective,
  SeriesDirective,
  SplineAreaSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import { ColumnDirective, GridComponent } from "@syncfusion/ej2-react-grids";
import type { LoaderFunctionArgs } from "react-router";
import {
  getTripsByTravelStyle,
  getUserGrowthPerDay,
  getUsersAndTripsStats,
} from "../api/dashboard";
import { getAllTrips } from "../api/trips";

const { totalUsers, usersJoined, totalTrips, tripsCreated, userRole } =
  dashboardStats;

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

    const mappedUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
      imageUrl: "/images/users.png",
      name: user.name,
      count: user.itineraryCount ?? Math.floor(Math.random() * 10),
    }));
    // Map the trips data correctly
    const trips = allTrips.map(({ $id, tripDetail, imageUrls }) => {
      return {
        id: $id,
        imageUrls,
        ...parseTripsData(tripDetail),
      };
    });
    

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
    usersGrowth: string;
    tripsByTravelStyle: string;
    allUsers: User[];
  };
}) => {
  const { trips, dashboardStats, usersGrowth, tripsByTravelStyle, allUsers } =
    loaderData;

  const alltrips = trips.slice(0,3).map((trip) => ({
    imageUrl: trip.imageUrls[0],
    name: trip.name,
    interest: trip.interests,
  }));


  const usersAndTrips: UsersAndTrips[] = [
    {
      title: "Latest user signups",
      dataSource: allUsers,
      field: "joinedAt",
      headerText: "status",
    },
    {
      title: "Latest trips booked",
      dataSource: alltrips,
      field: "tripsCreated",
      headerText: "Trips created",
    },
  ];

  return (
    <main className="dashboard wrapper">
      <div className="flex-between">
        <Header
          title={`Welcome ${user.name} 👋`}
          description="Track activity, trends, and
              popular destinations in real time"
        />
        <Button text="Create a trip" to="/create-trips"/>
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
          {trips.slice(0, 4).map((trip, id) => {
            return (
              <TripCard
                key={id}
                id={trip?.id}
                name={trip.name}
                imageUrl={trip.imageUrls[2]}
                location={trip.itinerary?.[0]?.location}
                tags={[trip.interests, trip.travelStyle]} // Ensure tags are passed correctly
                price={trip.estimatedPrice}
              />
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2">
        {/* first charrt */}
        <ChartComponent
          id="chart-1"
          primaryXAxis={userXAxis}
          primaryYAxis={useryAxis}
          title="User growth"
          tooltip={{ enable: true }}
          className="rounded-xl"
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
            ]}
          />

          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={usersGrowth}
              xName="day"
              yName="count"
              type="Column"
              name="Column"
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
            />
            <SeriesDirective
              dataSource={usersGrowth}
              xName="day"
              yName="count"
              type="SplineArea"
              name="Wave"
              fill="rgba(71,132,238,0.3)"
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>

        {/* trips growth data  */}
        <ChartComponent
          id="chart-2"
          primaryXAxis={tripXAxis}
          primaryYAxis={tripyAxis}
          title="Trips Growth"
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
            ]}
          />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={tripsByTravelStyle}
              xName="travelStyle"
              yName="count"
              type="Column"
              name="Column"
              columnWidth={0.2}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </section>

      <section className="user-trip wrapper">
        {usersAndTrips.map(({ title, dataSource, field, headerText }, i) => (
          <div key={i} className="flex flex-col gap-5">
            <h3 className="p-20-semibold text-dark-100">{title}</h3>

            <GridComponent
              dataSource={dataSource}
              gridLines="None"
              className="border border-gray-300 rounded-lg overflow-hidden shadow-md"
            >
              <ColumnsDirective>
                {/* Column for Name */}
                <ColumnDirective
                  field="name"
                  headerText="Name"
                  width="500"
                  textAlign="Left"
                  template={(props: UserData) => (
                    <div className="flex items-center min-w-md overflow-x-hidden gap-4 px-4 py-2 border-b border-gray-200">
                      <img
                        src={props.imageUrl || "/images/users.png"}
                        alt="user"
                        className="rounded-full w-10 h-10 aspect-square"
                        referrerPolicy="no-referrer"
                      />
                      <div className="overflow-hidden scroll-auto min-w-md">
                        <span className="text-lg font-medium overflow-hidden ">
                          {props.name}
                        </span>
                      </div>
                    </div>
                  )}
                />
              </ColumnsDirective>
            </GridComponent>
          </div>
        ))}
      </section>
    </main>
  );
};

export default DashBoard;
