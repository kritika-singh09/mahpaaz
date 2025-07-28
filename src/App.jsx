import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppContextProvider from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import TaskAssign from "./components/TaskAssign";
import CategoryList from "./components/category/CategoryList.jsx";
import RoomList from "./components/room/RoomList";
import LoginPage from "./components/login/LoginPage";
import StaffList from "./components/staff/StaffList";

import BookingForm from "./components/booking/BookingForm";
import Booking from "./components/booking/Booking";
import Reservation from "./components/reservation/Reservation";
import ReservationForm from "./components/reservation/Reservationform";

import Order from "./components/laundary/Order.jsx"
import Inventory from "./components/laundary/Inventory.jsx"
import { useNavigate } from "react-router-dom";
import UpdateBookingForm from "./components/booking/Updateformbooking.jsx";
import Cabbookingform from "./components/cab/cabbookingform.jsx"
import Cab from "./components/cab/cab.jsx";
import Pantry from "./components/Pantry/Pantry.jsx"
const BookingFormPage = () => {
  const navigate = useNavigate();
  return <BookingForm onClose={() => navigate('/booking')} />;
};

import StaffWorkTask from "./components/StaffWorkTask";
// Protected route component

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
const App = () => {
  return (
    <AppContextProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen bg-app-gradient font-sans">
                <Sidebar />
                <div className="flex-1 flex flex-col ml-64">
                  <Header />

                  <main className="flex-1">

                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/tasks" element={<TaskAssign />} />{" "}
                      {/* Make sure this route exists */}
                      <Route path="/category" element={<CategoryList />} />
                      <Route path="/room" element={<RoomList />} />
                      <Route path="/staff" element={<StaffList />} />

 <Route path="/bookingform" element={<BookingFormPage />} />
              <Route path="/booking" element={<Booking />} />
               <Route path="/reservation"element={<Reservation/>}/>
              <Route path="/reservationform"element={<ReservationForm/>}/>
       
           <Route path="/updatebookingform"element={<UpdateBookingForm/>}/>
          <Route path="/laundry/ordermanagement"element={<Order/>}/>
              <Route path="/laundry/inventorymanagement"element={<Inventory/>}/>  
              <Route path="/cab"element={<Cab/>}/>
              <Route path="/cabbookingform"element={<Cabbookingform/>}/>
                  <Route path="/pantry"element={<Pantry/>}/>

                      <Route path="/staff-work" element={<StaffWorkTask />} />
                      {/* Add more routes as needed */}

                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AppContextProvider>
  );
};
export default App;
