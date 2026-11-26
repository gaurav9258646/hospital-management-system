
const Doctor = require("../../models/doctor");

const createDoctorDB = async (data) => {
    return await Doctor.create(data);
};

const getAllDoctorsDB = async () => {
    return await Doctor.find()
        .populate("userId", "name email phone role")
        .sort({ createdAt: -1 });
};

const getDoctorByIdDB = async (id) => {
    return await Doctor.findById(id)
        .populate("userId", "name email phone role");
};

const updateDoctorDB = async (id, data) => {
    return await Doctor.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    ).populate("userId", "name email phone role");
};

// DELETE DOCTOR
const deleteDoctorDB = async (id) => {
    return await Doctor.findByIdAndDelete(id);
};

module.exports = {
    createDoctorDB,
    getAllDoctorsDB,
    getDoctorByIdDB,
    updateDoctorDB,
    deleteDoctorDB
};
