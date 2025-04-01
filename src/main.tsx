import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import { RootStore, storesContext } from "./stores/index.ts";
import { loadState } from "./utils/localStorage";   

const queryClient = new QueryClient();
const STORE = RootStore.create(loadState());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <storesContext.Provider value={STORE}>
      <QueryClientProvider client={queryClient}>
          <App />
      </QueryClientProvider>
    </storesContext.Provider>
  </StrictMode>,
);
