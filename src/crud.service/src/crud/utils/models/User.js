import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        maxlength: 15,
    },

    last_name: {
        type: String,
        required: true,
        maxlength: 15,
    },

    phone_number: {
        type: Number,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password_salt: {
        type: String,
        required: true,
    },

    password_hash: {
        type: String,
        required: true,
    },

    created_date: {
        type: Date,
        default: Date.now,
    },

    modified_date: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", UserSchema);

export default User;
