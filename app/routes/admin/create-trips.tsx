import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectGroup } from "@/components/ui/select";
import { interests } from "@/constants/constants";
import {MapsComponent, LayersDirective,LayerDirective} from "@syncfusion/ej2-react-maps"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import React, { useState } from "react";
import type { Route } from "./+types/create-trips";
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


  //yeh baaki ke liye hai
  const handleChange = (key: keyof TripFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    console.log(`changed ${key} from ${value}`);
  };

  // yeh sirf first wale ke liye hai
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

  const handleOptionClick = (countryName: string) => {
    handleChange("country", countryName);
    setInputValue(countryName); // Sync the input value
    setDropdownOpen(false); // Close the dropdown
  };

  const onHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    console.log("Form Data:", formData);
    // Add logic for handling the form submission here
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
        <Button className="bg-blue-600 hover:bg-blue-700">Create a Trip</Button>
      </div>

      <Card>
        <CardContent>
          <section className="gap-y-4 px-3">
            <form onSubmit={onHandleSubmit} className="space-y-6">
              {/* Country Input */}
              <div className="flex flex-col gap-2">
                <label htmlFor="country" className="text-sm font-medium">
                  Country
                </label>
                <div className="relative">
                  <Input
                    placeholder="Search the country"
                    value={inputValue}
                    className="w-full border border-black p-2"
                    onChange={handleInputChange}
                    onFocus={() => setDropdownOpen(true)}
                    onKeyDown={handleKeyDown}
                  />
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

              {/* Duration Input */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="duration" className="text-sm font-medium">
                  Duration
                </Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  className="w-full border p-2"
                  placeholder="Enter the duration (in Numbers)"
                  onChange={(e) => handleChange("duration", e.target.value)}
                />
              </div>
 
              {/* Group Type */}
              <div className="space-y-2">
                <Label htmlFor="groupType" className="flex items-center gap-2">Group Type</Label>
                <Select
                  value={formData.groupType}
                  className="w-full"
                >
                  <SelectTrigger className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 relative flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-black">
                    <SelectValue  placeholder="Select a group type" />
                  </SelectTrigger>
                  <SelectContent className="-mt-4 border border-gray-300 rounded-lg shadow-lg bg-white max-h-60 overflow-y-auto">
                    <SelectGroup>
                      {groupType.map((group, index) => (
                        <SelectItem
                          key={index}
                          value={group.value}
                          className="px-4 py-2 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                          onChange={() => handleChange("groupType",group.text)}
                        >
                          {group.text}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* travel styles */}
              <div className="space-y-2">
                <Label htmlFor="travelType">Travel Type</Label>
                <Select
                  value={formData.travelType}>
                  <SelectTrigger className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 relative flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-black">
                    <SelectValue placeholder="Select Travel Type" />
                  </SelectTrigger>
                  <SelectContent className="text-black z-10 ">
                    <SelectGroup>
                      {travelStyles.map((option, index) => (
                        <SelectItem
                         className="px-4 py-2 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                         key={index} 
                         value={option.value}>
                          <div className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            {option.text}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <Label htmlFor="interests">Interests</Label>
                <Select
                  value={formData.travelType}
                  onValueChange={(value) => handleChange("interests", value)}
                >
                  <SelectTrigger className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 relative flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-black">
                    <SelectValue placeholder="Select Interests" />
                  </SelectTrigger>
                  <SelectContent className="relative -mt-7 text-black ">
                    <SelectGroup>
                      {interests.map((option, index) => (
                        <SelectItem key={index} value={option}>
                          <div className="flex items-center gap-2">
                            {option}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* maps directive */}
              <div>
                <Label htmlFor="location">
                  Location on the world map
                </Label>
                 <MapsComponent id="maps">
                 <LayersDirective>
                    <LayerDirective
                      shapeData={world_map}
                    >
                    </LayerDirective>
                 </LayersDirective>
               </MapsComponent>
              </div>
            </form>

          </section>
        </CardContent>
      </Card>
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
