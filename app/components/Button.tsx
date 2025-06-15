import { cn } from "@/lib/utils";
import { Link } from "react-router";

interface ButtonProps {
  text: string;
  className?: string;
  to?: string; // New prop for navigation
  onClick?: () => void; // Optional if using navigation via `to`
}

const Button = ({ text, className, to, onClick }: ButtonProps) => {
  if (to) {
    return (
      <Link
        to={to}
        className={cn("button-class w-56 h-11 flex items-center justify-center", className)}
      >
        <span>+</span>{text}
      </Link>
    );
  }

  return (
    <button
      className={cn("button-class w-56 h-11", className)}
      onClick={onClick}
    >
      <span>+</span>{text}
    </button>
  );
};

export default Button;
