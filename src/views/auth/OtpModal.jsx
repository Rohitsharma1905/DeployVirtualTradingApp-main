import React, { useState, useEffect , useRef } from "react";
import toast from "react-hot-toast";
import { BASE_API_URL } from "../../utils/BaseUrl";

const OTPModal = ({ isOpen, onClose, email, onVerified }) => {
  if (!isOpen) return null;

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [otpExpired, setOtpExpired] = useState(false);
  const [timer, setTimer] = useState(600); // 600 seconds = 10 minutes
  const timerRef = useRef(null);
  // ⏳ Countdown logic
  const startTimer = () => {
    setTimer(600);
    setOtpExpired(false);
    if (timerRef.current) clearInterval(timerRef.current);
  
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setOtpExpired(true);
          setMessage("OTP expired. Generate a new OTP.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  

  useEffect(() => {
    if (isOpen) {
      startTimer();
    }
    return () => clearInterval(timerRef.current); 
  }, [isOpen]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otpExpired) {
      setMessage("OTP expired. Please generate a new OTP.");
      return;
    }

    setStatus("verifying");
    try {
      const res = await fetch(`${BASE_API_URL}/user/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, enteredOtp: otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ OTP Verified Successfully!");
        setStatus("success");
        onVerified(); // let parent handle close
      } else {
        setMessage(data.message || "Invalid OTP");
        setStatus("error");
      }
    } catch (err) {
      setMessage("Verification failed. Try again.");
      setStatus("error");
    }
  };

  // 🔁 Re-send OTP
  const handleResendOtp = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/user/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("New OTP sent to your email");
       // setOtpExpired(false);
        //setTimer(600);
        setOtp("");
        setMessage("");
        startTimer(); 
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-gray-900 opacity-50" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 z-50 p-6">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-lightBlue-600 rounded-full flex items-center justify-center shadow-lg">
              <i className="fas fa-lock text-white"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">OTP Verification</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg focus:outline-none">
            <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
          </button>
        </div>

        <form onSubmit={handleVerify} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP sent to your email
            </label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={otpExpired}
              className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
            />
          </div>

          <div className="text-sm text-gray-500">Time left: {formatTime(timer)}</div>

          <button
            type="submit"
            disabled={status === "verifying" || otpExpired}
            className="w-full px-4 py-3 rounded-lg bg-lightBlue-600 text-white hover:from-lightBlue-600 hover:to-blue-400 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200 disabled:opacity-50"
          >
            {status === "verifying" ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* 🔔 Show messages */}
        {message && (
          <p
            className={`mt-3 text-sm ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* 🔁 OTP Expired + Resend Link */}
        {otpExpired && (
          <div className="mt-3 text-sm text-lightBlue-600">
            Didn't receive OTP?{" "}
            <button
              onClick={handleResendOtp}
              className="underline hover:text-blue-800 transition-colors focus:outline-none"
            >
              Click here to generate another OTP
            </button>
          </div>
        )}

        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
