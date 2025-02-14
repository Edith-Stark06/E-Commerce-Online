import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { auth0Config } from "./auth0-config";

const root = ReactDOM.createRoot(
<Auth0Provider 
    domain={auth0Config.domain} 
    clientId={auth0Config.clientId}
    authorizationParams={auth0Config.authorizationParams}
>
    <App />
</Auth0Provider>,

document.getElementById("root"));
root.render(<App />);
