import Button from "@/components/Button";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import TripCard from "@/components/TripCard";
import { allTrips, dashboardStats, user } from "@/constants/constants";
import { formatDate } from "@/lib/utils";

const DashBoard = () => {
  const { totalUsers, usersJoined, totalTrips, tripsCreated, userRole } =
    dashboardStats;

  const date = formatDate("2024-12-15");
  console.log(date);
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
            total={totalUsers}
            currentMonthCount={usersJoined.currentMonth}
            lastMonthCount={usersJoined.lastMonth}
          />
          <StatsCard
            headerTitle={"Total Trips"}
            total={totalTrips}
            currentMonthCount={tripsCreated.currentMonth}
            lastMonthCount={tripsCreated.lastMonth}
          />
          <StatsCard
            headerTitle={"Active Users Today "}
            total={userRole.total}
            currentMonthCount={userRole.currentMonth}
            lastMonthCount={userRole.lastMonth}
          />
        </div>
      </section>
      <section className="flex flex-col gap-9 mt-2.5">
        <div className="text-2xl">
            Trips
        </div>
        <div className="trip-card grid grid-cols-4">
          {allTrips.slice(0,4).map(({id,name,imageUrls,itinerary,tags,estimatedPrice})=>(
              <TripCard
                key={id}
                id={id.toString()}
                name={name}
                imageUrl={imageUrls[0]}
                location={itinerary?.[0]?.location}
                tags={tags}
                price={estimatedPrice}
              />
          ))}
        </div>
      </section>
    </main>
  );
};

export default DashBoard;
