import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Framee } from "./screens/Framee";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Framee />
  </StrictMode>,
);
