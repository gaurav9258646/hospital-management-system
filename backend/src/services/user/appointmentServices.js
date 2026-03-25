const  Appointment = require("../../models/appointment");

const createAppointmentDB = async (data) => {
  return await Appointment.create(data);
};

const getAllAppointmentsDB = async () => {
  return await Appointment.find()
    .populate("patientId", "name email")
    .populate("doctorId", "name specialization");
};

const getAppointmentByIdDB = async (id) => {
  return await Appointment.findById(id)
    .populate("patientId", "name email")
    .populate("doctorId", "name specialization");
};

const getAppointmentsByPatientDB = async (patientId) => {
  return await Appointment.find({ patientId })
    .populate("doctorId", "name specialization");
};

const getAppointmentsByDoctorDB = async (doctorId) => {
  return await Appointment.find({ doctorId })
    .populate("patientId", "name email");
};

const updateAppointmentDB = async (id, data) => {
  return await Appointment.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
};

const deleteAppointmentDB = async (id) => {
  return await Appointment.findByIdAndDelete(id);
};

const isSlotAvailable = async (doctorId, date, time) => {
  const existing = await Appointment.findOne({
    doctorId,
    date,
    time,
    status: { $ne: "cancelled" }
  });

  return !existing;
};

module.exports = {
  createAppointmentDB,
  getAllAppointmentsDB,
  getAppointmentByIdDB,
  getAppointmentsByPatientDB,
  getAppointmentsByDoctorDB,
  updateAppointmentDB,
  deleteAppointmentDB,
  isSlotAvailable
};