const mongoose = require("mongoose");
const schoschema = new mongoose.Schema({
    name: String,
    eligibility: String,
    details: String

})

module.exports = mongoose.model("Scholarshipcard",schoschema);