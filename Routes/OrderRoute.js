const express = require("express");
const { Order } = require("../Models/Order");
const asyncHandler = require("express-async-handler");
const { protect } = require("../Middlewares/AuthMiddlewares");

const orderRouter = express.Router();

// CREATE ORDER
orderRouter.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { user, orderItems, customerAddress, totalPrice, isPaid } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      res.json("No Order Items!");
      return;
    } else {
      const order = await Order.create({
        user: user._id,
        orderItems,
        customerAddress,
        totalPrice,
        isPaid,
      });

      const savedOrder = await order.save();

      if (savedOrder) {
        res.status(200);
        res.json({ savedOrder });
      } else {
        console.log("Order not sent!");
      }
    }
  })
);

module.exports = { orderRouter };
