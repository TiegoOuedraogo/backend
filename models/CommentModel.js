const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    review: { type: Schema.Types.ObjectId, ref: 'Review', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 500
      },
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Comment', commentSchema);
  
  