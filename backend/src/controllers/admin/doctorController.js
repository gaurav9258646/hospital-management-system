const {
    createDoctorDB,
    getAllDoctorsDB,
    getDoctorByIdDB,
    updateDoctorDB,
    deleteDoctorDB
} = require("../../services/admin/doctorServices");

const createDoctor = async (req, res) => {
    try {
        const doctor = await createDoctorDB(req.body);

        
        return res.status(201).json({
            success: true,
            message: "Doctor created",
            data: doctor
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Failed to create doctor"
        });
        console.log(error); 
    }
};

const getAllDoctors = async (req, res) => {
    try {

        const doctors = await getAllDoctorsDB();

        return res.status(200).json({
            success: true,
            data: doctors
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Failed to fetch doctors"
        });
    }
};

const getDoctor = async (req, res) => {
    try {

        const { id } = req.params;

        const doctor = await getDoctorByIdDB(id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                error: "Doctor not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: doctor
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Error fetching doctor"
        });
    }
};

// Update Doctor
const updateDoctor = async (req, res) => {
    try {

        const { id } = req.params;

        const doctor = await updateDoctorDB(id, req.body);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                error: "Doctor not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Doctor updated",
            data: doctor
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Update failed"
        });
    }
};

const deleteDoctor = async (req, res) => {
    try {

        const { id } = req.params;

        const doctor = await deleteDoctorDB(id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                error: "Doctor not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Doctor deleted"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Delete failed"
        });
    }
};

module.exports = {
    createDoctor,
    getAllDoctors,
    getDoctor,
    updateDoctor,
    deleteDoctor
};