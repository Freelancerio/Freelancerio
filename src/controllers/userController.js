// import User from "../models/userModel.js"

// // function to signup
// const userRegister =  (req, res) => {
//         // here i am just testing if all is working properly

//         // process the user data
//         const user = new User({
//             id_from_third_party : "234786rt7347ry34yr8u8u",
//             third_party_name : "Google",
//             role : "admin"
//         });
    
//         user.save()
//           .then((result) =>{
//             // Respond with the received data
//             return res.json({ message: "User Signup was successful!", result: result, error : "none" });
    
//           })
//           .catch((err) =>{
//             return res.json({ message: "User Signup was unsuccessful!", result: {}, error : err});
//           });

//   };

// // function to login
// const userlogin = (req,res) => {

// };


// module.exports =  { userRegister, userlogin };


import User from "../models/userModel.js"

// function to signup
const userRegister = (req, res) => {
    // here i am just testing if all is working properly

    // process the user data
    const user = new User({
        id_from_third_party: "234786rt7347ry34yr8u8u",
        third_party_name: "Google",
        role: "admin"
    });

    user.save()
        .then((result) => {
            // Respond with the received data
            return res.json({ message: "User Signup was successful!", result: result, error: "none" });
        })
        .catch((err) => {
            return res.json({ message: "User Signup was unsuccessful!", result: {}, error: err });
        });
};

// function to login
const userlogin = (req, res) => {

};

// Change this line from CommonJS to ES Module syntax
export { userRegister, userlogin };