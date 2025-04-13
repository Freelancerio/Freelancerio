let auth0Client = null;

// Fetch Auth0 config (domain + clientId)
const fetchAuthConfig = async () => {
  const response = await fetch("/scripts/auth_config.json");
  const config = await response.json();
  return config;
};

// Initialize Auth0 client
const configureClient = async () => {
  try {
    const config = await fetchAuthConfig();

    if (!window.auth0) throw new Error("Auth0 SDK not loaded!");

    auth0Client = await auth0.createAuth0Client({
      domain: `dev-skmunlptv2i34eut.us.auth0.com`,
      clientId: `c3vURHxgT8yWRge4sKT6LL9UZgOUuv0I`,
      authorizationParams: {
        audience:`http://localhost:3000`, // typically "https://your-domain/api"
        redirect_uri: window.location.origin,
        scope: "profile email"
      }
    });

    await updateUI();
  } catch (error) {
    console.error("Auth0 Initialization Failed:", error);
  }
};

// Update UI based on auth state
const updateUI = async () => {
  const isAuthenticated = await auth0Client.isAuthenticated();

  document.getElementById("google-auth").disabled = isAuthenticated;

  if (isAuthenticated) {
    console.log("User Profile:", await auth0Client.getUser());
    callAPi();
  }
};

// LOGIN HANDLER
const login = async () => {
  try {
    await auth0Client.loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin,
        connection: "google-oauth2",
        audience: `http://localhost:3000`,
        scope: "openid profile email"
      }
    });
  } catch (error) {
    console.error("Login Failed:", error);
  }
};

const callAPi = async () => {
  try {
    const token = await auth0Client.getTokenSilently();

    const response = await fetch("/api/external", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const responseData = await response.json();
    console.log("API Response:", responseData);
  } catch (e) {
    console.error("API call failed:", e);
    document.getElementById("api-call-result").innerText = "Error: " + e.message;
  }
};

// APP START
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

  document.getElementById("google-auth").addEventListener("click", login);
};
