import { useState } from "react";

import profile from "../../../assets/profile.png";
import Button from "../../../components/Button";
import Modal from "../../../components/HealthWorker/Modal";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-neutral-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-primary">My Profile</h1>
      <div className="flex justify-between items-center p-4 bg-card shadow-soft rounded-2xl border border-border">
        <div className="flex items-center gap-6">
          <img src={profile} alt="Profile" className="w-16 h-16 rounded-full border-2 border-primary" />
          <div>
            <p className="text-2xl font-bold text-primary-800">Mary Doe</p>
            <p className="text-lg text-primary-800">Community Health Worker</p>
            <p className="text-lg text-primary-800">Kavumo, Kicukiro</p>
          </div>
        </div>
        <Button
          name="Edit"
          className="bg-primary text-white px-5 py-2 rounded-full transition duration-200 hover:bg-primary-700"
          onClick={handleEditClick}
        />
      </div>

      {/* Personal Information Section */}
      <div className="mt-8 p-4 bg-card shadow-soft rounded-2xl border border-border">
        <h2 className="text-xl font-semibold text-primary-800 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "First Name", value: "Mary" },
            { label: "Last Name", value: "DOE" },
            { label: "Phone Number", value: "+250 786125117" },
            { label: "Email", value: "Marydoe@gmail.com" },
            { label: "Bio", value: "Community Health Worker" },
            { label: "Password", value: "......." },
          ].map((info) => (
            <div key={info.label} className="bg-primary-100 bg-opacity-20 p-3 rounded-md">
              <p className="text-primary-800 text-opacity-50">{info.label}</p>
              <p className="text-lg">{info.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Address Section */}
      <div className="mt-8 p-4 bg-card shadow-soft rounded-2xl border border-border">
        <h2 className="text-xl font-semibold text-primary-800 mb-4">Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Province", value: "Kigali" },
            { label: "District", value: "Kicukiro" },
            { label: "Sector", value: "Nyarugunga" },
            { label: "Cell", value: "Nkoko" },
            { label: "Village", value: "Kavumu" },
          ].map((address) => (
            <div key={address.label} className="bg-primary-100 bg-opacity-20 p-3 rounded-md">
              <p className="text-primary-800 text-opacity-50">{address.label}</p>
              <p className="text-lg">{address.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Editing Profile */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <form className="flex flex-col space-y-4 w-96">
          {[
            { label: "User Name", type: "text" },
            { label: "First Name", type: "text" },
            { label: "Last Name", type: "text" },
            { label: "Email", type: "email" },
            { label: "Phone Number", type: "tel" },
            { label: "Address", type: "text" },
            { label: "Bio", type: "text" },
          ].map((field) => (
            <label key={field.label} className="flex flex-col">
              {field.label}:
              <input
                type={field.type}
                className="field"
              />
            </label>
          ))}
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-full mt-4 transition duration-200 hover:bg-primary-700"
            onClick={handleCloseModal}
          >
            Save Changes
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
