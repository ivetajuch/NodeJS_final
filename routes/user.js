const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  SIGN_UP,
//   GET_NEW_JWT_TOKEN,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  UPDATE_USER_MONEY_BALANCE,
  GET_ALL_USERS_WITH_TICKETS,
  GET_USER_BY_ID_WITH_TICKETS,
  LOGIN,
} = require("../controllers/user");

router.post("/signUp", SIGN_UP);
router.post("/logIn", LOGIN);
// router.get("/newJwtToken", GET_NEW_JWT_TOKEN);
router.get("/users", authMiddleware, GET_ALL_USERS);
router.get("/user/:id", authMiddleware, GET_USER_BY_ID);
router.put("/user/moneyBalance/:id", authMiddleware, UPDATE_USER_MONEY_BALANCE)
router.get("/usersWithTickets", authMiddleware, GET_ALL_USERS_WITH_TICKETS);
router.get("/tickets/:id", authMiddleware, GET_USER_BY_ID_WITH_TICKETS);


module.exports = router;