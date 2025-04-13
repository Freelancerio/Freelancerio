// Correct import for googleapis in Node.js. In browser, this needs a different strategy or backend integration.
import { google } from 'googleapis';

let auth0Client = null;

// Fetch Auth0 config (domain + clientId)
const fetchAuthConfig = async () => {
  const response = await fetch("../scripts/auth_config.json");

  if (!response.ok) {
    throw new Error("Failed to load Auth0 config JSON.");
  }

  const config = await response.json();
  console.log("Auth0 Config Data:", config); 
  return config;
};

// Initialize Auth0 client
const configureClient = async () => {
  try {
    const config = await fetchAuthConfig();

    auth0Client = await createAuth0Client({
      domain: config.domain,
      clientId: config.clientId,
      authorizationParams: {
        audience: config.audience
      }
    });

    console.log("Auth0 Client Initialized:", auth0Client);
    await updateUI();
  } catch (error) {
    console.error("Auth0 Initialization Failed:", error);
  }
};

// Update UI based on auth state
const updateUI = async () => {
  const isAuthenticated = await auth0Client.isAuthenticated();
  console.log("User Authenticated:", isAuthenticated); 

  document.getElementById("google-auth").disabled = isAuthenticated;

  if (isAuthenticated) {
    // Ideally moved to a backend — sensitive info below must not be in frontend
    const oauth2Client = new google.auth.OAuth2(
      `${process.env.GOOGLE_CLIENT_ID}`,
      `${process.env.GOOGLE_CLIENT_SECRET}`,
      `${`${process.env.GOOGLE_CLIENT_WEBSITE}`}`
    );

    const scopes = [
      'https://www.googleapis.com/auth/blogger',
      'https://www.googleapis.com/auth/calendar'
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    });

    console.log("Generated Google Auth URL:", url);
    // Optionally: window.location.href = url;
    window.location.href = url;
  }
};

// Login with redirect
const login = async () => {
  try {
    await auth0Client.loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    });
  } catch (error) {
    console.error("Login Failed:", error);
  }
};
document.getElementById(`google-auth`).addEventListener("click",login)


// Initialize on page load
window.onload = async () => {
  await configureClient();

  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    try {
      await auth0Client.handleRedirectCallback();
      window.history.replaceState({}, document.title, "/");
      await updateUI();
    } catch (error) {
      console.error("Redirect Callback Failed:", error);
    }
  }
};
