const uniqid = require("uniqid");
const userModel = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports.SIGN_UP = async (req, res) => {
    try {
        if (!req.body.email.includes("@")) {
        return res.status(400).json({ response: "Email must include @" });
      }
  
      const modifiedName = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);
  
      if (req.body.password.length < 6 || !/\d/.test(req.body.password)) {
        return res.status(400).json({ response: "Password must be at least 6 characters long and contain a number" });
      }
  
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, async (err, hash) => {
          const user = new userModel({
            id: uniqid(),
            name: modifiedName,
            email: req.body.email,
            password: hash,
            boughtTickets: [],
            moneyBalance: req.body.moneyBalance,
        });
  
          await user.save();

          const token = jwt.sign(
            {userId: user.id}, 
            (process.env.JWT_PROTECT),
          {expiresIn: '2h'}, 
          {
            algorithm: "RS256",
          }
          );
          
          const refreshToken = jwt.sign(
              { userId: user.id },
              (process.env.JWT_PROTECT),
              { expiresIn: '1d' },
              {
                algorithm: 'RS256'
              }
            );

          res.status(200).json({ response: "You signed up successfully",jwt: token, refresh: refreshToken });
        });
      });
    } catch (err) {
      res.status(500).json({ response: "Something's wrong, please try again" });
    }
  };


module.exports.LOGIN = async (req, res) => {
  try {

const user = await userModel.findOne({email: req.body.email});

if(!user){
  return res.status(401).json({ response: "User doesn't exist" });
}

bcrypt.compare(req.body.password, user.password, (err, isPasswordMatch)=>{
if(isPasswordMatch){

const token = jwt.sign(
  {
  email: user.email,
  userId: user.id
}, (process.env.JWT_PROTECT),
{expiresIn: '2h'}, 
{
  algorithm: "RS256",
}
);

const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_PROTECT,
    { expiresIn: '1d' },
    {
      algorithm: 'RS256'
    }
  );

  return res.status(200).json({ response: "You logged in", jwt: token, refresh: refreshToken});
} else{
  return res.status(401).json({ response: "Something's wrong" });
}
})
    
  } catch (err) {
    console.log("ERR", err);
    return res.status(500).json({ response: "ERROR, please try later" });
  }
};

module.exports.GET_ALL_USERS = async (req, res) => {
    try {
      const users = await userModel.find().sort({ name: 1 });
      res.status(200).json({ users: users });
    } catch (err) {
      console.log("ERR", err);
      res.status(500).json({ response: "ERROR, please try later" });
    }
  };


module.exports.GET_USER_BY_ID = async (req, res) => {
    try {
      const user = await userModel.findOne({ id: req.params.id });
      res.status(200).json({ user: user });
    } catch (err) {
      console.log("ERR", err);
      res.status(500).json({ response: "User doesn't exist" });
    }
};


module.exports.UPDATE_USER_MONEY_BALANCE = async (req, res) => {
  const user = await userModel.findOne({ id: req.params.id });

  if (user) {
    const currentBalance = user.moneyBalance || 0;
    const updatedBalance = currentBalance + req.body.updatedMoneyBalance;

    await userModel.updateOne(
      { id: req.params.id },
      { moneyBalance: updatedBalance }
    );

    res.status(200).json({ response: "Your balance has been topped up with the specified amount" });
  } else {
    res.status(404).json({ response: "User not found" });
  }
};

module.exports.GET_ALL_USERS_WITH_TICKETS = async (req, res) => {
  try {
    const users = await userModel.aggregate([
      {
        $match: {
          boughtTickets: { $exists: true, $ne: [] }, 
        },
      },
      {
        $lookup: {
          from: "tickets",
          localField: "boughtTickets",
          foreignField: "id",
          as: "user_tickets",
        },
      },
      {
        $sort: { name: 1 }, 
      },
    ]).exec();

    res.status(200).json({ users: users });
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR, please try later" });
  }
};

module.exports.GET_USER_BY_ID_WITH_TICKETS = async (req, res) => {
  try {
 
    const userWithTickets = await userModel.aggregate([
      {
          $match: {id: req.params.id}
      },      
      {
              $lookup: {
                from: "tickets",
                localField: "boughtTickets",
                foreignField: "id",
                as: "user_tickets",
              }
            },              
          ]). exec();

      if (userWithTickets.length === 0) {
          return res.status(404).json({ response: "User doesn't exist" });
            }
      
      res.status(200).json({ user: userWithTickets });

  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "Error" });
  }
}; 