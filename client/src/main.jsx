import "react-toastify/dist/ReactToastify.css";
import "@sendbird/chat-ai-widget/dist/style.css";

import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { ChatAiWidget } from "@sendbird/chat-ai-widget";

import AppProvider from "./components/AppProvider";
import router from "./router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <AppProvider>
        <RouterProvider router={router} />
        <ToastContainer />
        <ChatAiWidget
          applicationId={import.meta.env.VITE_TAWK_TO_APP_ID} // Your Sendbird Application ID
          botId={import.meta.env.VITE_TAWK_BOT_ID} // Your Bot ID
        />
      </AppProvider>
    </HelmetProvider>
  </React.StrictMode>
);
