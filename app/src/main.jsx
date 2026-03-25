import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ScoringProvider } from "./contexts/ScoringContext";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ScoringProvider>
        <App />
      </ScoringProvider>
    </BrowserRouter>
  </StrictMode>
);
