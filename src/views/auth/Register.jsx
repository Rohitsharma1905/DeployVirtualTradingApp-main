import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import OTPModal from "./OtpModal";
import { BASE_API_URL } from "../../utils/BaseUrl";

const RegisterModal = ({ onClose, onOpenLogin, initialValues }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  useEffect(() => {
    if (initialValues) {
      formik.setValues(initialValues);
    }
  }, [initialValues]);

  const validationSchema = Yup.object({
    name: Yup.string()

  .required("Name is required")
  .min(3, "Name must be at least 3 characters")
  .max(50, "Name must be less than 50 characters").matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .max(15, "Password cannot be more than 15 characters")
      .matches(
        /^(?=.*[A-Za-z])(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/,
        "Password must contain at least one letter and one special character"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    mobile: Yup.string()
      .matches(/^[9876]\d{9}$/ , 'Mobile number must start with 9, 8, 7, or 6 and contain 10 digits')
      .required("Mobile number is required"),
    gender: Yup.string().required("Gender is required"),
    dob: Yup.date()
      .required("Date of birth is required")
      .test("age", "You must be at least 18 years old", (value) => {
        if (!value) return false;
        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const hasBirthdayOccurred =
          today.getMonth() > birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
        return age > 18 || (age === 18 && hasBirthdayOccurred);
      }),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobile: "",
      gender: "",
      dob: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const { confirmPassword, ...userData } = values;
    
      try {
        const url = initialValues
          ? `${BASE_API_URL}/user/users/${initialValues._id}`
          : `${BASE_API_URL}/user/auth/register`;

        const method = initialValues ? "PUT" : "POST";
    
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        const data = await response.json();
    
        // if (!response.ok) {
        //   if (data?.status === "not_verified") {
        //     toast.success("You are already registered but not verified. Sending OTP...");
        //     setUserEmail(userData.email);
        //     setAlreadyRegistered(true);
        //     setShowOtpModal(true);
    
        //     try {
        //       const otpRes = await fetch(`${BASE_API_URL}/user/auth/send-otp`, {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({ email: userData.email }),
        //       });
        //       const otpData = await otpRes.json();
        //       if (otpRes.ok) {
        //         toast.success("OTP resent to your email");
        //       } else {
        //         toast.error(otpData.message || "Failed to resend OTP");
        //       }
        //     } catch (otpErr) {
        //       toast.error("Failed to resend OTP");
        //     }
        //     return;
        //   }
        //   toast.error(data.message || "Something went wrong");
        //   return;
        // }
        if (!response.ok) {
          if (data?.status === "not_verified" && data?.emailAlreadyExists) {
            toast.success("You are already registered but not verified. Sending OTP...");
            setUserEmail(userData.email);
            setAlreadyRegistered(true);
            setShowOtpModal(true);
        
            try {
              const otpRes = await fetch(`${BASE_API_URL}/user/auth/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userData.email }),
              });
              const otpData = await otpRes.json();
              if (otpRes.ok) {
                toast.success("OTP resent to your email");
              } else {
                toast.error(otpData.message || "Failed to resend OTP");
              }
            } catch (otpErr) {
              toast.error("Failed to resend OTP");
            }
            return;
          }
        
          toast.error(data.message || "Something went wrong");
          return;
        }
             

        toast.success(`${initialValues ? "User updated" : "Registration successful!"}`);
    
        if (!initialValues) {
          const otpResponse = await fetch(`${BASE_API_URL}/user/auth/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userData.email }),
          });
    
          const otpResult = await otpResponse.json();
    
          if (otpResponse.ok) {
            toast.success("OTP sent to your email");
            setUserEmail(userData.email);
            setShowOtpModal(true);
          } else {
            toast.error(otpResult.message || "Failed to send OTP");
          }
        } else {
          resetForm();
          setTimeout(() => {
            navigate("/");
            onClose();
          }, 2000);
        }
      } catch (error) {
        console.error("Submit error:", error);
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  return (

    <div className="flex flex-col h-full ">
    
      <form onSubmit={formik.handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 max-h-[350px] overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block ml-1 text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
             placeholder="Enter your name"
            {...formik.getFieldProps("name")}
            className="w-full ml-1 px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-xs">{formik.errors.name}</p>
          )}
        </div>
        
        <div>
          <label className="block ml-1 text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
             placeholder="Enter your email"
            {...formik.getFieldProps("email")}
            className="w-full ml-1  px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-xs">{formik.errors.email}</p>
          )}
        </div>
        
        <div>
          <label className="block ml-1 text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
             placeholder="Create a password"
            {...formik.getFieldProps("password")}
            className="w-full ml-1 px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-xs">{formik.errors.password}</p>
          )}
        </div>
        
        <div>
          <label className="block ml-1 text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            {...formik.getFieldProps("confirmPassword")}
            className="w-full ml-1  px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-xs">{formik.errors.confirmPassword}</p>
          )}
        </div>
        
        <div>
          <label className="block ml-1 text-sm font-medium text-gray-700 mb-1">Mobile</label>
          <input
            type="text"
            name="mobile"
            placeholder="Enter mobile number"
            {...formik.getFieldProps("mobile")}
            className="w-full ml-1  px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
          />
          {formik.touched.mobile && formik.errors.mobile && (
            <p className="text-red-500 text-xs">{formik.errors.mobile}</p>
          )}
        </div>
        
        <div>
          <label className="block ml-1 text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            name="gender"
            {...formik.getFieldProps("gender")}
            className="w-full ml-1  px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {formik.touched.gender && formik.errors.gender && (
            <p className="text-red-500 text-xs">{formik.errors.gender}</p>
          )}

        </div>

        <div className="grid grid-cols-1">
          <div>
            <label className="block ml-1 text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              {...formik.getFieldProps("dob")}
              className="w-full ml-1  px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
            />
            {formik.touched.dob && formik.errors.dob && (
              <p className="text-red-500 text-xs">{formik.errors.dob}</p>
            )}
          </div>
        </div>

        </div>

          {/* Fixed Button Section */}
    <div className="sticky bottom-0 bg-white pt-4 pb-2 mt-4 border-t border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-center px-2">
        <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-0">
          Already have an account?{" "}
          <button
            type="button"
            className="text-lightBlue-600 hover:underline font-medium"
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
          >
            Login here
          </button>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => {
              formik.resetForm();
              onClose();
            }}
            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-lightBlue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-lightBlue-600/20 transition-all text-sm"
          >
            {initialValues ? "Update" : "Register"}
          </button>
        </div>
      </div>
      </div>
        </form>
       
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organization Type</label>
          <input
            type="text"
            name="orgtype"
            {...formik.getFieldProps("orgtype")}
            className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
          />
          {formik.touched.orgtype && formik.errors.orgtype && (
            <p className="text-red-500 text-xs">{formik.errors.orgtype}</p>
          )}
        </div> */}
{/* <div className="sticky bottom-0 bg-white pt-4 pb-2 mt-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center px-2">

          <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-0">
            Already have an account?{" "}
            <button
              type="button"
              className="text-lightBlue-600 hover:underline font-medium"
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
            >
              Login here
            </button>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                formik.resetForm();
                onClose();
              }}
              className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-lightBlue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-lightBlue-600/20 transition-all text-sm"
            >
              {initialValues ? "Update" : "Register"}
            </button>
          </div>
        </div>
        </div> */}
     

      {showOtpModal && (
        <OTPModal
          isOpen={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          email={userEmail}
          onVerified={() => {
            formik.resetForm();
            setTimeout(() => {
              setShowOtpModal(false);
              onClose();
            }, 2000);
          }}
        />
      )}
    
    </div>
  );
};

export default RegisterModal;