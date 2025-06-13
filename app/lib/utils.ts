import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

interface percentageProps {
  currentMonthCount: number;
  lastMonthCount: number;
}

export default function calculateMonthPercentage({
  currentMonthCount,
  lastMonthCount,
}: percentageProps) {
  if (lastMonthCount === 0) {
    if (currentMonthCount === 0) {
      return { percentage: 0, trend: "no change" };
    } else {
      return { percentage: 100, trend: "increased" };
    }
  }

  const change = currentMonthCount - lastMonthCount;
  const percentage = Math.abs((change / lastMonthCount) * 100);

  if (change > 0) {
    return { percentage, trend: "increased" };
  } else if (change < 0) {
    return { percentage, trend: "decreased" };
  } else {
    return { percentage: 0, trend: "no change" };
  }
}

export const formatDate = (date: string): string => {
  return dayjs(date).format("MMMM DD,YYYY");
};

export function getFirstWord(input: string = " "): string {
  const words = input.trim().split(/\s+/);

  return words[0] || "";
}
export function parseMarkDowntoJson(markdownText: string): unknown | null {
  try {
    // First try to parse as direct JSON
    try {
      return JSON.parse(markdownText);
    } catch {
      // If direct parse fails, try to extract JSON from markdown
    }

    // Look for JSON in code blocks or plain JSON
    const patterns = [
      /```json\s*([\s\S]*?)\s*```/, // Matches JSON in code blocks
      /```\s*([\s\S]*?)\s*```/, // Matches any code block
      /(\{[\s\S]*\})/, // Matches plain JSON object
    ];

    for (const pattern of patterns) {
      const match = markdownText.match(pattern);
      if (match && match[1]) {
        const jsonString = match[1].trim();
        try {
          return JSON.parse(jsonString);
        } catch (error) {
          console.error("Failed to parse match:", jsonString);
          continue; // Try next pattern
        }
      }
    }

    console.error("No valid JSON found in markdown text");
    console.log("Original text:", markdownText);
    return null;
  } catch (error) {
    console.error("Error in parseMarkDowntoJson:", error);
    console.log("Original text:", markdownText);
    return null;
  }
}

export function parseTripData(jsonString: string): Trip | null {
  try {
    // Handle case where input is already an object
    if (typeof jsonString === "object") {
      return jsonString as Trip;
    }

    // Try parsing the string
    let parsedData: Trip;
    try {
      parsedData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      // Try to clean the string if it has escaped quotes
      const cleanedString = jsonString.replace(/\\"/g, '"');
      parsedData = JSON.parse(cleanedString);
    }

    // Basic validation of parsed data
    if (!parsedData || typeof parsedData !== "object") {
      console.error("Invalid data structure:", parsedData);
      return null;
    }

    console.log("Successfully parsed trip data");
    return parsedData;
  } catch (error) {
    console.error("Error in parseTripData:", error);
    console.log("Failed string:", jsonString?.substring(0, 100) + "...");
    return null;
  }
}
