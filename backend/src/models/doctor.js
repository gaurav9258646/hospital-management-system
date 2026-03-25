const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    specialization: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    experience: {
        type: Number,
        required: true
    },

    fees: {
        type: Number,
        required: true
    },

    availableDays: {
        type: [String],
        default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    },

    availableTime: {
        start: String,
        end: String
    },

    profileImage: {
        type: String
    },

    about: {
        type: String
    }
},
{
    timestamps: true
}
);
const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
 