
const Appointment = require("../../models/appointment");

// CREATE APPOINTMENT
const createAppointmentDB = async (data) => {
  return await Appointment.create(data);
};

// GET ALL APPOINTMENTS
const getAllAppointmentsDB = async () => {
  return await Appointment.find()
    .populate("patientId", "name email")
    .populate({
      path: "doctorId",
      populate: {
        path: "userId",
        select: "name email"
      }
    })
    .sort({ createdAt: -1 });
};

// GET APPOINTMENT BY ID
const getAppointmentByIdDB = async (id) => {
  return await Appointment.findById(id)
    .populate("patientId", "name email")
    .populate({
      path: "doctorId",
      populate: {
        path: "userId",
        select: "name email"
      }
    });
};

// GET PATIENT APPOINTMENTS
const getAppointmentsByPatientDB = async (patientId) => {
  return await Appointment.find({ patientId })
    .populate({
      path: "doctorId",
      populate: {
        path: "userId",
        select: "name"
      }
    })
    .sort({ createdAt: -1 });
};

// GET DOCTOR APPOINTMENTS
const getAppointmentsByDoctorDB = async (doctorId) => {
  return await Appointment.find({ doctorId })
    .populate("patientId", "name email")
    .sort({ createdAt: -1 });
};

// UPDATE APPOINTMENT
const updateAppointmentDB = async (id, data) => {
  return await Appointment.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true
    }
  );
};

// DELETE APPOINTMENT
const deleteAppointmentDB = async (id) => {
  return await Appointment.findByIdAndDelete(id);
};

// CHECK SLOT AVAILABILITY
const isSlotAvailable = async (doctorId, date, time) => {
  const startOfDay = new Date(`${date}T00:00:00.000`);
  const endOfDay = new Date(`${date}T23:59:59.999`);

  const existing = await Appointment.findOne({
    doctorId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    time,
    status: { $ne: "cancelled" }
  });

  return !existing;
};

// CANCEL APPOINTMENT
const cancelAppointmentDB = async (id, cancelReason) => {
  return await Appointment.findByIdAndUpdate(
    id,
    {
      status: "cancelled",
      cancelReason: cancelReason || "Cancelled by patient"
    },
    {
      new: true,
      runValidators: true
    }
  );
};

// UPDATE PAYMENT STATUS
const updatePaymentStatusDB = async (id) => {
  return await Appointment.findByIdAndUpdate(
    id,
    {
      paymentStatus: "paid",
      status: "approved"
    },
    {
      new: true,
      runValidators: true
    }
  );
};

module.exports = {
  createAppointmentDB,
  getAllAppointmentsDB,
  getAppointmentByIdDB,
  getAppointmentsByPatientDB,
  getAppointmentsByDoctorDB,
  updateAppointmentDB,
  deleteAppointmentDB,
  isSlotAvailable,
  cancelAppointmentDB,
  updatePaymentStatusDB
};
