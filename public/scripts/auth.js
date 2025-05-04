// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import getBaseUrl from './base-url.mjs';
const baseURL = getBaseUrl();

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

// // Redirect to home if already logged in
// onAuthStateChanged(auth, user => {
//     if (user) {
//       if (window.location.pathname.includes("index.html")) {
//         // Already logged in but still on login page → redirect
//         console.log(user);
//         window.location.href = "./client-home";
//       } else {
//         // On dashboard page → show user info
//         const userInfoEl = document.getElementById("user-info");
//         if (userInfoEl) {
//             const providerData = user.providerData[0] || {};
//             const name = user.displayName || providerData.displayName || providerData.email || providerData.uid || "User";
//             userInfoEl.textContent = `Welcome, ${name}`;
//         }
//       }
//     } else {
//       if (!window.location.pathname.includes("index.html")) {
//         // Not logged in and trying to access dashboard → redirect to login
//         window.location.href = "../";
//       }
//     }
//   });
  

// Google Authentication
const google_login = document.getElementById("google-auth");
if(google_login){
    //if google_login is not null like when we are on the index page but when we are on the userdashboard it will be null
    google_login.addEventListener('click', async () => {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;
          const idToken = await user.getIdToken();

          //get the firebase id
          const firebaseid = user.uid;
          sessionStorage.setItem('firebaseId', firebaseid);  // Store user object in sessionStorage
          const user_name = user.displayName || user.email || "User";
          sessionStorage.setItem("display-name",user_name);
          sessionStorage.setItem('user',JSON.stringify(user));
      
          // Send to your server
          const response = await fetch(`${baseURL}/auth/check-auth?id=${user.uid}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`, // Firebase ID token
            }
          });
      
           // Handle the response from the server
          if (response.ok) {
              const data = await response.json();
           

              if (data.exists) {
                  // User exists, redirect to home page
                  
                  window.location.href = data.RedirectTo; 
              } else {
                  // User doesn't exist, store the user object and redirect to role selection
                  
                  sessionStorage.setItem('idToken', idToken);
                  sessionStorage.setItem("provider",user.providerData[0].providerId); // getting the third party provider name
                  window.location.href = "./role-selection";
              }
          }else {
              throw new Error("Failed to check user existence");
          }

        } catch (error) {
          console.error("Google sign-in error:", error);
        }
    });
}    


// Github Authentication
const github_login = document.getElementById("github-auth");
if(github_login){
    //if google_login is not null like when we are on the index page but when we are on the userdashboard it will be null
    github_login.addEventListener('click', async () => {
        try {
          const result = await signInWithPopup(auth, githubProvider);
          const user = result.user;
          const idToken = await user.getIdToken();

          //get the firebase id
          const firebaseid = user.uid;
          sessionStorage.setItem('firebaseId', firebaseid);  // Store user object in sessionStorage
          const user_name = user.displayName || user.email || "User";
          sessionStorage.setItem("display-name",user_name);
          sessionStorage.setItem("email",user.email);
          sessionStorage.setItem("photoURL",user.photoURL);

      
          // Send to your server
          const response = await fetch(`${baseURL}/auth/check-auth?id=${user.uid}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`, // Firebase ID token
            }
          });
      
           // Handle the response from the server
          if (response.ok) {
              const data = await response.json();
           
              if (data.exists) {
                  // User exists, redirect to home page
                
                  window.location.href = data.RedirectTo; 
              } else {
                  // User doesn't exist, store the user object and redirect to role selection
                  
                  sessionStorage.setItem('idToken', idToken);
                  sessionStorage.setItem("provider",user.providerData[0].providerId); // getting the third party provider name
                  window.location.href = "./role-selection";
              }
          }else {
              throw new Error("Failed to check user existence");
          }

        } catch (error) {
          console.error("Github sign-in error:", error);
        }
    });
}  

// Microsoft Authentication - do this later
const microsoft_login = document.getElementById("microsoft-auth");
if(microsoft_login){
    microsoft_login.addEventListener('click', function () {
        alert("Microsoft was clicked");
    });

}

//clean this up later
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