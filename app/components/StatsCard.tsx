import calculateMonthPercentage, { cn } from "@/lib/utils";
import { icons } from "@public/assets";

const StatsCard = ({
  headerTitle,
  total,
  lastMonthCount,
  currentMonthCount,
}: StatsCard) => {
  const { trend, percentage } = calculateMonthPercentage({
    currentMonthCount,
    lastMonthCount,
  });
  const decrement = trend === "decrement";
  return (
    <article className="stats-card">
      <h3 className="text-base font-medium">{headerTitle}</h3>

      <div className="content">
        <div className="flex flex-col gap-4">
          <h2 className="text-4xl font-semibold ">{total}</h2>
          <div className="flex items-end gap-2">
            <figure
              className={cn(
                decrement ? "text-red-700" : "text-green-700",
                "text-lg  max-w-md:text-md md:gap-3 "
              )}
            >
              <figcaption className="flex items-center">
                <img src={decrement ? icons.arrowDownRed : icons.arrowUpGreen} alt=""/>
                
                <span>{Math.round(percentage)}%</span>
                <p className="text-gray-100 flex items-center gap-x-2 ml-3">
                  vs <span className="font-medium ml-1">last month</span>
                </p>
              </figcaption>
            </figure>
          </div>
        </div>

        <img src={decrement?`${icons.decrement}`:`${icons.increment}`} alt={decrement?"Decrement graph":"Increment graph"}
        className="xl:w-32 w-full h-full xl:h-full md:h-20 "
        />
      </div>
    </article>
  );
};

export default StatsCard;
