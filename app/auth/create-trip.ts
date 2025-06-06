import type { ActionFunctionArgs } from "react-router";
import { appwriteConfig, database } from "./client";
//how to design an api key for a ai response with image 101
import { parseMarkDowntoJson } from "@/lib/utils";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {data} from "react-router"
import { ID } from "appwrite";

export const action = async ({ request }: ActionFunctionArgs) => {
  const {
    country,
    duration,
    groupType,
    travelType,
    interests,
    budget,
    location,
  } = await request.json();

  const genAI = new GoogleGenerativeAI(appwriteConfig.unsplashKey);
  const unsplashkey = appwriteConfig.unsplashKey;

  const prompt = `Generate a ${duration}-day travel itinerary for ${country} based on the following user information:
        Budget: '${budget}'
        Interests: '${interests}'
        TravelStyle: '${travelType}'
        GroupType: '${groupType}'
        Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
        {
        "name": "A descriptive title for the trip",
        "description": "A brief description of the trip and its highlights not exceeding 100 words",
        "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
        "duration": ${duration},
        "budget": "${budget}",
        "travelStyle": "${travelType}",
        "country": "${country}",
        "interests": ${interests},
        "groupType": "${groupType}",
        "bestTimeToVisit": [
          '🌸 Season (from month to month): reason to visit',
          '☀️ Season (from month to month): reason to visit',
          '🍁 Season (from month to month): reason to visit',
          '❄️ Season (from month to month): reason to visit'
        ],
        "weatherInfo": [
          '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
        ],
        "location": {
          "city": "name of the city or region",
          "coordinates": [latitude, longitude],
          "openStreetMap": "link to open street map"
        },
        "itinerary": [
        {
          "day": 1,
          "location": "City/Region Name",
          "activities": [
            {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
            {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
            {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
          ]
        },
        ...
        ]
    }`;
  try {
    const textResult = await genAI
      .getGenerativeModel({ model: "gemini-2.0-flash" })
      .generateContent([prompt]);
    const trip = parseMarkDowntoJson(textResult.response.text());

    const query = encodeURIComponent(`${country} ${interests} ${travelType}`);
    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=${unsplashkey}`
    );
    const results = (await imageResponse.json()).results;
    const imageUrls = results.slice(0, 3).map((result: any) => result.urls?.regular || null);

    const result = database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.tripsCollection,
        ID.unique(),
        {
            tripDetail: JSON.stringify(trip),
            createdAt: new Date().toISOString
        }
    )

    return data({id:(await result).$id})

  } catch (e) {}
};
