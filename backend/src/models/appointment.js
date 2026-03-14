const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
{
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "approved", "completed", "cancelled"],
        default: "pending"
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending"
    },

    reason: {
        type: String
    },

    notes: {
        type: String
    }

},
{
    timestamps: true
}
);

const appointment = mongoose.model("appointment", appointmentSchema);
 module.exports = appointment;