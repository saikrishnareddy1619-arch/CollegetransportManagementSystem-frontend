import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./Login";
import Dashboard from "./Dashboard";
import Booking from "./Booking";
import Students from "./Students";
import Buses from "./Buses";
import Drivers from "./Drivers";
import RoutesPage from "./Routes";
import Stops from "./Stops";
import TransportPass from "./TransportPass";
import Complaints from "./Complaints";
import OnlinePayment from "./OnlinePayment";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* MAIN LOGIN PAGE */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* BOOKING */}
        <Route
          path="/booking"
          element={<Booking />}
        />

        {/* STUDENTS */}
        <Route
          path="/students"
          element={<Students />}
        />

        {/* BUSES */}
        <Route
          path="/buses"
          element={<Buses />}
        />

        {/* DRIVERS */}
        <Route
          path="/drivers"
          element={<Drivers />}
        />

        {/* ROUTES */}
        <Route
          path="/routes"
          element={<RoutesPage />}
        />

        {/* STOPS */}
        <Route
          path="/stops"
          element={<Stops />}
        />

        {/* TRANSPORT PASS */}
        <Route
          path="/passes"
          element={<TransportPass />}
        />

        {/* COMPLAINTS */}
        <Route
          path="/complaints"
          element={<Complaints />}
        />

        {/* ONLINE PAYMENT */}
        <Route
          path="/online-payment"
          element={<OnlinePayment />}
        />

        {/* INVALID URL */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;