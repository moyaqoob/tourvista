import { appwriteConfig, database } from "@/auth/client";
import { parseMarkDowntoJson } from "@/lib/utils";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ID } from "appwrite";
import { type ActionFunctionArgs } from "react-router";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return new Response(null, {
      status: 405,
      statusText: "Method Not Allowed",
    });
  }

  try {
    console.log("hit the action create trip");

    const body = await request.json();
    const {
      country,
      duration,
      travelType,
      interests,
      budget,
      groupType,
      userId,
    } = body;

    console.log(country, "it reached here",duration,travelType,userId);

    // Validate required fields
    if (!country || !duration || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("intialise the google  key");

    // Initialize AI
    const genAI = new GoogleGenerativeAI(appwriteConfig.geminiKey);
    const unsplashApiKey = appwriteConfig.unsplashKey

    console.log("generate the trip results",genAI,unsplashApiKey);
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

    // Generate trip data
    const textResult = await genAI
      .getGenerativeModel({ model: "gemini-2.0-flash" })
      .generateContent([
        prompt,
      ]);

    const trip = parseMarkDowntoJson(textResult.response.text());
    console.log("getting the images"); console.log(trip,"parsed down the trip",textResult.response.text())
    // Get images
    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelType}&client_id=${unsplashApiKey}`
    );
    const imageData = await imageResponse.json();
    const imageUrls = imageData.results
      .slice(0, 3)
      .map((result: any) => result.urls?.regular || null);

    console.log("storing in the doc");

    // Create document
    const result = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tripsCollection,
      ID.unique(),
      {
        tripDetail: JSON.stringify(trip),
        createdAt: new Date().toISOString(),
        imageUrls,
        userId,
      }
    );
    console.log("returning the response id");

    return new Response(JSON.stringify({ id: result.$id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error generating travel plan:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
