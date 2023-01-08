const mongoose = require("mongoose");
const chat = new mongoose.Schema({
    nameq:String,
    question: String,
    answers: [
        {
            namea:String,
            answer:String
        }
    ]

})

module.exports = mongoose.model("Chat",chat);