const admin = require('firebase-admin');
const User = require("../models/userModel.js");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault() // Or provide the path to your service account key file
});

const googleLogin = async (req, res) => {
  const authHeader = req.headers['Authorization'];

  const idToken = authHeader.split(' ')[1];
  // Now you can verify/use the token
  console.log(idToken);
  
  try {
    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    //get the  request body
    const userData = req.body;
    console.log(userData);
    
    // Check if the user is logging in for the first time by querying the database
    const user = await User.findOne({ id_from_third_party : uid });
    
    if (!user) {
      // If the user doesn't exist, it means they are a first-time user

      // add the new user
      const newUser = new User({
        id_from_third_party : uid,
        third_party_name: 'google',
      });
      
      newUser.save()
        .then((savedUser) => {
          return res.json({ firstTimeUser: true, RedirectTo: "/role-selection" });
        })
        .catch((err) => {
          console.error('Error saving user:', err);
          res.status(500).json({ error: "Internal server error" });
        });
      
      
    }
    
    // If the user exists, it's not their first time
    res.json({ firstTimeUser: false , RedirectTo:"/home"});
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

const isUser = async (req, res) => {
  try {
    const user = await User.findOne({ id_from_third_party: req.query.id }).exec();
    return { exists: !!user };
  } catch (error) {
    console.error('Error checking user ID:', error);
    return { exists: false };
  }

}

module.exports = { googleLogin, githubLogin, microsoftLogin, isUser };
