var mongoose = require("mongoose");

// SCHEMA SETUP
var itemSchema = mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    price: String,
    inprogress: Boolean,
    offerer: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        iid: Number,
        username: String,
        ready: Boolean
    },
    borrower: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        iid: Number,
        username: String,
        ready: Boolean
    },
    exchangeId: Number,
    holdTime: Number,
    duration: Number,
    dueDate: String,
    creationTime: String,
    expiryTime: String,
});

module.exports = mongoose.model("Item", itemSchema);
