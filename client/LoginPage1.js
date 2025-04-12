let auth0Client = null;

// Fetch Auth0 config (domain + clientId)
const fetchAuthConfig = async () => {
  const response = await fetch("/auth_config.json");
  
  // Debug: Log the response to verify domain/clientId
  console.log("Auth0 Config Response:", response);
  const config = await response.json();
  console.log("Auth0 Config Data:", config); // Check domain/clientId here
  
  return config;
};

// Initialize Auth0 client
const configureClient = async () => {
  try {
    const config = await fetchAuthConfig();

    // Check if Auth0 SDK is loaded
    if (!window.auth0) {
      throw new Error("Auth0 SDK not loaded! Check script order in HTML.");
    }

    auth0Client = await auth0.createAuth0Client({
      domain: config.domain,
      clientId: config.clientId,
      authorizationParams: {
        audience: config.audience
      }
    });

    console.log("Auth0 Client Initialized:", auth0Client); // Debug
    await updateUI(); // Enable/disable buttons
  } catch (error) {
    console.error("Auth0 Initialization Failed:", error);
  }
};

// Update UI based on auth state
const updateUI = async () => {
  const isAuthenticated = await auth0Client.isAuthenticated();
  console.log("User Authenticated:", isAuthenticated); 

  document.getElementById("btn-logout").disabled = !isAuthenticated;
  document.getElementById("btn-login").disabled = isAuthenticated;
  document.getElementById("btn-call-api").disabled = !isAuthenticated;

  if(isAuthenticated){
    document.getElementById("gated-content").classList.remove("hidden");

    document.getElementById(
        "ipt-access-token"
    ).innerHTML = await auth0Client.getTokenSilently();

    document.getElementById("ipt-user-profile").textContent = JSON.stringify(
        await auth0Client.getUser()
    );
  } else{
    document.getElementById("gated-content").classList.add("hidden");
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

// Logout
const logout = async () => {
  try {
    await auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  } catch (error) {
    console.error("Logout Failed:", error);
  }
};

const callAPi = async () => {
    try{
        const token = await auth0Client.getTokenSilently();

        const response = await fetch("/api/external", {
            headers: {
                Authorization : `Bearer ${token}`
            }
        });
        const responseData = await response.json();
       document.getElementById("api-call-result").innerText = JSON.stringify(responseData,null,2);
    } catch (e){
        console.error("API call failed:", e);
        document.getElementById("api-call-result").innerText = "Error: " + e.message;
    }
};

// Initialize on page load
window.onload = async () => {
  await configureClient();

  // Handle redirect callback (if coming back from Auth0)
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

