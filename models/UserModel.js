const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isValidPassword } = require('../utils/validation');


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [128, 'Password must be less than 128 characters long'],
        validate: {
          validator: function(value) {
            // Require at least one uppercase letter, one lowercase letter, one special character and one number
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])[a-zA-Z\d!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/]{8,}$/;
            return regex.test(value);
          },
          message: 'Password must contain at least one uppercase letter, one lowercase letter, one special character and one number'
        }
      },

    profileInfo: {
        name: String,
        address: String,
        image: {
            type: String,
            validate: {
                validator: function(v) {
                    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
                    return urlRegex.test(v);
                },
                message: props => `${props.value} is not a valid URL!`
            }
        }
    },
    
    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model('User', userSchema);

