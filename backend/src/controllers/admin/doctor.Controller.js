
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../../models/user");

const {
    createDoctorDB,
    getAllDoctorsDB,
    getDoctorByIdDB,
    updateDoctorDB,
    deleteDoctorDB
} = require("../../services/admin/doctor.service");

// CREATE DOCTOR
const createDoctor = async (req, res) => {
    let user = null;

    try {
        const {
            name,
            email,
            password,
            phone,
            specialization,
            department,
            experience,
            fees,
            availableDays,
            availableTime,
            about
        } = req.body;

        const imageUrl = req.file ? req.file.path : "";

        // Validate required fields
        const requiredFields = {
            name,
            email,
            password,
            phone,
            specialization,
            department,
            experience,
            fees
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) =>
                value === undefined ||
                value === null ||
                String(value).trim() === ""
            )
            .map(([key]) => key);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: "Required fields are missing",
                missingFields
            });
        }

        if (
            !Number.isFinite(Number(experience)) ||
            !Number.isFinite(Number(fees)) ||
            Number(experience) < 0 ||
            Number(fees) < 0
        ) {
            return res.status(400).json({
                success: false,
                error: "Experience and fees must be valid non-negative numbers"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check existing email
        const existing = await User.findOne({
            email: normalizedEmail
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                error: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            phone: phone.trim(),
            password: hashedPassword,
            role: "doctor"
        });

        // Create Doctor Profile
        const doctor = await createDoctorDB({
            userId: user._id,
            specialization: specialization.trim(),
            department: department.trim(),
            experience: Number(experience),
            fees: Number(fees),
            availableDays: availableDays || undefined,
            availableTime: availableTime || undefined,
            profileImage: imageUrl,
            about: about || ""
        });

        return res.status(201).json({
            success: true,
            message: "Doctor created successfully",
            data: doctor
        });

    } catch (error) {
        // Remove user if doctor profile creation fails
        if (user) {
            try {
                await User.findByIdAndDelete(user._id);
            } catch (rollbackError) {
                console.error("Rollback Error:", rollbackError.message);
            }
        }

        console.error("Create Doctor Error:", error);

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// GET ALL DOCTORS
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await getAllDoctorsDB();

        return res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: "Failed to fetch doctors"
        });
    }
};

// GET SINGLE DOCTOR
const getDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid doctor ID"
            });
        }

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
        console.error(error);

        return res.status(500).json({
            success: false,
            error: "Error fetching doctor"
        });
    }
};

// UPDATE DOCTOR
const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid doctor ID"
            });
        }

        const allowedFields = [
            "specialization",
            "department",
            "experience",
            "fees",
            "availableDays",
            "availableTime",
            "about"
        ];

        const updateData = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        if (req.file) {
            updateData.profileImage = req.file.path;
        }

        if (updateData.experience !== undefined) {
            updateData.experience = Number(updateData.experience);
        }

        if (updateData.fees !== undefined) {
            updateData.fees = Number(updateData.fees);
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                error: "No update data provided"
            });
        }

        const doctor = await updateDoctorDB(id, updateData);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                error: "Doctor not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Doctor updated successfully",
            data: doctor
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// DELETE DOCTOR
const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid doctor ID"
            });
        }

        const doctor = await deleteDoctorDB(id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                error: "Doctor not found"
            });
        }

        await User.findByIdAndDelete(doctor.userId);

        return res.status(200).json({
            success: true,
            message: "Doctor deleted successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: error.message
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
