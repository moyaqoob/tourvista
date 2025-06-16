import Button from "@/components/Button";
import Header from "@/components/Header";
import TripCard from "@/components/TripCard";
import { parseTripsData } from "@/lib/utils";
import { useState } from "react";
import { type LoaderFunctionArgs } from "react-router";
import { deleteTripById, getAllTrips } from "../api/trips";

// Define the type for trips

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const limit = 8;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;
    const { allTrips, total } = await getAllTrips(limit, offset);

    // Map the trips data correctly
    const trips = allTrips.map(({ $id, tripDetail, imageUrls }) => ({
      id: $id,
      imageUrls,
      ...parseTripsData(tripDetail),
    }));

    return { trips, total }; // Return trips and total separately
  } catch (error) {
    console.error("Error in loader:", error);
    throw new Response("Failed to load trips", { status: 500 });
  }
};

const AllTrips = ({
  loaderData,
}: {
  loaderData: { trips: Trip[]; total: number };
}) => {
  const [trips, setTrips] = useState(loaderData.trips || []);
  const total = loaderData.total;

  const handleDeleteTrip = async (id: string) => {
    try {
      await deleteTripById(id); 
      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== id)); 
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

  return (
    <div>
      <div className="flex-between pb-5">
        <Header
          title="All trips "
          description="Plan your trips with the help of AI"
        />
        <Button
          className="cursor-pointer mr-4"
          to="/create-trips"
          text="Create a trip"
        />
      </div>
      <section>
        <div className="trip-card grid grid-cols-2 md:grid-cols-4">
          {trips.map((trip, id) => (
            <TripCard
              key={id}
              id={trip.id}
              name={trip.name}
              imageUrl={trip.imageUrls[2]}
              location={trip.itinerary?.[0]?.location}
              tags={[trip.interests, trip.travelStyle]}
              price={trip.estimatedPrice}
              onDelete={handleDeleteTrip} // Pass the delete handler to TripCard
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AllTrips;

