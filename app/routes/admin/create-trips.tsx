import { interests } from "@/constants/constants";
import {
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from "@syncfusion/ej2-react-maps";

import { world_map } from "@/constants/world_map";
import React, { useState } from "react";
import type { Route } from "./+types/create-trips";

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

const budgetOptions = [
  { value: "budget", text: "Budget ($0 - $1000)", icon: "💰" },
  { value: "moderate", text: "Mid-Range", icon: "💵" },
  { value: "Premium", text: "Premium", icon: "💎" },
  { value: "luxury", text: "Luxury", icon: "💎💎" },
];

const durationOptions = [
  { value: "1-3", text: "1-3 Days", icon: "⚡" },
  { value: "4-7", text: "4-7 Days", icon: "📅" },
  { value: "1-2weeks", text: "1-2 Weeks", icon: "🗓️" },
  { value: "3weeks+", text: "3+ Weeks", icon: "📆" },
];

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
  location: string;
  budget: string;
  duration: string;
  groupType: string;
  travelType: string;
  interests: string;
}

const CreateTrips = ({ loaderData }: Route.ComponentProps) => {
  const [formData, setFormData] = useState<TripFormData>({
    country: "",
    location: "",
    budget: "",
    duration: "",
    groupType: "",
    travelType: "",
    interests: "",
  });

  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const countries = loaderData as Country[];

  const handleChange = (key: keyof TripFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    console.log(`changed LATEX_0_1749140502394{value}`);
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
      country:formData.country,
      color:"#EA382E",
      coordinates:countries.find((c:Country)=>c.name === formData.country)?.coordinates || []
    }
  ]

  const handleOptionClick = (countryName: string) => {
    handleChange("country", countryName);
    setInputValue(countryName);
    setDropdownOpen(false);
  };

  const onHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center -mt-5 md:mt-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Add New Trip</h1>
          <p className="text-gray-600 mt-2">
            View and generate AI travel plans
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create a Trip
        </button>{" "}
        {/* Changed Button to button for simplicity; ensure it's imported if using a component */}
      </div>

      <div className="border rounded-lg p-6 shadow">
        {" "}
        {/* Simplified Card to div for example; use Card if available */}
        <section className="gap-y-4">
          <form onSubmit={onHandleSubmit} className="space-y-6">
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
                value={formData.duration}
                className="w-full border p-2"
                placeholder="Enter the duration (in Numbers)"
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
                onChange={(e) => handleChange("groupType", e.target.value)} // Simplified to native select for demonstration; use Shadcn Select with onValueChange
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-700"
              >
                <option value="">Select a group type</option>
                {groupType.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.text}
                  </option>
                ))}
              </select>
              {/* If using Shadcn Select, it should be: */}
              {/* <Select value={formData.groupType} onValueChange={(value) => handleChange("groupType", value)}>
                <SelectTrigger className="w-full border border-gray-300 rounded-lg p-3 text-gray-700">
                  <SelectValue placeholder="Select a group type" />
                </SelectTrigger>
                <SelectContent>
                  {groupType.map((group) => (
                    <SelectItem key={group.value} value={group.value}>
                      {group.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            </div>

            {/* Travel Type - Fixed by adding onValueChange to Select */}
            <div className="space-y-2">
              <label htmlFor="travelType" className="text-sm font-medium">
                Travel Type
              </label>
              <select
                value={formData.travelType}
                onChange={(e) => handleChange("travelType", e.target.value)} // Simplified to native select; use Shadcn with onValueChange
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-700"
              >
                <option value="">Select Travel Type</option>
                {travelStyles.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.text}
                  </option>
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
                onChange={(e) => handleChange("interests", e.target.value)} // Simplified to native select; use Shadcn with onValueChange
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-700"
              >
                <option value="">Select Interests</option>
                {interests.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="text-sm font-medium">
                Location on the world map
              </label>
              <MapsComponent>
                <LayersDirective>
                  <LayerDirective 
                  shapeData={world_map}
                  dataSource={mapData}
                  shapePropertyPath={"name"}
                  shapeDataPath="country"
                  shapeSettings={{colorValuePath:'color',fill:'#00000'}}
                  />
                </LayersDirective>
              </MapsComponent>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>
        </section>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-bold">Form Data</h2>
        <pre className="bg-gray-100 p-4 rounded-lg">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </main>
  );
};

export default CreateTrips;
