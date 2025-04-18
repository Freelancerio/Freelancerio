import admin from 'firebase-admin';
import User from "../models/userModel.js";

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault() // Or provide the path to your service account key file
});

const googleLogin = async (req, res) => {
  const idToken = req.body.idToken; // The Firebase ID token sent from the frontend
  
  try {
    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Check if the user is logging in for the first time by querying the database
    const user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      // If the user doesn't exist, it means they are a first-time user
      return res.json({ firstTimeUser: true, RedirectTo: "/role-selection" });
    }
    
    // If the user exists, it's not their first time
    res.json({ firstTimeUser: false });
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const githubLogin = async (req, res) => {
  const idToken = req.body.idToken; // The Firebase ID token sent from the frontend
  
  try {
    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Check if the user is logging in for the first time by querying the database
    const user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      // If the user doesn't exist, it means they are a first-time user
      return res.json({ firstTimeUser: true, RedirectTo: "/role-selection" });
    }
    
    // If the user exists, it's not their first time
    res.json({ firstTimeUser: false });
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const microsoftLogin = async (req, res) => {
  const idToken = req.body.idToken; // The Firebase ID token sent from the frontend
  
  try {
    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Check if the user is logging in for the first time by querying the database
    const user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      // If the user doesn't exist, it means they are a first-time user
      return res.json({ firstTimeUser: true, RedirectTo: "/role-selection" });
    }
    
    // If the user exists, it's not their first time
    res.json({ firstTimeUser: false });
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { googleLogin, githubLogin, microsoftLogin };
