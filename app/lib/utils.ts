import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

interface percentageProps{
  currentMonthCount:number,
  lastMonthCount:number
}

export default function calculateMonthPercentage({currentMonthCount, lastMonthCount}:percentageProps) {
  if (lastMonthCount === 0) {
    if (currentMonthCount === 0) {
      return { percentage: 0, trend: "no change" };
    } else {
      return { percentage: 100, trend: "increased" };
    }
  }

  const change = currentMonthCount - lastMonthCount;
  const percentage = Math.abs((change/lastMonthCount) * 100);

  if (change > 0) {
    return { percentage, trend: "increased" };
  } else if (change < 0) {
    return { percentage, trend: "decreased" };
  } else {
    return { percentage: 0, trend: "no change" };
  }
}

export const formatDate = (date:string):string=>{
  return dayjs(date).format("MMMM DD,YYYY");
}

export function getFirstWord(input: string = " "): string {
  const words = input.trim().split(/\s+/);

  return words[0] || "";
}
