import { budgetOptions, interests } from "@/constants/constants";
import { Toaster } from "react-hot-toast";

import { account } from "@/auth/client";
import { cn } from "@/lib/utils";
import axios from "axios";
import React, { useState } from "react";
import { Form, useNavigate } from "react-router";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

import type { Route } from "../+types/home";
import { world_map } from "@/constants/world_map";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,flags,latlng,maps"
  );
  const data = await response.json();

  return data.map((country: any) => ({
    name: country.name.common,
    flag: country.flags.svg,
    coordinates: country.latlng,
    value: country.name.common,
    openStreetMap: country.maps?.openStreetMap,
  }));
};

// Sample data - replace with your actual data

const groupType = [
  { value: "solo", text: "Solo ", icon: "🧳" },
  { value: "couple", text: "Couple ", icon: "💑" },
  { value: "family", text: "Family ", icon: "👨‍👩‍👧‍👦" },
  { value: "group", text: "Friends", icon: "🫂" },
  { value: "group", text: "Business", icon: "👥" },
];

const travelStyles = [
  { value: "adventure", text: "Adventure", icon: "🏔️" },
  { value: "relaxation", text: "Relaxed", icon: "🏖️" },
  { value: "cultural", text: "Culture", icon: "🏛️" },
  { value: "business", text: "Luxury", icon: "💼" },
  { value: "romantic", text: "Nature & Outdoors", icon: "💕" },
  { value: "romantic", text: "City & Exploration", icon: "💕" },
];

interface TripFormData {
  country: string;
  budget: string;
  duration: number;
  groupType: string;
  travelType: string;
  interests: string;
}

const CreateTrips = ({ loaderData }: Route.ComponentProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TripFormData>({
    country: "",
    budget: "",
    duration: 0,
    groupType: "",
    travelType: "",
    interests: "",
  });

  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setloading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  //@ts-ignore
  const countries = (loaderData ?? []) as Country[];
  const handleChange = (key: keyof TripFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleChange("country", value);
    setInputValue(value);
    setFilteredCountries(
      countries.filter((country) =>
        country.name.toLowerCase().includes(value.toLowerCase())
      )
    );
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen || filteredCountries.length === 0) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < filteredCountries.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleOptionClick(filteredCountries[selectedIndex].name);
    }
  };

  const mapData = [
    {
      country: formData.country,
      color: "#EA382E",
      coordinates:
        countries.find((c: Country) => c.name === formData.country)
          ?.coordinates || [],
    },
  ];

  const handleOptionClick = (countryName: string) => {
    handleChange("country", countryName);
    setInputValue(countryName);
    setDropdownOpen(false);
  };

  // In the handleSubmit function:
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setloading(true);
    setError(undefined); // Clear previous errors
    const user = await account.get();

    try {
      const response = await axios.post("/create-trip", {
        country: formData.country,
        duration: formData.duration,
        travelType: formData.travelType,
        interests: formData.interests,
        budget: formData.budget,
        groupType: formData.groupType,
        userId: user.$id,
      });
      if (response.status == 400) {
        console.log("there is a problem with the fetch");
        const errorData = await response.data();
        throw new Error(errorData.error || "Failed to generate trip");
      }
      console.log("reached here");

      const result = await response.data;

      if (result?.id) {
        navigate(`/trips/${result.id}`);
      } else {
        throw new Error("No trip ID received");
      }
    } catch (e) {
      console.error("Error generating trip:", e);
      setError(e instanceof Error ? e.message : "Failed to generate trip");
    } finally {
      setloading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-between items-center -mt-5 md:mt-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Add New Trip</h1>
          <p className="text-gray-600 mt-2">
            View and generate AI travel plans
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xl md:py-2 md:px-7 sm:px-4 sm:py-2 px-2 py-2  rounded-lg">
          Create a Trip
        </button>{" "}
        {/* Changed Button to button for simplicity; ensure it's imported if using a component */}
      </div>

      <div className="border rounded-lg p-6 shadow">
        {" "}
        {/* Simplified Card to div for example; use Card if available */}
        <section className="gap-y-4">
          <Form
            onSubmit={handleSubmit}
            action="/create-trip"
            className="space-y-6"
          >
            {/* Country Input remains unchanged */}
            <div className="flex flex-col gap-2">
              <label htmlFor="country" className="text-sm font-medium">
                Country
              </label>
              <div className="relative">
                <input
                  placeholder="Search the country"
                  value={inputValue}
                  className="w-full border border-black p-2"
                  onChange={handleInputChange}
                  onFocus={() => setDropdownOpen(true)}
                  onKeyDown={handleKeyDown}
                />{" "}
                {/* Changed Input to input; ensure it's handled if using a component */}
                {isDropdownOpen && (
                  <div className="absolute bg-white border mt-1 w-full shadow-lg z-10 max-h-60 overflow-y-auto">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <div
                          key={country.value}
                          className="p-2 hover:bg-gray-100 flex items-center cursor-pointer"
                          onClick={() => handleOptionClick(country.name)}
                        >
                          <img
                            src={country.flag}
                            alt={`country flag`}
                            className="inline-block w-6 h-4 mr-2"
                          />
                          {country.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500">
                        No countries found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Duration Input remains unchanged */}
            <div className="flex flex-col gap-2">
              <label htmlFor="duration" className="text-sm font-medium">
                Duration
              </label>
              <input
                id="duration"
                value={Number(formData.duration)}
                className="w-full border p-2"
                placeholder="Enter the duration (in Numbers)"
                min={"1"}
                max={"10"}
                onChange={(e) => handleChange("duration", e.target.value)}
              />{" "}
              {/* Changed Input to input */}
            </div>

            {/* Group Type - Fixed by adding onValueChange to Select and removing onChange from SelectItem */}
            <div className="space-y-2">
              <label
                htmlFor="groupType"
                className="flex items-center gap-2 text-sm font-medium"
              >
                Group Type
              </label>
              <select
                value={formData.groupType}
                onChange={(e) => handleChange("groupType", e.target.value)} //
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-700"
              >
                <option value="">Select a group type</option>
                {groupType.map((group, index) => (
                  <option key={index}>{group.text}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="travelType" className="text-sm font-medium">
                Travel Type
              </label>
              <select
                value={formData.travelType}
                onChange={(e) => handleChange("travelType", e.target.value)} //
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-700"
              >
                <option value="">Select Travel Type</option>
                {travelStyles.map((option, index) => (
                  <option key={index}>{option.text}</option>
                ))}
              </select>
            </div>

            {/* Interests - Fixed by adding onValueChange to Select and correcting the value prop */}
            <div className="space-y-2">
              <label htmlFor="interests" className="text-sm font-medium">
                Interests
              </label>
              <select
                value={formData.interests}
                onChange={(e) => handleChange("interests", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-700"
              >
                <option value="">Select Interests</option>
                {interests.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Budgets */}
            <div className="space-y-2">
              <label htmlFor="budget" className="text-sm font-medium">
                Budgets
              </label>
              <select
                value={formData.budget}
                onChange={(e) => handleChange("budget", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-700"
              >
                <option value="">Select your Budget</option>
                {budgetOptions.map((option, index) => (
                  <option key={index}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="text-sm font-medium">
                Location on the world map
              </label>
              <ComposableMap
                projectionConfig={{ scale: 120 }}
                width={400}
                height={220}
                style={{ width: "100%", height: "auto" }}
              >
                <Geographies geography={world_map}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#EAEAEC"
                        stroke="#D6D6DA"
                      />
                    ))
                  }
                </Geographies>
                {mapData[0].coordinates.length === 2 && (
                  <Marker
                    coordinates={[
                      mapData[0].coordinates[1],
                      mapData[0].coordinates[0],
                    ]}
                  >
                    <circle r={5} fill={mapData[0].color} />
                    <text
                      textAnchor="middle"
                      y={-10}
                      style={{
                        fontFamily: "system-ui",
                        fill: mapData[0].color,
                        fontSize: 12,
                      }}
                    >
                      {mapData[0].country}
                    </text>
                  </Marker>
                )}
              </ComposableMap>
            </div>

            <button
              type="submit"
              className="bg-blue-600 w-full hover:bg-blue-700 flex items-center  justify-center text-white text-2xl font-normal py-2 gap-1.5 px-4 rounded"
            >
              <img
                src={`/icons/${loading ? "loader.svg" : "magic-star.svg"}`}
                alt="Icon"
                className={cn("size-5", loading && "animate-spin")}
              />
              {loading ? "Generating..." : "Generate  trip"}
            </button>
          </Form>
        </section>
      </div>
    </main>
  );
};

export default CreateTrips;
