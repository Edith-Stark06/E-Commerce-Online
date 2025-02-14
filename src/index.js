import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import { auth0Config } from "./auth0-config";

// Ensure the root element exists before rendering
const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <Auth0Provider 
      domain={auth0Config.domain} 
      clientId={auth0Config.clientId}
      authorizationParams={auth0Config.authorizationParams}
    >
      <App />
    </Auth0Provider>
  );
} else {
  console.error("Root element not found! Check index.html for an element with id='root'.");
}
