import React, { useState } from "react";
import { useSession } from "../context/SessionContext";
import { useNavigate } from "react-router-dom";
import { addVehicle } from "../hooks/vehicleService";
import { MdOutlineFileUpload } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import { storage } from "../config/firebaseConfig";
import Menu from "../components/General/Menu";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CreateListingScreen = () => {
  const { user } = useSession(); // ✅ Get logged-in user info
  const navigate = useNavigate();
  const ViewData = "Listing";

  const [vehicleData, setVehicleData] = useState({
    images: ["", "", "", ""],
    name: "",
    plateNumber: "",
    model: "",
    fuelType: "",
    pricePerDay: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (index, file) => {
    if (!file) return;

    const storageRef = ref(storage, `vehicleImages/${Date.now()}_${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const updatedImages = [...vehicleData.images];
      updatedImages[index] = downloadURL;
      setVehicleData((prev) => ({ ...prev, images: updatedImages }));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      alert("You need to be logged in to add a vehicle.");
      return;
    }

    const newVehicle = {
      ...vehicleData,
      ownerId: user.uid, // ✅ Use logged-in user's ID as ownerId
    };

    const result = await addVehicle(newVehicle);
    if (result.success) {
      alert("Vehicle listed successfully!");
      // navigate("/listing"); // ✅ Redirect to listing page after success
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="flex flex-row w-full debug">
      <Menu ViewData={ViewData} />
      <div className="h-auto flex flex-col gap-5 p-5 w-full">
        <Link className="w-10 h-10" to="/listing">
          <BiArrowBack className="w-full h-full" />
        </Link>
        <div className="w-full h-auto flex flex-col gap-10 ">
          <div className="w-full flex flex-row flex-wrap justify-center gap-5">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="w-1/3 h-60 border p-5 border-black rounded-lg flex items-center justify-center"
              >
                <input
                  type="file"
                  accept="image/*"
                  className="text-xs h-full w-full"
                  onChange={(e) => handleImageChange(index, e.target.files[0])}
                />
              </div>
            ))}
          </div>

          <div className="w-full h-auto  flex flex-col  rounded-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Vehicle Name */}
              <input
                type="text"
                name="name"
                value={vehicleData.name}
                onChange={handleChange}
                placeholder="Vehicle Name"
                required
                className="border p-2 rounded"
              />

              {/* Plate Number */}
              <input
                type="text"
                name="plateNumber"
                value={vehicleData.plateNumber}
                onChange={handleChange}
                placeholder="Vehicle Plate Number"
                required
                className="border p-2 rounded"
              />

              {/* Model */}
              <input
                type="text"
                name="model"
                value={vehicleData.model}
                onChange={handleChange}
                placeholder="Vehicle Model"
                required
                className="border p-2 rounded"
              />

              {/* Fuel Type */}
              <select
                name="fuelType"
                value={vehicleData.fuelType}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Unleaded">Unleaded</option>
                <option value="Electric">Electric</option>
              </select>

              {/* Price Per Day */}
              <input
                type="number"
                name="pricePerDay"
                value={vehicleData.pricePerDay}
                onChange={handleChange}
                placeholder="Price Per Day"
                required
                className="border p-2 rounded"
              />

              {/* Location */}
              <input
                type="text"
                name="location"
                value={vehicleData.location}
                onChange={handleChange}
                placeholder="Location"
                required
                className="border p-2 rounded"
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#141414] text-white p-2 rounded hover:bg-[#E60000]"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListingScreen;
