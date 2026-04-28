import React, { useState } from "react";
import { Trash2 } from "lucide-react";

const AppointmentDelete = ({ id, onDeleted }) => {
  const [open, setOpen] = useState(false);
  const url = import.meta.env.VITE_SERVER_URL;

  const handleDelete = async () => {
    try {
      await fetch(`${url}/appointments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOpen(false);

      if (onDeleted) {
        onDeleted();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex items-center gap-2"
      >
        <Trash2 size={18} />
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] text-center">
            <h2 className="text-xl font-semibold mb-3">
              Delete Appointment
            </h2>

            <p className="text-gray-600 mb-5">
              Are you sure you want to delete this appointment?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentDelete;
