const admin = require('firebase-admin');
const { User } = require("../models/userModel.js");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault() // Or provide the path to your service account key file
});

const isUser = async (req, res) => {
  try {
    console.log(req.query.id);
    const user = await User.findOne({ id_from_third_party: req.query.id }).exec();
    console.log(user);
    if (!user) {
      return { exists: false, RedirectTo: "/role-selection" };
    }

    let redirectpath = "/";
    if(user.role === "user"){
      redirectpath = "/freelancer-home";
    }else if(user.role === "client"){
      redirectpath = "/client-home";
    }
    else{
      redirectpath = "/admin-home";
    }
 
    res.status(200).json({ exists: !!user , RedirectTo : redirectpath });
  } catch (error) {
    console.error('Error checking user ID:', error);
    return { exists: false,  RedirectTo : "/role-selection" };
  }
}

const addUser = async (req,res) =>{
  const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        // Verify token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uidFromToken = decodedToken.uid;
        const providerFromToken = decodedToken.firebase?.sign_in_provider;

        const { firebaseId, provider, role } = req.body;

        if (firebaseId !== uidFromToken) {
            return res.status(403).json({ error: 'User ID mismatch' });
        }

        // Save to MongoDB
        const user = new User({
            id_from_third_party: firebaseId,
            third_party_name: providerFromToken || provider, 
            role,
        });

        await user.save();
        if(role == "user"){
          res.status(200).json({ message: 'User saved successfully!',RedirectTo: "/client-home" });
        }else{
          res.status(200).json({ message: 'User saved successfully!',RedirectTo: "/freelancer-home" });
        }

    } catch (error) {
        // Handle duplicate user error
        if (error.code === 11000) {
            return res.status(409).json({ error: 'User already exists' });
        }

        console.error('Error saving user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports = {isUser, addUser };
