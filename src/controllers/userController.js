const admin = require('../firebase/firebase.js');
const { User } = require("../models/userModel.js");

const isUser = async (req, res) => {
  try {
    // console.log(req.query.id);
    const user = await User.findOne({ id_from_third_party: req.query.id }).exec();
    // console.log(user);

    if (user === null ) {
      // console.log("triggered");
      res.status(200).json({ exists: false , RedirectTo : "/role-selection" });
      return;
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
 
    res.status(200).json({ exists: true , RedirectTo : redirectpath });
  } catch (error) {
    console.error('Error checking user ID:', error);
    res.status(500).json({ exists: false, RedirectTo: "/role-selection" });
  }
}

const addUser = async (req,res) =>{
  const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).json({ error: 'Unauthorized: No token provided', RedirectTo: "/", message : "Unauthorized: No token provided" });
    }

    try {
        // Verify token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uidFromToken = decodedToken.uid;
        const providerFromToken = decodedToken.firebase?.sign_in_provider;

        const { firebaseId, provider, role } = req.body;

        if (firebaseId !== uidFromToken) {
            return res.status(403).json({ error: 'User ID mismatch', RedirectTo: "/", message : "User ID mismatch" });
        }

        // Save to MongoDB
        const user = new User({
            id_from_third_party: firebaseId,
            third_party_name: providerFromToken || provider, 
            role,
        });

        await user.save();
        if(role == "user"){
          res.status(200).json({ message: 'User saved successfully!',RedirectTo: "/freelancer-home" });
        }else{
          res.status(200).json({ message: 'User saved successfully!',RedirectTo: "/client-home" });
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

const retrieveUsers = async (req, res) => {
  try {
    // Fetch all users with role 'user' from MongoDB
    const users = await User.find({ role: 'user' }).lean();

    // If no users found
    if (!users || users.length === 0) {
      return res.status(200).json([]);
    }

    // Fetch Firebase user info for each user in parallel
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        try {
          const firebaseUser = await admin.auth().getUser(user.id_from_third_party);
          return {
            username: firebaseUser.displayName || "N/A",
            email: firebaseUser.email || "N/A",
            uid: user.id_from_third_party,
          };
        } catch (error) {
          console.warn(`Firebase user not found for UID: ${user.id_from_third_party}`);
          return null; // or keep the MongoDB record only if you prefer
        }
      })
    );

    // Filter out any nulls (failed Firebase lookups)
    const filteredUsers = enrichedUsers.filter(user => user !== null);

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//update the about and the skills from the user
const updateUserDetails = async (req, res) => {
  try {
    const { userId } = req.params; // This is the userId from the route params
    const { about, skills } = req.body; // Get the about and skills from the request body

    // Validate that both fields exist (even if they are empty strings)
    if (about !== undefined && typeof about !== 'string') {
      return res.status(400).json({ message: 'About must be a string' });
    }

    if (skills !== undefined && typeof skills !== 'string') {
      return res.status(400).json({ message: 'Skills must be a string' });
    }

    // Find the user by id_from_third_party (userId should match id_from_third_party)
    const updatedUser = await User.findOneAndUpdate(
      { id_from_third_party: userId },  // Find user by id_from_third_party
      { about, skills },                // Fields to update
      { new: true }                     // Return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the updated user data
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//get user details
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;  // Get the userId (id_from_third_party)

    // Find the user by their id_from_third_party (userId)
    const user = await User.findOne({ id_from_third_party: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user details from Firebase using the email from the User model
    const firebaseUser = await admin.auth().getUser(userId);

    if (!firebaseUser) {
      return res.status(404).json({ message: 'User not found in Firebase' });
    }

    // Combine MongoDB user details (about, skills) with Firebase user details (displayName, email)
    const userDetails = {
      about: user.about || '',
      skills: user.skills || '',
      displayName: firebaseUser.displayName || 'Unknown User',
      email: firebaseUser.email || 'Email Unavailable',
      photoURL: firebaseUser.photoURL || ''
    };
    console.log(userDetails);

    // Send the response with user details
    res.status(200).json({ message: 'User details fetched successfully', user: userDetails });
    
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {isUser, addUser, retrieveUsers, updateUserDetails, getUserDetails };
