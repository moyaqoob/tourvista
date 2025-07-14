//@ts-nocheck
import { logout } from "@/auth/auth";
import { account } from "@/auth/client";
import Pagination from "@/components/pagination";
import TripCard from "@/components/TripCard";
import { parseTripsData } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  type LoaderFunctionArgs,
} from "react-router";
import type { Route } from "./+types/home";
import { getAllTrips } from "./api/trips";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const limit = 4;
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

function Home({ loaderData }: Route.ComponentProps) {
  const { trips } = loaderData;
  const [name, setName] = useState<string | null>(null);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page") || "1");

  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    navigate(`?page=${page}`);
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await account.get();
        if (!user.$id) {
          navigate("/sign-in");
        } else {
          setName(user.name);
        }
        const data = await fetch("api/create-trip");
        console.log(data);
      } catch (e) {
        console.error("Error fetching the user account details:", e);
        navigate("/sign-in");
      }
    }

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    await account.deleteSession("current");
    return navigate("/sign-in");
  };

  if (name === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="">
      <header className="travel-hero overflow-hidden">
        <div className="flex p-10 px-15 justify-between ">
          <Link to={"/"} className="flex items-center gap-2   max-md:hidden">
            <img src={"/images/logo.svg"} alt="" />
            <h1 className="text-xl font-semibold">Tourvista</h1>
          </Link>

          <article className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="border bg-red-500 hover:bg-pink-700 rounded-xl px-4 py-2 text-white font-semibold shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Admin Panel
            </Link>

            <img
              src="/icons/user.svg"
              className="w-8 h-8 rounded-full"
              alt="user image"
            />
            <img
              src="/icons/logout.svg"
              className="w-8 h-7 cursor-pointer rounded-full"
              alt="user image"
              onClick={handleLogout}
            />
          </article>
        </div>

        <section className="flex items-start justify-center py-[60px] pl-24 flex-col gap-6">
          <article>
            <h1 className="text-6xl font-bold">
              {" "}
              Plan your <br />
              trip next trip
            </h1>

            <p className="pt-4 text-lg text-gray-950">
              Customize your travel itinerary in minutes—pick your <br />{" "}
              destination, set your preferences, and explore with confidence.
            </p>

            <Link to={"/create-trips"}>
              <button className=" text-2xl mt-5 rounded-xl cursor-pointer hover:bg-[#256FF1] pt-4 pr-14 pb-4 pl-14 bg-[#6c6db8] ">
               Get Started
              </button>
            </Link>
          </article>
        </section>
      </header>
      <section className="flex flex-col px-28 pt-18 w-[1440px] h-[925px]">
        <div className="flex flex-col pb-5 gap-3">
          <h1 className="font-bold text-4xl">Featured Travel Destinations</h1>
          <p className="text-gray-100">
            Checkout some of the best places you can visit around the world
          </p>
        </div>

        <div className="flex flex-row w-[1170px] h-3xl gap-2">
          <div className="grid grid-cols-2 gap-4 w-[870px] h-[717px]">
            <div className="col-span-2">
              <img
                src="/images/sample1.jpg"
                alt="Sample 1"
                className="w-full rounded-lg -mb-6 h-96 object-cover"
              />
            </div>

            <img
              src="/images/sample2.jpg"
              alt="Sample 2"
              className="w-full rounded-lg h-full object-cover"
            />
            <img
              src="/images/sample3.jpg"
              alt="Sample 3"
              className="w-full rounded-lg h-full object-cover"
            />
          </div>

          <div className="w-[270px] h-3xl  space-y-3 px-2 pb-4 flex-shrink-0">
            <img
              src="/images/sample4.jpg"
              alt="Sample 1"
              className="w-full h-1/3 rounded-lg object-cover"
            />
            <img
              src="/images/card-img-2.png"
              alt="Sample 2"
              className="w-full h-1/3 rounded-lg object-cover"
            />
            <img
              src="/images/card-img-4.png"
              alt="Sample 3"
              className="w-full h-1/3 rounded-lg object-cover"
            />
          </div>
        </div>
      </section>
      <section className="w-[1440px] h-[972px] px-[140px] pt-[40px] relative">
        <div className="flex flex-col pb-5 gap-3">
          <h1 className="font-bold text-4xl">Handpicked Trips</h1>
          <p className="text-gray-100">
            Browse well-planned trips designed for different travel styles and
            interests
          </p>
        </div>
        <section className="flex w-[1160px] flex-col gap-9 mt-2.5">
          <div className="text-2xl">Trips</div>
          {trips.length > 0 ? (
          <div className="trip-card grid grid-cols-2 md:grid-cols-4">
             {trips
              .slice(0, 8)
              .map(
                ({
                  name,
                  estimatedPrice,
                  id,
                  duration,
                  budget,
                  travelStyle,
                  interests,
                  groupType,
                  location,
                  imageUrls,
                }) => {
                  return (
                    <TripCard
                      id={id}
                      name={name || ""}
                      imageUrl={imageUrls}
                      location={location?.city || ""}
                      tags={[travelStyle || "", interests || ""]}
                      price={estimatedPrice || ""}
                    />
                  );
                }
              )}
          </div>
        ) : (
          <div className="text-xl text-center">No Trips Found</div>
        )}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(loaderData.total / 4)} // Calculate total pages based on total trips and page size
            onPageChange={handlePageChange}
          />
        </section>
      </section>
    </div>
  );
}

export default Home;

