import { cn } from "@/lib/utils";
import { useLocation } from "react-router";

interface HeaderProps {
  title: string;
  description: string;
}

const Header = ({ title, description }: HeaderProps) => {
  const location  = useLocation();
    return (
    <div className="header capitalize">
      <article>
        <h1 className={cn(
            "text-dark-100",
            location.pathname === "/"?"text-2xl md:text-4xl font-bold":
            "text-xl md:text-2xl font-semibold"
        )}>{title}</h1>
        <p className={cn("text-gray-100 text-base md:text-lg",location.pathname==="/dashboard"?"leading-6":"leading-4 -bottom-2")}>{description} </p>
      </article>
    </div>
  );
};

export default Header
