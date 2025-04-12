import React, { useEffect, useState } from "react";
import Booking from "../components/Booking/Booking";
import Menu from "../components/General/Menu";
import fetchUser from "../hooks/userData";
import Loader from "../components/General/Loader";
import WalletModal from "../components/Wallet/WalletModal";
import { useSession } from "../context/SessionContext";
import { fetchBookedVehiclesWithRenters } from "../hooks/vehicleService";
import ConfirmationOngoingModal from "../components/Booking/ConfirmationOngoingModal";
import ConfirmationCompleteModal from "../components/Booking/ConfirmationCompleteModal";

import {
  markBookingAsCancelled,
  markBookingAsCompleted,
  markBookingAsOngoing,
} from "../hooks/bookingService";

const BookingScreen = () => {
  const ViewData = "Booking";

  const [TopUpModal, setTopUpModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [bookingData, setBookingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const { user } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRequest = await fetchUser(user.uid);
        setUserData(userRequest);

        const bookingRequest = await fetchBookedVehiclesWithRenters(user.uid);
        setBookingData(bookingRequest);

        setIsLoading(false);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user.uid]);

  const handleConfirmClick = (booking) => {
    setSelectedBooking(booking);
    setIsConfirmOpen(true);
  };

  const handleOngoingClick = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCancelClick = async (booking) => {
    setConfirmCancel(true);
    await markBookingAsCancelled(booking.bookingId);

    window.location.reload();
  };

  const handleOngoingBooking = async () => {
    if (!selectedBooking) return;
    setConfirmLoading(true);

    await markBookingAsOngoing(selectedBooking.bookingId);

    setIsModalOpen(false);
    setSelectedBooking(null);

    window.location.reload();
  };

  const handleCompleteBooking = async () => {
    if (!selectedBooking) return;
    setConfirmLoading(true);

    const commissionFee =
      selectedBooking.totalPrice - selectedBooking.totalPrice * 0.9;

    await markBookingAsCompleted(
      selectedBooking.bookingId,
      user.uid,
      commissionFee
    );

    setIsModalOpen(false);
    setSelectedBooking(null);

    window.location.reload();
  };

  if (isLoading) {
    return <Loader ViewData={ViewData} />;
  }

  return (
    <div className="w-full flex flex-col h-auto">
      <div
        className={`flex flex-row ${
          TopUpModal || isModalOpen || isConfirmOpen ? "blur-xs" : ""
        }`}
      >
        <Menu ViewData={ViewData} />
        <Booking
          bookingData={bookingData}
          userData={userData}
          isOpen={TopUpModal}
          setTopUpModal={setTopUpModal}
          handleConfirmClick={handleConfirmClick}
          handleOngoingClick={handleOngoingClick}
          handleCancelClick={handleCancelClick}
          confirmCancel={confirmCancel}
        />
      </div>
      <WalletModal
        user={user}
        userData={userData}
        isOpen={TopUpModal}
        setTopUpModal={setTopUpModal}
      />

      <ConfirmationCompleteModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleCompleteBooking}
        confirmLoading={confirmLoading}
        booking={selectedBooking}
      />

      <ConfirmationOngoingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleOngoingBooking}
        confirmLoading={confirmLoading}
        booking={selectedBooking}
      />
    </div>
  );
};

export default BookingScreen;
