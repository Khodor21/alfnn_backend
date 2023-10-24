import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  number: {
    type: String,
  },
  message: {
    type: String,
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
