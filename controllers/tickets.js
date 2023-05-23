const uniqid = require("uniqid");
const ticketModel = require("../models/tickets");
const userModel = require("../models/user");


module.exports.INSERT_TICKET = async (req, res) => {
    try {
        const ticket = new ticketModel({
          id: uniqid(),    
          title: req.body.title,
          ticketPrice: req.body.ticketPrice,
          from: req.body.from,
          to: req.body.to,  
          toPhotoUrl: req.body.toPhotoUrl,
        });
    
        const savedTicket = await ticket.save();
    
        res.status(200).json({ response: savedTicket });
      } catch (err) {
        res.status(500).json({ response: "Error, please try later" });
      }
};


module.exports.GET_ALL_TICKETS = async (req, res) => {
    try {
      const tickets = await ticketModel.find();
      res.status(200).json({ All: tickets });
    } catch (err) {
      console.log("ERR", err);
      res.status(500).json({ response: "ERROR, please try later" });
    }
  };


module.exports.GET_TICKET_BY_ID = async (req, res) => {
    try {
      const ticket = await ticketModel.findOne({ id: req.params.id });
      res.status(200).json({ ticket: ticket });
    } catch (err) {
      console.log("ERR", err);
      res.status(500).json({ response: "ERROR, please try later" });
    }
  };

module.exports.DELETE_TICKET = async (req, res) => {
    try {
      const ticket = await ticketModel.deleteOne({ id: req.params.id });
      res.status(200).json({ ticket: ticket });
    } catch (err) {
      console.log("ERR", err);
      res.status(500).json({ response: "ERROR, please try later" });
    }
  };

  // module.exports.BUY_TICKET = async (req, res) => {
  //   try {
  //     const userId = req.params.userId;
  //     const ticketId = req.params.ticketId;
  
  //     const user = await userModel.findById(userId);
  
  //     if (!user) {
  //       return res.status(404).json({ message: "User not found" });
  //     }
  
  //     const ticket = await ticketModel.findById(ticketId);
  
  //     if (!ticket) {
  //       return res.status(404).json({ message: "Ticket not found" });
  //     }
  

  //     if (user.moneyBalance < ticket.ticketPrice) {
  //       return res.status(400).json({ message: "Insufficient balance" });
  //     }
  
      
  //     user.moneyBalance -= ticket.ticketPrice;
     
  //     await userModel.updateOne(
  //       { userId: req.params.userId },
  //       { $push: { boughtTickets: req.params.ticketId } }
  //     ).exec();
  
  //     await user.save();

  //     res.status(200).json({ response: "Purchase successful" });
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ response: "Error, please try later" });
  //   }
  // };


  module.exports.BUY_TICKET = async (req, res) => {
    try {
      const userId = req.params.userId;
      const ticketId = req.params.ticketId;
  
      const user = await userModel.findOne({ id : userId});
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const ticket = await ticketModel.findOne({id : ticketId});
  
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
  
      if (user.moneyBalance < ticket.ticketPrice) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
  
      user.moneyBalance -= ticket.ticketPrice;
  
      user.boughtTickets.push(ticketId); 
  
      await user.save();
  
      res.status(200).json({ response: "Purchase successful" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ response: "Error, please try later" });
    }
  };