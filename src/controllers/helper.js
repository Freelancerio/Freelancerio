const admin = require('../firebase/firebase.js');
const { User } = require("../models/userModel.js");

const getUserDetailsById = async (userId) => {
  try {
    const user = await User.findOne({ id_from_third_party: userId });

    if (!user) return null;

    const firebaseUser = await admin.auth().getUser(userId);
    if (!firebaseUser) return null;

    return {
      about: user.about || '',
      skills: user.skills || '',
      displayName: firebaseUser.displayName || 'Unknown User',
      email: firebaseUser.email || 'Email Unavailable',
      photoURL: firebaseUser.photoURL || ''
    };
  } catch (error) {
    console.error('Error in getUserDetailsById:', error);
    return null;
  }
};

module.exports = { getUserDetailsById };
