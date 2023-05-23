const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  INSERT_TICKET,
  GET_ALL_TICKETS,
  GET_TICKET_BY_ID,
  DELETE_TICKET,
  BUY_TICKET,
} = require("../controllers/tickets");

router.post("/ticket", INSERT_TICKET);
router.get("/tickets",  authMiddleware, GET_ALL_TICKETS);
router.get("/ticket/:id", authMiddleware, GET_TICKET_BY_ID);
router.delete("/ticket/:id", authMiddleware, DELETE_TICKET);
router.put("/:userId/:ticketId", authMiddleware, BUY_TICKET);


module.exports = router;