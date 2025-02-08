const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    senderId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    receverId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    message : String,
    timeStamp : {
        type  :Date,
        default : Date.now,
    },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;