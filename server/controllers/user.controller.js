const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  register: (req, res) => {
    console.log("Registration data received:", req.body);


    const userData = {
      username: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.password, 
      picture: req.body.picture || "",
      experience: req.body.experience || 0,
      quote: req.body.quote || "",
    };

    const user = new User(userData);
    user
      .save()
      .then((newUser) => {
        console.log(newUser);
        const token = jwt.sign(
          { id: newUser._id, email: newUser.email },
          process.env.JWT_SECRET
        );
        res.json({
          successMessage: "Thank you for registering!",
          user: newUser,
          jwt: token, 
        });
      })
      .catch((err) => {
        console.log("Registration failed:", err);
        res.status(400).json(err);
      });
  },

login: (req, res) => {
  User.findOne({ email: req.body.email })
    .then((userRecord) => {
      if (userRecord === null) {
        res.status(400).json({ message: "Invalid Login Attempt" });
      } else {
        bcrypt
          .compare(req.body.password, userRecord.password)
          .then((isPasswordValid) => {
            if (isPasswordValid) {
              console.log("password is valid!");
              
              const token = jwt.sign(
                {
                  id: userRecord._id,
                  email: userRecord.email,
                  username: userRecord.username,
                },
                process.env.JWT_SECRET
              );
              
              res.json({
                message: "Login Successful",
                userLoggedIn: userRecord.username,
                userId: userRecord._id,
                jwt: token  // Add this line
              });
            } else {
              res.status(400).json({
                message: "Invalid Email/Password",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({
              message: "Invalid Email/Password",
            });
          });
      }
    })
    .catch((err) => {
      console.log("error");
      res.status(400).json({
        message: "Invalid Attempt",
      });
    });
},
  logout: (req, res) => {
    console.log("logging out");
    res.clearCookie("usertoken");
    res.json({
      message: "You have successfully logged out",
    });
  },

  getOneUser: (req, res) => {
    User.findOne({ _id: req.params.userId })
      .then((oneUser) => {
        console.log(oneUser);
        res.json(oneUser);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  updateUser: (req, res) => {
    User.findOneAndUpdate({ _id: req.params.userId }, req.body, {
      new: true,
      runValidators: true,
    })
      .then((updatedUser) => {
        console.log(updatedUser);
        res.json({ user: updatedUser });
      })
      .catch((err) => {
        console.log("updateUser failed...");
        res.status(400).json(err);
      });
  },
  getProfile: (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        User.findById(decoded.id)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                res.json(user);
            })
            .catch(err => res.status(400).json(err));
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}
};
