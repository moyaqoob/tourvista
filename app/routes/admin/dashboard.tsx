import { getAllUsers, getUser } from "@/auth/auth";
import Button from "@/components/Button";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import TripCard from "@/components/TripCard";
import {
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
  ColumnSeries,
  DataLabel,
  Inject,
  SeriesCollectionDirective,
  SeriesDirective,
  SplineAreaSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
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
      allUsers,
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
    allUsers: string;
  };
}) => {
  const {
    trips,
    dashboardStats,
    users,
    usersGrowth,
    tripsByTravelStyle,
    allUsers,
  } = loaderData;
  console.log("Users Growth Data:", usersGrowth);
  console.log("Trips Growth Data:", tripsByTravelStyle);

  return (
    <main className="dashboard wrapper">
      <div className="flex-between">
        <Header
          title={`Welcome ${user.name} 👋`}
          description="Track activity, trends, and
              popular destinations in real time"
        />
        <Button text="Create a trip" />
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
            console.log("Trip tags:", [trip.interests, trip.travelStyle]); // Debugging log
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
    </main>
  );
};

export default DashBoard;
