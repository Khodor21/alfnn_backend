import express from "express";
import Message from "../models/Message.js";
import Blog from "../models/Blog.js";
const router = express.Router();

router.post("/contact", async (req, res) => {
  try {
    const { name, number, message } = req.body;
    const postMessage = new Message({
      name,
      number,
      message,
    });
    await postMessage.save();
    res.status(201).json({ message: "Message submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/contact", async (req, res) => {
  try {
    const getMessages = await Message.find();
    res.status(200).json(getMessages);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
