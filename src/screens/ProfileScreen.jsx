import React from "react";
import Menu from "../components/General/Menu";
import Profile from "../components/Profile/Profile";

const ProfileScreen = () => {
  const ViewData = "Profile";

  return (
    <div className="w-full flex flex-col h-auto">
      <div className="flex flex-row">
        <Menu ViewData={ViewData} />
        <Profile />
      </div>
    </div>
  );
};

export default ProfileScreen;
