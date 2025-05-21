import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tourvista" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  console.log("home reached")
  return (
    <div className="text-2xl flex bg-red-500 items-center justify-end ">
         home page
    </div>
  )
}
