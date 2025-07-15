import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import "./app.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HydratedRouter />
  </StrictMode>
);