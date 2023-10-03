const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//SHOW

router.get("/", async (req, res) => {
  try {
    res.json(await User.find({}));
  } catch (error) {
    res.status(400).json(error);
  }
});

//show one user with id

router.get("/:id", async (req, res) => {
  try {
    res.json(await User.findById(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});

//create a user or sign up a new user
router.post("/signup", async (req, res) => {
  console.log(req.body);
  //hashing a passoword with bcrypt before User.create()
  if (req.body.email && req.body.password) {
    let plainTextPassword = req.body.password;
    bcrypt.hash(plainTextPassword, 10, async (err, hashedPassword) => {
      req.body.password = hashedPassword;
      let newUser = await User.create(req.body);

      res.send(newUser);
    });
  }
});


//Login a user

router.post("/login", async (req, res) => {
  console.log(req.body);
  let userToLogin = await User.findOne({ email: req.body.email });
  if (userToLogin) {
    bcrypt.compare(req.body.password, userToLogin.password, (err, result) => {
      if (result) {
        req.session.userId = userToLogin._id;
        req.session.name = userToLogin.name;
        res.send("you are logged in");
      } else {
        res.send("Wrong password");
      }
    });
  }
});


  


// UPDATE a User
router.put("/:id", async (req, res) => {
  console.log(req.body);
  try {
    res.json(
      await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    res.status(400).json(error);
  }
});

// DELETE a User
router.delete("/:id", async (req, res) => {
  try {
    res.json(await User.findByIdAndDelete(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});

//logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
