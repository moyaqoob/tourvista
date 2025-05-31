import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export const loader = async () => null;

const routes: RouteConfig = [
  route("sign-in", "./routes/auth/signin.tsx"),
  index("./routes/home.tsx"),
  layout("./routes/admin/admin-layout.tsx", [
    route("dashboard", "./routes/admin/dashboard.tsx"),
    route("all-users", "./routes/admin/all-users.tsx"),
    route("all-trips", "./routes/admin/all-trips.tsx"),
    route("create-trips", "./routes/admin/all-trips.tsx"),
  ]),
  route("api", "./routes/api.ts"),
];

export default routes;
