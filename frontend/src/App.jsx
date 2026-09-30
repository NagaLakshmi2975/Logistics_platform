import { useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:8080";

function App() {
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [shipments, setShipments] = useState([]);
  const [trackingHistory, setTrackingHistory] = useState([]);

  const [shipmentForm, setShipmentForm] = useState({
    senderName: "",
    receiverName: "",
    pickupAddress: "",
    deliveryAddress: ""
  });

  const [trackingNumber, setTrackingNumber] = useState("");

  const [trackingForm, setTrackingForm] = useState({
    trackingNumber: "",
    status: "PICKED_UP",
    location: ""
  });

  const [statusForm, setStatusForm] = useState({
    trackingNumber: "",
    status: "IN_TRANSIT"
  });

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    clearMessages();

    try {
      const response = await axios.post(
        `${API}/auth/login?username=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(password)}`
      );

      localStorage.setItem("token", response.data);
      setToken(response.data);
      setPage("dashboard");
      setMessage("Login successful.");
    } catch (err) {
      console.error(err);
      setError(
        "Login failed. Check your username and password."
      );
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    clearMessages();

    try {
      await axios.post(
        `${API}/auth/register?username=${encodeURIComponent(
          username
        )}&email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`
      );

      setMessage(
        "Registration successful. You can now login."
      );

      setUsername("");
      setEmail("");
      setPassword("");
      setPage("login");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Registration failed. Username or email may already exist."
      );
    }
  };

  const loadShipments = async () => {
    clearMessages();

    try {
      const response = await axios.get(
        `${API}/shipments`,
        authConfig
      );

      setShipments(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load shipments.");
    }
  };

  const createShipment = async (e) => {
    e.preventDefault();
    clearMessages();

    try {
      const response = await axios.post(
        `${API}/shipments`,
        shipmentForm,
        authConfig
      );

      setMessage(
        `Shipment created successfully. Tracking Number: ${response.data.trackingNumber}`
      );

      setShipmentForm({
        senderName: "",
        receiverName: "",
        pickupAddress: "",
        deliveryAddress: ""
      });

      loadShipments();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Unable to create shipment."
      );
    }
  };

  const loadTracking = async () => {
    clearMessages();

    if (!trackingNumber.trim()) {
      setError("Enter a tracking number.");
      return;
    }

    try {
      const response = await axios.get(
        `${API}/tracking/${trackingNumber.trim()}`,
        authConfig
      );

      setTrackingHistory(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load tracking history.");
    }
  };

  const addTrackingEvent = async (e) => {
    e.preventDefault();
    clearMessages();

    try {
      await axios.post(
        `${API}/tracking`,
        trackingForm,
        authConfig
      );

      setMessage(
        "Tracking event added successfully."
      );

      setTrackingForm({
        trackingNumber: "",
        status: "PICKED_UP",
        location: ""
      });
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Unable to add tracking event."
      );
    }
  };

  const updateStatus = async (e) => {
    e.preventDefault();
    clearMessages();

    try {
      await axios.put(
        `${API}/shipments/${statusForm.trackingNumber}/status?status=${encodeURIComponent(
          statusForm.status
        )}`,
        {},
        authConfig
      );

      setMessage(
        "Shipment status updated successfully."
      );

      setStatusForm({
        trackingNumber: "",
        status: "IN_TRANSIT"
      });

      loadShipments();
    } catch (err) {
      console.error(err);
      setError(
        "Unable to update shipment status."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken("");
    setShipments([]);
    setTrackingHistory([]);

    setUsername("");
    setPassword("");
    setEmail("");

    setPage("login");

    clearMessages();
  };

  if (!token || page === "login") {
    return (
      <div className="app">
        <div className="auth-container">

          <div className="brand">
            <div className="brand-icon">
              📦
            </div>

            <h1>LogiTrack</h1>

            <p>
              Real-Time Logistics & Courier Tracking
            </p>
          </div>

          <div className="card auth-card">

            <h2>Welcome Back</h2>

            <p className="subtitle">
              Login to manage your shipments
            </p>

            {message && (
              <div className="success">
                {message}
              </div>
            )}

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>

              <label>
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="Enter username"
                required
              />

              <label>
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter password"
                required
              />

              <button type="submit">
                Login
              </button>

            </form>

            <p className="switch-text">
              Don't have an account?

              <button
                type="button"
                className="link-button"
                onClick={() => {
                  clearMessages();
                  setPage("register");
                }}
              >
                Register
              </button>
            </p>

          </div>
        </div>
      </div>
    );
  }

  if (page === "register") {
    return (
      <div className="app">
        <div className="auth-container">

          <div className="brand">
            <div className="brand-icon">
              📦
            </div>

            <h1>LogiTrack</h1>

            <p>
              Create your logistics account
            </p>
          </div>

          <div className="card auth-card">

            <h2>Create Account</h2>

            <p className="subtitle">
              Register to start managing shipments
            </p>

            {message && (
              <div className="success">
                {message}
              </div>
            )}

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister}>

              <label>
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="Choose a username"
                required
              />

              <label>
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter email"
                required
              />

              <label>
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Create a password"
                required
              />

              <button type="submit">
                Create Account
              </button>

            </form>

            <p className="switch-text">
              Already have an account?

              <button
                type="button"
                className="link-button"
                onClick={() => {
                  clearMessages();
                  setPage("login");
                }}
              >
                Login
              </button>
            </p>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">

      <header className="navbar">

        <div>
          <h1>
            📦 LogiTrack
          </h1>

          <span>
            Logistics Management Platform
          </span>
        </div>

        <button
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>

      </header>

      <main className="main-content">

        <div className="welcome-section">

          <h2>
            Logistics Dashboard
          </h2>

          <p>
            Manage shipments and monitor real-time
            tracking information.
          </p>

        </div>

        {message && (
          <div className="success">
            {message}
          </div>
        )}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <div className="dashboard-grid">

          {/* CREATE SHIPMENT */}

          <section className="card">

            <h3>
              🚚 Create Shipment
            </h3>

            <form onSubmit={createShipment}>

              <label>
                Sender Name
              </label>

              <input
                value={shipmentForm.senderName}
                onChange={(e) =>
                  setShipmentForm({
                    ...shipmentForm,
                    senderName: e.target.value
                  })
                }
                required
              />

              <label>
                Receiver Name
              </label>

              <input
                value={shipmentForm.receiverName}
                onChange={(e) =>
                  setShipmentForm({
                    ...shipmentForm,
                    receiverName: e.target.value
                  })
                }
                required
              />

              <label>
                Pickup Address
              </label>

              <input
                value={shipmentForm.pickupAddress}
                onChange={(e) =>
                  setShipmentForm({
                    ...shipmentForm,
                    pickupAddress: e.target.value
                  })
                }
                required
              />

              <label>
                Delivery Address
              </label>

              <input
                value={shipmentForm.deliveryAddress}
                onChange={(e) =>
                  setShipmentForm({
                    ...shipmentForm,
                    deliveryAddress: e.target.value
                  })
                }
                required
              />

              <button type="submit">
                Create Shipment
              </button>

            </form>

          </section>

          {/* SHIPMENTS */}

          <section className="card">

            <h3>
              📋 Shipments
            </h3>

            <button onClick={loadShipments}>
              Load Shipments
            </button>

            <div className="shipment-list">

              {shipments.length === 0 ? (

                <p className="empty">
                  No shipments loaded.
                </p>

              ) : (

                shipments.map((shipment) => (

                  <div
                    className="shipment-item"
                    key={shipment.id}
                  >

                    <div>

                      <strong>
                        {shipment.trackingNumber}
                      </strong>

                      <p>
                        {shipment.senderName}
                        {" → "}
                        {shipment.receiverName}
                      </p>

                      <p>
                        {shipment.pickupAddress}
                        {" → "}
                        {shipment.deliveryAddress}
                      </p>

                    </div>

                    <span className="status">
                      {shipment.status}
                    </span>

                  </div>

                ))

              )}

            </div>

          </section>

          {/* UPDATE STATUS */}

          <section className="card">

            <h3>
              🔄 Update Shipment Status
            </h3>

            <form onSubmit={updateStatus}>

              <label>
                Tracking Number
              </label>

              <input
                value={statusForm.trackingNumber}
                onChange={(e) =>
                  setStatusForm({
                    ...statusForm,
                    trackingNumber: e.target.value
                  })
                }
                placeholder="TRK-XXXXXXXX"
                required
              />

              <label>
                Status
              </label>

              <select
                value={statusForm.status}
                onChange={(e) =>
                  setStatusForm({
                    ...statusForm,
                    status: e.target.value
                  })
                }
              >

                <option value="CREATED">
                  CREATED
                </option>

                <option value="PICKED_UP">
                  PICKED_UP
                </option>

                <option value="IN_TRANSIT">
                  IN_TRANSIT
                </option>

                <option value="OUT_FOR_DELIVERY">
                  OUT_FOR_DELIVERY
                </option>

                <option value="DELIVERED">
                  DELIVERED
                </option>

              </select>

              <button type="submit">
                Update Status
              </button>

            </form>

          </section>

          {/* ADD TRACKING EVENT */}

          <section className="card">

            <h3>
              📍 Add Tracking Event
            </h3>

            <form onSubmit={addTrackingEvent}>

              <label>
                Tracking Number
              </label>

              <input
                value={trackingForm.trackingNumber}
                onChange={(e) =>
                  setTrackingForm({
                    ...trackingForm,
                    trackingNumber: e.target.value
                  })
                }
                placeholder="TRK-XXXXXXXX"
                required
              />

              <label>
                Status
              </label>

              <select
                value={trackingForm.status}
                onChange={(e) =>
                  setTrackingForm({
                    ...trackingForm,
                    status: e.target.value
                  })
                }
              >

                <option value="PICKED_UP">
                  PICKED_UP
                </option>

                <option value="IN_TRANSIT">
                  IN_TRANSIT
                </option>

                <option value="OUT_FOR_DELIVERY">
                  OUT_FOR_DELIVERY
                </option>

                <option value="DELIVERED">
                  DELIVERED
                </option>

              </select>

              <label>
                Location
              </label>

              <input
                value={trackingForm.location}
                onChange={(e) =>
                  setTrackingForm({
                    ...trackingForm,
                    location: e.target.value
                  })
                }
                placeholder="Vijayawada Hub"
                required
              />

              <button type="submit">
                Add Tracking Event
              </button>

            </form>

          </section>

          {/* TRACK SHIPMENT */}

          <section className="card tracking-card">

            <h3>
              🔎 Track Shipment
            </h3>

            <div className="tracking-search">

              <input
                value={trackingNumber}
                onChange={(e) =>
                  setTrackingNumber(e.target.value)
                }
                placeholder="Enter tracking number"
              />

              <button onClick={loadTracking}>
                Track
              </button>

            </div>

            <div className="tracking-list">

              {trackingHistory.length === 0 ? (

                <p className="empty">
                  No tracking history loaded.
                </p>

              ) : (

                trackingHistory.map((event) => (

                  <div
                    className="tracking-event"
                    key={event.id}
                  >

                    <div className="event-dot"></div>

                    <div>

                      <strong>
                        {event.status}
                      </strong>

                      <p>
                        {event.location}
                      </p>

                      <small>
                        {new Date(
                          event.timestamp
                        ).toLocaleString()}
                      </small>

                    </div>

                  </div>

                ))

              )}

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default App;