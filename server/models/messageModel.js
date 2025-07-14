const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true , trim:true},
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Chat"
    }
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Messages", MessageSchema);

module.exports = Message;
