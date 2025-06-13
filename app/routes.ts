import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export const loader = async () => null;

export default [
  route("sign-in", "./routes/auth/signin.tsx"),
  route("auth/callback/", "./routes/api/callback.ts"),
  route('create-trip','routes/api/create-trip.ts'),
  index("./routes/home.tsx"),
  layout("./routes/admin/admin-layout.tsx", [
    route("dashboard", "./routes/admin/dashboard.tsx"),
    route("all-users", "./routes/admin/all-users.tsx"),
    route("all-trips", "./routes/admin/all-trips.tsx"),
    route("create-trips", "./routes/admin/create-trips.tsx"),
    route('trips/:tripId','./routes/admin/trip-detail.tsx')
  ]),
] satisfies RouteConfig;
