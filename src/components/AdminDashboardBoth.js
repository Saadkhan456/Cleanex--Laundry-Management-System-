import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboardBoth = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Fetch users count dynamically
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Fetch laundry requests
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/payments")
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) =>
        console.error("Error fetching laundry requests:", error)
      );
  }, []);

  // Accept laundry request (updates DB & UI)
  const acceptRequest = (id) => {
    if (window.confirm("Are you sure you want to accept this request?")) {
      axios
        .put(`http://localhost:5000/api/payments/${id}`, { status: "Accepted" })
        .then((response) => {
          alert("Request accepted successfully!");

          // Update the request status in the state
          setRequests((prevRequests) =>
            prevRequests.map((req) =>
              req._id === id ? { ...req, status: "Accepted" } : req
            )
          );
        })
        .catch((error) => console.error("Error updating request:", error));
    }
  };

  // Finish laundry request (updates DB & UI)
  const finishRequest = (id) => {
    if (window.confirm("Are you sure you want to finish this request?")) {
      axios
        .put(`http://localhost:5000/api/payments/finish/${id}`)
        .then((response) => {
          alert("Request finished successfully!");

          // Update the request status in the state
          setRequests((prevRequests) =>
            prevRequests.map((req) =>
              req._id === id ? { ...req, status: "Finished" } : req
            )
          );
        })
        .catch((error) => console.error("Error finishing request:", error));
    }
  };

  // Delete user function
  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:5000/api/users/${id}`)
        .then(() => setUsers(users.filter((user) => user._id !== id)))
        .catch((error) => console.error("Error deleting user:", error));
    }
  };

  // Count new, accepted, and finished requests
  const newRequestsCount = requests.filter(
    (req) => req.status === "Pending"
  ).length;
  const acceptedRequestsCount = requests.filter(
    (req) => req.status === "Accepted"
  ).length;
  const finishedRequestsCount = requests.filter(
    (req) => req.status === "Finished"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gray-800 text-white py-4 px-6 text-lg font-bold">
        Laundry Management System
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-1/4 bg-gray-900 text-white p-6">
          <nav className="space-y-4">
            {[
              "dashboard",
              "registeredUsers",
              "laundryRequests",
              "acceptedRequests",
              "finishedRequests",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`block py-2 px-4 rounded hover:bg-gray-700 ${
                  activeTab === tab ? "bg-gray-700" : ""
                }`}
              >
                {tab === "dashboard" && "Dashboard"}
                {tab === "registeredUsers" && "Registered Users"}
                {tab === "laundryRequests" &&
                  `Pending Requests (${newRequestsCount})`}
                {tab === "acceptedRequests" &&
                  `Accepted Requests (${acceptedRequestsCount})`}
                {tab === "finishedRequests" &&
                  `Finished Requests (${finishedRequestsCount})`}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="w-3/4 p-6">
          {activeTab === "dashboard" && (
            <>
              <h1 className="text-2xl font-bold mb-6">Dashboard / Overview</h1>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold">
                    {users.length} Registered Users
                  </h2>
                  <button
                    onClick={() => setActiveTab("registeredUsers")}
                    className="mt-4 underline"
                  >
                    View Details
                  </button>
                </div>
                <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold">
                    New Requests ({newRequestsCount})
                  </h2>
                  <button
                    onClick={() => setActiveTab("laundryRequests")}
                    className="mt-4 underline"
                  >
                    View Details
                  </button>
                </div>
                <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold">
                    Accepted Requests ({acceptedRequestsCount})
                  </h2>
                  <button
                    onClick={() => setActiveTab("acceptedRequests")}
                    className="mt-4 underline"
                  >
                    View Details
                  </button>
                </div>
                <div className="bg-purple-600 text-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold">
                    Finished Requests ({finishedRequestsCount})
                  </h2>
                  <button
                    onClick={() => setActiveTab("finishedRequests")}
                    className="mt-4 underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "registeredUsers" && (
            <>
              <h1 className="text-2xl font-bold mb-6">Registered Users</h1>
              <table className="w-full bg-white rounded-lg shadow-md">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Branch</th>
                    <th className="px-4 py-2">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="border-t px-4 py-2">{user.name}</td>
                      <td className="border-t px-4 py-2">{user.email}</td>
                      <td className="border-t px-4 py-2">{user.branch}</td>
                      <td className="border-t px-4 py-2">
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {["laundryRequests", "acceptedRequests", "finishedRequests"].includes(
            activeTab
          ) && (
            <>
              <h1 className="text-2xl font-bold mb-6">
                {activeTab === "laundryRequests"
                  ? "Pending Requests"
                  : activeTab === "acceptedRequests"
                  ? "Accepted Requests"
                  : "Finished Requests"}
              </h1>
              <table className="w-full bg-white rounded-lg shadow-md">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Service</th>
                    <th className="px-4 py-2">Clothes</th>
                    <th className="px-4 py-2">Pickup Date</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Branch</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests
                    .filter(
                      (req) =>
                        req.status ===
                        (activeTab === "laundryRequests"
                          ? "Pending"
                          : activeTab === "acceptedRequests"
                          ? "Accepted"
                          : "Finished")
                    )
                    .map((req) => (
                      <tr key={req._id}>
                        <td className="border-t px-4 py-2">
                          {req.serviceType}
                        </td>
                        <td className="border-t px-4 py-2">
                          {req.clothesType}
                        </td>
                        <td className="border-t px-4 py-2">{req.pickupDate}</td>
                        <td className="border-t px-4 py-2">{req.totalPrice}</td>
                        <td className="border-t px-4 py-2">{req.username}</td>
                        <td className="border-t px-4 py-2">{req.branch}</td>
                        <td className="border-t px-4 py-2">{req.status}</td>
                        <td className="border-t px-4 py-2">
                          {req.status === "Pending" ? (
                            <button
                              onClick={() => acceptRequest(req._id)}
                              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                            >
                              Accept
                            </button>
                          ) : req.status === "Accepted" ? (
                            <button
                              onClick={() => finishRequest(req._id)}
                              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                            >
                              Finish
                            </button>
                          ) : (
                            <span className="text-green-600">Finished</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardBoth;
