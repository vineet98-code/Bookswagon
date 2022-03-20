var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
var User = require('../models/User');
var auth = require('../middleware/auth');


//Get Profile

router.get('/:username', auth.optionalAuth, async (req, res, next) => {
  console.log(req.user);
  try {
    let username = req.params.username;
    let user = await User.findOne({ username });
    if (user) {
      res.status(201).json({
        profile: { 
          username: user.username,
          bio: user.bio,
          image: user.image,
         
        }
      });
    } else {
       res.status(404).json({message: "User not found" });
      }
  } catch (error) {
      next(error);
    }
});


  
 module.exports = router;