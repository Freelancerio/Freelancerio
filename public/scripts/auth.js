// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAtvf9BsTcI9-uL6VlaSGOEbkad2XL0dvg",
  authDomain: "freelancerio-1be2f.firebaseapp.com",
  projectId: "freelancerio-1be2f",
  storageBucket: "freelancerio-1be2f.firebasestorage.app",
  messagingSenderId: "205094991483",
  appId: "1:205094991483:web:6f3f392c3bdc10e17654de",
  measurementId: "G-4TSSBLL1CM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Modular auth setup
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Redirect to home if already logged in
onAuthStateChanged(auth, user => {
    if (user) {
      if (window.location.pathname.includes("index.html")) {
        // Already logged in but still on login page → redirect
        console.log(user);
        window.location.href = "./pages/userdashboard.html";
      } else {
        // On dashboard page → show user info
        const userInfoEl = document.getElementById("user-info");
        if (userInfoEl) {
            const providerData = user.providerData[0] || {};
            const name = user.displayName || providerData.displayName || providerData.email || providerData.uid || "User";
            userInfoEl.textContent = `Welcome, ${name}`;
        }
      }
    } else {
      if (!window.location.pathname.includes("index.html")) {
        // Not logged in and trying to access dashboard → redirect to login
        window.location.href = "../index.html";
      }
    }
  });
  

// Google Authentication
const google_login = document.getElementById("google-auth");
if(google_login){
    //if google_login is not null like when we are on the index page but when we are on the userdashboard it will be null
    google_login.addEventListener('click', async () => {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;
          const idToken = await user.getIdToken();
      
          // Send to your server
          const response = await fetch("https://localhost:3000/auth/google-auth/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`, // Firebase ID token
            },
            body: JSON.stringify(result.user),
          });
      
          if (!response.ok) throw new Error("Failed to send user data to server");
          console.log("User data sent to server ");
      
          // Then redirect to dashboard
          window.location.href = "./pages/userdashboard.html";
        } catch (error) {
          console.error("Google sign-in error:", error);
        }
    });
}    



// GitHub Authentication
const github_login = document.getElementById("github-auth");
if(github_login){
    github_login.addEventListener('click', function () {
        signInWithPopup(auth, githubProvider)
          .then(result => {
            const user = result.user;
            console.log("GitHub User:", user);
            window.location.href = "./pages/userdashboard.html";
          })
          .catch(error => {
            console.error("GitHub sign-in error:", error);
          });
    });
}

// Microsoft Authentication - do this later
const microsoft_login = document.getElementById("microsoft-auth");
if(microsoft_login){
    microsoft_login.addEventListener('click', function () {
        alert("Microsoft was clicked");
    });

}

const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        console.log("Logging out...");
        await signOut(auth);
        console.log("Signed out.");
        // Small delay to give Firebase time to update state
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 300);
      } catch (error) {
        console.error("Sign-out error:", error);
      }
    });
}