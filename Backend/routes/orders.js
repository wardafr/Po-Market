const express = require("express");
const router = express.Router();
const ordersController = require("../controller/orders");

router.get("/get-all-orders", ordersController.getAllOrders);
router.post("/order-by-user", ordersController.getOrderByUser);

router.post("/create-order", ordersController.postCreateOrder);
router.put("/update-order", ordersController.postUpdateOrder);
router.delete("/delete-order", ordersController.postDeleteOrder);

module.exports = router;
