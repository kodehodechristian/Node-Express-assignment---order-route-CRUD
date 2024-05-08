import express from "express";
const router = express.Router();
import { ReqError } from "../middleware/errorHandler.mjs";
import {
  getOrders,
  getOrder,
  addOrder,
  deleteOrder,
} from "../database/dbQueries.mjs";
import { validateOrderData } from "../middleware/validateData.mjs";

router.get("/", (req, res) => {
  try {
    const data = getOrders();
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", validateOrderData, (req, res) => {
  try {
    const result = addOrder(req.body);
    if (result.changes) {
      res
        .status(201)
        .json({ message: "Order added successfully", addedOrder: req.body });
    } else {
      throw new Error("Failed to add order");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:orderId", (req, res, next) => {
  const { orderId } = req.params;
  try {
    const data = getOrder(orderId);
    if (data) {
      res.status(200).json({ orderId, data });
    } else {
      next(new ReqError(404, `Order with id ${orderId} doesn't exist.`));
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:orderId", (req, res, next) => {
  const { orderId } = req.params;
  try {
    const result = deleteOrder(orderId);
    if (result.changes) {
      res
        .status(200)
        .json({ message: `Successfully deleted order with id ${orderId}` });
    } else {
      next(new ReqError(404, `Order with id ${orderId} doesn't exist.`));
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.all("/:orderId", (req, res, next) => {
  next(
    new ReqError(
      405,
      "Unsupported request method. Please refer to the API documentation"
    )
  );
});

export default router;
