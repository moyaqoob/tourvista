import Header from "@/components/Header";
import MapLibreComponent from "@/components/Map";
import { cn, parseTripData } from "@/lib/utils";
import { BsCalendar2Date } from "react-icons/bs";
import { MdOutlineLocationOn } from "react-icons/md";
import type { LoaderFunctionArgs } from "react-router";
import { getAllTrips, getTripById } from "../api/trips";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { tripId } = params;
  if (!tripId) throw new Error("Trip ID is required");

  const [trip, trips] = await Promise.all([
    getTripById(tripId),
    getAllTrips(4, 0),
  ]);

  return {
    trip,
    trips,
  };
};

const TripDetail = ({
  loaderData,
}: {
  loaderData: {
    trips: Trip[];
    trip: any;
  };
}) => {
  const tripData = parseTripData(loaderData?.trip);
  const recentTrips = loaderData?.trips;

  // const { name,location } = tripData || {};
  const {
    name,
    description,
    country,
    location: { city, coordinates, openStreetMap },
    duration,
    estimatedPrice,
    groupType,
    interests,
    travelStyle,
    budget,
    bestTimeToVisit,
    weatherInfo,
    itinerary,
  }: Trip = tripData.tripDetail;

  const days = weatherInfo.length;
  const { imageUrls } = tripData;
  const pillItems = [
    { text: travelStyle, bg: "bg-pink-50 text-pink-500" },
    { text: groupType, bg: "bg-primary-50 text-primary-500" },
    { text: budget, bg: "bg-success-50 text-success-700" },
    { text: interests, bg: "bg-navy-50 text-navy-500" },
  ];
  const coordinate = [
    tripData.tripDetail.location.coordinates[0],
    tripData.tripDetail.location.coordinates[1],
  ];
  console.log("parsed data", tripData, coordinate);

  return (
    <main className="travel-detail wrapper">
      <Header title="Trip Details" description="AI-generated travel plans" />

      <section className="container wrapper-md">
        <header>
          <h1 className="p-40-semibold text-dark-100">{name}</h1>
          <div className="flex gap-4">
            <div className="text-sm text-gray-700 gap-0">
              <BsCalendar2Date className="mr-1" />
              {days} day plan
            </div>
            <div className="text-sm gap-1 text-gray-700 ">
              <MdOutlineLocationOn />
              <p>
                {country} {location.city}{" "}
              </p>
            </div>
          </div>
          <section className="gallery grid grid-cols-2 sm:grid-cols-3 grid-rows-auto gap-2">
            {imageUrls.map((url: string, i: number) => (
              <img
                src={url}
                key={i}
                className={cn(
                  "w-full rounded-xl object-cover",
                  i === 0
                    ? "col-span-2 sm:col-span-2 sm:row-span-2 h-[200px] sm:h-[330px]"
                    : "col-span-1 row-span-1 h-[100px] sm:h-[160px]"
                )}
              />
            ))}
          </section>

          <section className="flex gap-3 md:gap-5 items-center flex-wrap">
            <div className="flex gap-2 flex-wrap">
              {pillItems.map((pill, i) => (
                <span
                  key={i}
                  className={`rounded-lg px-3 py-1 text-base font-medium ${pill.bg}`}
                >
                  {pill.text}
                </span>
              ))}
            </div>

            <ul className="flex gap-1 items-center">
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <li key={index}>
                    <img src="/icons/star.svg" alt="star" />
                  </li>
                ))}
              <span className="bg-orange-100 px-2 text-orange-600 rounded-md text-base ml-2">
                4.9/5.0
              </span>
            </ul>
          </section>

          <section className="title">
            <article>
              <h3>
                {duration}-day {country} {travelStyle}
              </h3>
              <p>
                {budget}, {groupType} and {travelStyle}
              </p>
            </article>
            <h2>{estimatedPrice}</h2>
          </section>

          <p className="text-sm md:text-lg font-normal text-dark-400">
            {" "}
            {description}{" "}
          </p>

          <ul className="itinerary">
            {itinerary.map((dayPlan: DayPlan, index: number) => (
              <li key={index}>
                <h3>
                  Day {dayPlan.day}: {dayPlan.location}
                </h3>
                <ul>
                  {dayPlan.activities.map((activity, i) => (
                    <li className="items-center" key={i}>
                      <div className="w-24 flex-shrink-0">
                        <span className="text-lg font-semibold">
                          {activity.time}
                        </span>
                      </div>
                      :
                      <div className="flex-1">
                        <p className="text-gray-800 leading-7">
                          {" "}
                          {activity.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-start mt-5">
            <h1 className="text-2xl font-semibold text-left">
              Best Time to Visit
            </h1>
            <ul className="flex flex-col list-disc leading-8 pl-5">
              {bestTimeToVisit.map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start mt-5">
            <h1 className="text-2xl font-semibold text-left">Weather Info</h1>
            <ul className="flex flex-col list-disc leading-8 pl-5">
              {weatherInfo.map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ul>
          </div>

          <div className="w-ful flex flex-col items-start mt-8">
            <h1 className="text-2xl font-semibold text-left mb-1">Location</h1>
            <div className="w-full h-[400px] rounded-lg ">
              <MapLibreComponent
                city="Seoul"
                coordinates={[
                  tripData.tripDetail.location.coordinates[1],
                  tripData.tripDetail.location.coordinates[0],
                ]} // Longitude first, then latitude
                openStreetMap="https://www.openstreetmap.org/?mlat=37.5665&mlon=126.978"
              />
            </div>
          </div>
        </header>
      </section>
    </main>
  );
};

export default TripDetail;
