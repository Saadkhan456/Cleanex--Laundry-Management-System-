import React, { useState, useEffect } from "react";
import axios from "axios";

const DashboardMaharashtra = () => {
  const username = localStorage.getItem("username") || "Guest";
  const [view, setView] = useState("dashboard");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [price, setPrice] = useState({ basic: 50, delicate: 200, large: 500 });
  const [formData, setFormData] = useState({
    serviceType: "washing",
    clothesType: "cotton",
    pairs: 1,
    pickupDate: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (selectedStatus === "pending") {
      axios
        .get("http://localhost:5000/api/payments/pending/maharashtra")
        .then((response) => {
          setPendingRequests(response.data);
        })
        .catch((error) => {
          console.error("Error fetching pending requests:", error);
        });
    }

    if (selectedStatus === "accepted") {
      axios
        .get("http://localhost:5000/getRequestsByStatus?status=Accepted")
        .then((response) => {
          setAcceptedRequests(response.data);
        })
        .catch((error) => {
          console.error("Error fetching accepted requests:", error);
        });
    }
  }, [selectedStatus]);

  const fetchPaymentInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/payments/${username}`
      );
      setPaymentInfo(response.data);
      setIsPaymentModalOpen(true);
    } catch (error) {
      console.error("Error fetching payment information:", error);
      alert("Failed to fetch payment information.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  const handleViewStatus = (status) => {
    setSelectedStatus(status);
    setView("status");
  };

  const handleShowForm = () => {
    setView("form");
  };

  const handleBackToDashboard = () => {
    setView("dashboard");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "serviceType") {
      updatePrice(value);
    }
  };

  const updatePrice = (serviceType) => {
    let basePrices = { basic: 50, delicate: 200, large: 500 };
    if (serviceType === "ironing") {
      setPrice({
        basic: basePrices.basic - 20,
        delicate: basePrices.delicate - 20,
        large: basePrices.large - 20,
      });
    } else if (serviceType === "washing-ironing") {
      setPrice({
        basic: basePrices.basic + 50,
        delicate: basePrices.delicate + 50,
        large: basePrices.large + 50,
      });
    } else {
      setPrice(basePrices);
    }
  };

  const calculateTotal = () => {
    const { clothesType, pairs } = formData;
    let pricePerUnit = 0;
    if (["cotton", "mixed"].includes(clothesType)) {
      pricePerUnit = price.basic;
    } else if (clothesType === "silk" || clothesType === "woolen") {
      pricePerUnit = price.delicate;
    } else {
      pricePerUnit = price.large;
    }
    return pricePerUnit * formData.pairs;
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePayment = () => {
    const { serviceType, clothesType, pairs, pickupDate } = formData;
    const totalPrice = calculateTotal();
    const username = localStorage.getItem("username") || "Guest";
    const branch = "Karnataka";

    axios
      .post("http://localhost:5000/payment", {
        serviceType,
        clothesType,
        pairs,
        pickupDate,
        totalPrice,
        username,
        branch,
      })
      .then((response) => {
        alert("Payment processed and saved successfully!");
        closeModal();
      })
      .catch((error) => {
        console.error("Error processing payment:", error);
        alert("Error processing payment");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Maharashtra Dashboard</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <button
                onClick={handleBackToDashboard}
                className="w-full text-left block py-2 px-4 rounded hover:bg-gray-700"
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={handleShowForm}
                className="w-full text-left block py-2 px-4 rounded hover:bg-gray-700"
              >
                Laundry Request
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Logout
      </button>

      {view === "dashboard" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Welcome to Maharashtra Dashboard
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            <div
              className="bg-yellow-500 text-white p-6 rounded shadow-lg cursor-pointer"
              onClick={fetchPaymentInfo}
            >
              <h2 className="text-lg font-semibold">My Requests</h2>
              <a href="#" className="block mt-2 text-sm underline">
                View Details
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Payment Information */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsPaymentModalOpen(false)}
          ></div>
          <div className="bg-white rounded-2xl shadow-2xl p-6 z-10 w-full max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Payment Information
            </h2>
            {paymentInfo.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg shadow-sm">
                  <thead className="bg-gray-100 text-gray-800">
                    <tr className="text-left">
                      <th className="py-3 px-4 border-b">Service Type</th>
                      <th className="py-3 px-4 border-b">Clothes Type</th>
                      <th className="py-3 px-4 border-b">Pairs</th>
                      <th className="py-3 px-4 border-b">Pickup Date</th>
                      <th className="py-3 px-4 border-b">Total Price</th>
                      <th className="py-3 px-4 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentInfo.map((payment) => (
                      <tr key={payment._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 border-b">
                          {payment.serviceType}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {payment.clothesType}
                        </td>
                        <td className="py-3 px-4 border-b">{payment.pairs}</td>
                        <td className="py-3 px-4 border-b">
                          {payment.pickupDate}
                        </td>
                        <td className="py-3 px-4 border-b font-semibold text-green-600">
                          ₹ {payment.totalPrice}
                        </td>
                        <td className="py-3 px-4 border-b">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              payment.status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-600">
                No payment information found.
              </p>
            )}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="bg-gray-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-900 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 p-6">
        {view === "form" && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Service Request Form
            </h2>
            <form
              className="bg-white p-6 rounded shadow space-y-4"
              onSubmit={handleProceedToPayment}
            >
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                  value={username} // Display the username
                  readOnly
                />
                <label className="block text-gray-700 font-medium mb-2">
                  Type of Service
                </label>
                <select
                  className="w-full p-2 border rounded"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleFormChange}
                >
                  <option value="washing">Only Washing</option>
                  <option value="ironing">Only Ironing</option>
                  <option value="washing-ironing">Washing + Ironing</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Pick-Up Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  name="pickupDate"
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Number of Pairs
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  name="pairs"
                  value={formData.pairs}
                  onChange={handleFormChange}
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Type of Clothes
                </label>
                <select
                  className="w-full p-2 border rounded"
                  name="clothesType"
                  value={formData.clothesType}
                  onChange={handleFormChange}
                >
                  <option value="cotton">Cotton</option>
                  <option value="woolen">Woolen</option>
                  <option value="silk">Silk</option>
                  <option value="mixed">Mixed Fabric</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Branch
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                  value="Maharashtra"
                  readOnly
                />
              </div>

              <div className="bg-gray-100 p-4 rounded">
                <h3 className="text-lg font-semibold text-gray-800">
                  Estimated Price: ₹ {calculateTotal()}
                </h3>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Proceed to Payment
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleBackToDashboard}
                  className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 mt-4"
                >
                  Back to Dashboard
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Modal for Payment Details */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={closeModal}
            ></div>
            <div className="bg-white rounded-lg shadow-lg p-6 z-10">
              <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
              <p>
                <strong>Username:</strong> {username}
              </p>
              <p>
                <strong>Type of Service:</strong> {formData.serviceType}
              </p>
              <p>
                <strong>Pick-Up Date:</strong> {formData.pickupDate}
              </p>
              <p>
                <strong>Number of Pairs:</strong> {formData.pairs}
              </p>
              <p>
                <strong>Type of Clothes:</strong> {formData.clothesType}
              </p>
              <p>
                <strong>Branch:</strong> Maharashtra
              </p>
              <h3 className="text-lg font-semibold mt-4">
                Estimated Price: ₹ {calculateTotal()}
              </h3>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={handlePayment}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  Pay
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardMaharashtra;
