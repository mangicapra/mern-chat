const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    partisipants: {
        type: [String],
        required: true,
        min: [2, 'There must be 2 participants'],
        max: 2
    }
});

const Conversation = mongoose.model("Conversation", ConversationSchema);

module.exports = Conversation;