import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, DollarSign, Clock } from 'lucide-react';

// Sample data - replace with your actual data
const sampleCountries = [
  { value: 'us', name: 'United States', flag: '🇺🇸' },
  { value: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
  { value: 'fr', name: 'France', flag: '🇫🇷' },
  { value: 'jp', name: 'Japan', flag: '🇯🇵' },
  { value: 'au', name: 'Australia', flag: '🇦🇺' }
];

const budgetOptions = [
  { value: 'budget', text: 'Budget ($0 - $1000)', icon: '💰' },
  { value: 'moderate', text: 'Moderate ($1000 - $3000)', icon: '💵' },
  { value: 'luxury', text: 'Luxury ($3000+)', icon: '💎' }
];

const durationOptions = [
  { value: '1-3', text: '1-3 Days', icon: '⚡' },
  { value: '4-7', text: '4-7 Days', icon: '📅' },
  { value: '1-2weeks', text: '1-2 Weeks', icon: '🗓️' },
  { value: '3weeks+', text: '3+ Weeks', icon: '📆' }
];

const groupSizeOptions = [
  { value: 'solo', text: 'Solo Travel', icon: '🧳' },
  { value: 'couple', text: 'Couple (2)', icon: '💑' },
  { value: 'family', text: 'Family (3-5)', icon: '👨‍👩‍👧‍👦' },
  { value: 'group', text: 'Group (6+)', icon: '👥' }
];

const travelTypeOptions = [
  { value: 'adventure', text: 'Adventure', icon: '🏔️' },
  { value: 'relaxation', text: 'Relaxation', icon: '🏖️' },
  { value: 'cultural', text: 'Cultural', icon: '🏛️' },
  { value: 'business', text: 'Business', icon: '💼' },
  { value: 'romantic', text: 'Romantic', icon: '💕' }
];

interface TripFormData {
  country: string;
  city: string;
  budget: string;
  duration: string;
  groupSize: string;
  travelType: string;
  startDate: string;
  coordinates: { lat: number; lng: number } | null;
}

const CreateTrips = () => {
  const [formData, setFormData] = useState<TripFormData>({
    country: '',
    city: '',
    budget: '',
    duration: '',
    groupSize: '',
    travelType: '',
    startDate: '',
    coordinates: null
  });

  const [selectedLocation, setSelectedLocation] = useState<string>('');

  // Prepare country data for the dropdown
  const countryData = sampleCountries.map((country) => ({
    value: country.value,
    text: country.name,
    flag: country.flag
  }));

  const handleChange = (key: keyof TripFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    console.log(`Changed ${key} to ${value}`);
  };

  const handleLocationSelect = async (location: string) => {
    setSelectedLocation(location);
    // Simulate geocoding API call
    try {
      // Replace with actual geocoding service like Google Maps Geocoding API
      console.log(`Geocoding location: ${location}`);
      // const coordinates = await geocodeLocation(location);
      // setFormData(prev => ({ ...prev, coordinates }));
    } catch (error) {
      console.error('Error geocoding location:', error);
    }
  };

  const onHandleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted with data:", formData);
    console.log("Selected location:", selectedLocation);
    
    // Here you would typically send the data to your backend
    // submitTripData(formData);
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Add New Trip</h1>
          <p className="text-gray-600 mt-2">View and generate AI travel plans</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Create a Trip
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Trip Details
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div onSubmit={onHandleSubmit} className="space-y-6">
            
            {/* Country Selection */}
            <div className="space-y-2">
              <Label htmlFor="country" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Destination Country
              </Label>
              <Select 
                value={formData.country} 
                onValueChange={(value) => handleChange('country', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {countryData.map((data, index) => (
                      <SelectItem
                        key={index}
                        className="flex items-center gap-2"
                        value={data.value}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{data.flag}</span>
                          {data.text}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* City/Location Input with Map Integration */}
            <div className="space-y-2">
              <Label htmlFor="city">City or Specific Location</Label>
              <div className="relative">
                <Input
                  id="city"
                  type="text"
                  placeholder="Enter city name or address"
                  value={selectedLocation}
                  onChange={(e) => handleLocationSelect(e.target.value)}
                  className="pl-10"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {selectedLocation && (
                <p className="text-sm text-green-600">📍 Location: {selectedLocation}</p>
              )}
            </div>

            {/* Budget Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Budget Range
              </Label>
              <Select 
                value={formData.budget} 
                onValueChange={(value) => handleChange('budget', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Budget Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {budgetOptions.map((option, index) => (
                      <SelectItem key={index} value={option.value}>
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

            {/* Duration Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Trip Duration
              </Label>
              <Select 
                value={formData.duration} 
                onValueChange={(value) => handleChange('duration', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {durationOptions.map((option, index) => (
                      <SelectItem key={index} value={option.value}>
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

            {/* Group Size Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Group Size
              </Label>
              <Select 
                value={formData.groupSize} 
                onValueChange={(value) => handleChange('groupSize', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Group Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {groupSizeOptions.map((option, index) => (
                      <SelectItem key={index} value={option.value}>
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

            {/* Travel Type Selection */}
            <div className="space-y-2">
              <Label>Travel Type</Label>
              <Select 
                value={formData.travelType} 
                onValueChange={(value) => handleChange('travelType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Travel Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {travelTypeOptions.map((option, index) => (
                      <SelectItem key={index} value={option.value}>
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

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button 
                onClick={onHandleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                size="lg"
              >
                Create Trip Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Data Preview (for debugging) */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Form Data Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </main>
  );
};

export default CreateTrips;