import Header from "@/components/Header";
import { parseTripData } from "@/lib/utils";
import type { LoaderFunctionArgs } from "react-router";
import { getTripById } from "../api/trips";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { tripId } = params;

  if (!tripId) throw new Error("Trip ID is required");

  const trip = await getTripById(tripId);
  return { trip };
};

const TripDetail = ({ loaderData }: { loaderData: { trip: any } }) => {
  const tripData = parseTripData(loaderData?.trip);

  const { name,location } = tripData || {};
  console.log("name",name,location)

  return (
    <main className="travel-detail wrapper">
      <Header title="Trip Details" description="AI-generated travel plans" />

      <section className="container wrapper-md">
        <header>
            <h1 className="p-40-semibold text-dark-100">
                {name}
            </h1>
        </header>
      </section>
    </main>
  );
};

export default TripDetail;
