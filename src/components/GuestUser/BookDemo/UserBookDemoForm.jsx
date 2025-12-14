// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import { BASE_API_URL } from "../../../utils/BaseUrl";
// import { toast } from "react-hot-toast";

// // Initial values
// const initialValues = {
//   name: "",
//   email: "",
//   mobile: "",
//   gender: "",
//   // dob: null,
//   dob:'',
//   aboutHelp: "",
//   // partOfOrganization: false,
//   // organizationName: "",
//   // preferredDate: null,         //causes problem in reset
//   preferredDate: '',              //it is correct, even after it is a date field
//   // preferredDay: "",
//   preferredTimeSlot: "",
// };

// const today = new Date();
//   const maxDOB = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
//     .toISOString()
//     .split('T')[0];

//   const minDOB = new Date(
//     today.getFullYear() - 18,
//     today.getMonth(),
//     today.getDate()
//   );

//   const maxPreferredDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+6)
//     .toISOString()
//     .split('T')[0];

//   const minPreferredDate = today.toISOString().split('T')[0]

// // Validation Schema
// const validationSchema = Yup.object().shape({

//   name: Yup.string()
//   .min(3, "Name must be at least 3 characters")
//   .max(50, "Name must be less than 50 characters").matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
//     .required("Name is required."),

//   email: Yup.string()
//     .required("Email is required")
//     .email("Invalid email")
//     .test(
//       "no-spaces",
//       "Email should not contain spaces",
//       (value) => !/\s/.test(value || "")
//     ),

//   mobile: Yup.string()
//     .required("Phone number is Required")
//     .test(
//       "only-digits",
//       "Phone number must contain only digits (0-9)",
//       (value) =>  /^[9876]\d{9}$/.test(value || "")
//     )
//     .test(
//       "exact-length",
//       "Phone number must be exactly 10 digits",
//       (value) => (value || "").length === 10
//     )
//     .test(
//       "starts-with-valid-digit",
//       "Phone number must start with 6, 7, 8, or 9",
//       (value) => /^[6789]/.test(value || "")
//     ),

//   gender: Yup.string()
//     .oneOf(["Male", "Female", "Other"], "Invalid gender")
//     .required("Select gender is required"),

//   dob: Yup.date()
//     .required("Your date of birth is required")
//     .max(minDOB, "You must be at least 18 years old"),

//   aboutHelp: Yup.string()
//   .min(5, "Message must be at least 5 characters")
//   .max(200, "Message must be less than 200 characters")
//     .required("Required, write your query"),

//   // partOfOrganization: Yup.boolean(),

//   // organizationName: Yup.string().when("partOfOrganization", {
//   //   is: true,
//   //   then: (schema) => schema.required("Required, fill organization name"),
//   //   otherwise: (schema) => schema.notRequired(),
//   // }),

// //   preferredDate: Yup.date().nullable(),

//   // preferredDay: Yup.string()
//   //   .oneOf(["Today", "Monday", "Tuesdy", "Wednesday", "Thursday", "Friday"], "Invalid day")
//   //   .required("Required, select any day."),

//   preferredDate: Yup.date()
//     .required("Select any date to get a demo is required.")
//     .min(minPreferredDate, "Date must be today or later.")
//     .max(maxPreferredDate, "You must select a date within the next 7 days."),

// preferredTimeSlot: Yup.string()
//   .oneOf(["Any Time", "10:00 - 12:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 21:00"], "Select from available Time Slots"),

// });

// // Form Component
// const UserBookDemoForm = ({ closeModal }) => {

//   const addBookDemoReq = async (values, { resetForm }) => {
//     try {
//       const response = await axios.post(
//         `${BASE_API_URL}/admin/demo/addDemobyUser`, values
//       );
//       console.log("Book Demo By User Response:", response);

//       if (response?.status === 201) {
//         toast.success(response?.data?.message);
//         resetForm();
//       } 
//       else if (response?.status === 400 || response?.status === 409) {
//         toast(response?.data?.message, {
//           icon: '⚠️',
//         });
//       }
//       else if (response?.status === 500) {
//         toast(response?.data?.message, {
//           icon: '🛑',
//         })
//       }
//     } 
//     catch (error) {
//       console.error("Error submitting data:", error);
      
//       if (error.response) {
//         const { status, data } = error.response;
//         if (status === 400 || status === 409) {
//           toast(data?.message, {
//             icon: '⚠️',
//           });
//         } 
//         else if (status === 500) {
//           toast(data?.message, {
//             icon: '🛑',
//           })
//         } 
//         else {
//           toast.error(data?.message || "Unknown error, please try again.");
//         }
//       } 
//       else {
//         toast.error("An internal server error occurred!");
//       }  
//       throw error; 
//     }
//   };

//   return (
//     <div className="p-0 w-full">
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={addBookDemoReq}
//       >
//         {({ isSubmitting, isValid, values }) => (
//           <Form className="space-y-6">
//           <div className="p-1 max-h-[60vh] overflow-y-auto">
//             <div className="flex flex-col md:flex-row gap-8">
//               <div className="p-2 rounded-xl flex-1 bg-white">
//                 <div className="space-y-6">
//                   {/* Name */}
//                   <FormField
//                     required
//                     label="Name"
//                     name="name"
//                     placeholder="Enter your name"
//                   />

//                   {/* DOB */}
//                   <FormField
//                     required
//                     type="date"
//                     label="Date of Birth"
//                     name="dob"
//                     inputProps={{ max: maxDOB }}
//                   />

//                   {/* Gender */}
//                   <FormField required label="Gender" name="gender" as="select">
//                     <option value="">Select Gender</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </FormField>

//                   {/* About Help */}
//                   <FormField
//                     required
//                     label="How can we help you?"
//                     name="aboutHelp"
//                     placeholder="Describe your query briefly"
//                     as="textarea"
//                   />

//                 </div>
//               </div>
//               <div className="px-4 py-2 rounded-xl flex-1 bg-white">
//                 <div className="space-y-6">

//                   {/* Email */}
//                   <FormField
//                     required
//                     type="email"
//                     label="Email"
//                     name="email"
//                     placeholder="Enter your email"
//                   />
                
//                   {/* Mobile */}
//                   <FormField
//                     required
//                     label="Mobile"
//                     name="mobile"
//                     placeholder="Enter your mobile number"
//                   />

//                   {/* Part of Organization */}
//                   {/* <div className="flex items-center">
//                     <Field
//                       type="checkbox"
//                       name="partOfOrganization"
//                       className="mr-3 w-5 h-5 rounded-lg focus:outline-none focus:ring-0"
//                     />
//                     <label
//                       htmlFor="partOfOrganization"
//                       className="text-sm font-medium text-gray-700"
//                     >
//                       Are you part of an organization?
//                     </label>
//                   </div> */}

//                   {/* Organization Name (Conditional) */}
//                   {/* {values.partOfOrganization && (
//                     <FormField
//                       required
//                       label="Organization Name"
//                       name="organizationName"
//                       placeholder="Enter organization name"
//                     />
//                   )} */}

//                   {/* Preferred Day */}
//                   {/* <FormField
//                     required
//                     label="Preferred Day"
//                     name="preferredDay"
//                     as="select"
//                     placeholder="Enter preferred day"
//                   >
//                     <option value="">Select Preferred Day</option>
//                     <option value="Today">Today</option>
//                     <option value="Monday">Monday</option>
//                     <option value="Tuesday">Tuesday</option>
//                     <option value="Wednesday">Wednesday</option>
//                     <option value="Thursday">Thursday</option>
//                     <option value="Friday">Friday</option>
//                   </FormField> */}

//                   {/* Preferred Date */}
//                   <FormField
//                     required
//                     type="date"
//                     label="Preferred Date"
//                     name="preferredDate"
//                     inputProps={{min: minPreferredDate, max: maxPreferredDate}}
//                   />

//                   {/* Preferred Time Slot */}
//                   <FormField
//                     label="Preferred Time Slot (Optional)"
//                     name="preferredTimeSlot"
//                     placeholder="Enter preferred time slot"
//                     as="select"
//                   >
//                     <option value="">Select Preferred Time Slot</option>
//                     <option value="Any Time">Any Time</option>
//                     <option value="10:00 - 12:00">10:00 - 12:00</option>
//                     <option value="14:00 - 16:00">14:00 - 16:00</option>
//                     <option value="16:00 - 18:00">16:00 - 18:00</option>
//                     <option value="18:00 - 21:00">18:00 - 21:00</option>
//                   </FormField>

//                   {/* Preferred Date */}
//                   {/* <FormField
//                     type="date"
//                     label="Preferred Date (Optional)"
//                     name="preferredDate"
//                   /> */}

//                 </div>
//               </div>
//             </div>
//           </div>

//             {/* Action Buttons */}
//             <div className="flex bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-end items-center pt-3 z-50">
//               <button
//                 type="button"
//                 disabled={isSubmitting}
//                 onClick={closeModal}
//                 className="mr-3 px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting || !isValid}
//                 className="px-6 py-3 rounded-xl bg-lightBlue-600 text-white hover:bg-lightBlue-700 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200 disabled:opacity-50 flex items-center"
//               >
//                 {isSubmitting ? "Saving..." : "Book A Demo"}
//               </button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// // Custom FormField Component
// const FormField = ({ name, label, required = false, type = "text", placeholder, children, as = "input", inputProps = {}, }) => 
//   (
//     <div className="flex flex-col">
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <Field
//         type={type}
//         name={name}
//         {...inputProps}
//         as={as}
//         rows={as === "textarea" ? 4 : undefined}
//         className={`w-full px-4 py-3 !rounded-xl border !border-gray-200 bg-white text-gray-900 focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 focus:outline-none transition-all duration-200 ${
//           as === "textarea" ? "resize-none" : ""
//         }`}
//         placeholder={placeholder}
//       >
//         {children}
//       </Field>
//       <ErrorMessage
//         name={name}
//         component="div"
//         className="text-red-500 text-sm mt-1"
//       />
//     </div>
//   );  

// export default UserBookDemoForm;


import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { BASE_API_URL } from "../../../utils/BaseUrl";
import { toast } from "react-hot-toast";

// Initial values
const initialValues = {
  name: "",
  email: "",
  mobile: "",
  gender: "",
  // dob: null,
  dob:'',
  aboutHelp: "",
  // partOfOrganization: false,
  // organizationName: "",
  // preferredDate: null,         //causes problem in reset
  preferredDate: '',              //it is correct, even after it is a date field
  // preferredDay: "",
  preferredTimeSlot: "",
};

const today = new Date();
  const maxDOB = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0];

  const minDOB = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  const maxPreferredDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+6)
    .toISOString()
    .split('T')[0];

  const minPreferredDate = today.toISOString().split('T')[0]

// Validation Schema
const validationSchema = Yup.object().shape({

  name: Yup.string()
  .min(3, "Name must be at least 3 characters")
  .max(50, "Name must be less than 50 characters").matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .required("Name is required."),

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email")
    .test(
      "no-spaces",
      "Email should not contain spaces",
      (value) => !/\s/.test(value || "")
    ),

  mobile: Yup.string()
    .required("Phone number is Required")
    .test(
      "only-digits",
      "Phone number must contain only digits (0-9)",
      (value) =>  /^[9876]\d{9}$/.test(value || "")
    )
    .test(
      "exact-length",
      "Phone number must be exactly 10 digits",
      (value) => (value || "").length === 10
    )
    .test(
      "starts-with-valid-digit",
      "Phone number must start with 6, 7, 8, or 9",
      (value) => /^[6789]/.test(value || "")
    ),

  gender: Yup.string()
    .oneOf(["Male", "Female", "Other"], "Invalid gender")
    .required("Select gender is required"),

  dob: Yup.date()
    .required("Your date of birth is required")
    .max(minDOB, "You must be at least 18 years old"),

  aboutHelp: Yup.string()
  .min(5, "Message must be at least 5 characters")
  .max(200, "Message must be less than 200 characters")
    .required("Required, write your query"),

  // partOfOrganization: Yup.boolean(),

  // organizationName: Yup.string().when("partOfOrganization", {
  //   is: true,
  //   then: (schema) => schema.required("Required, fill organization name"),
  //   otherwise: (schema) => schema.notRequired(),
  // }),

//   preferredDate: Yup.date().nullable(),

  // preferredDay: Yup.string()
  //   .oneOf(["Today", "Monday", "Tuesdy", "Wednesday", "Thursday", "Friday"], "Invalid day")
  //   .required("Required, select any day."),

  preferredDate: Yup.date()
    .required("Select any date to get a demo is required.")
    .min(minPreferredDate, "Date must be today or later.")
    .max(maxPreferredDate, "You must select a date within the next 7 days."),

preferredTimeSlot: Yup.string()
  .oneOf(["Any Time", "10:00 - 12:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 21:00"], "Select from available Time Slots"),

});

// Form Component
const UserBookDemoForm = ({ closeModal }) => {

  const addBookDemoReq = async (values, { resetForm }) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/admin/demo/addDemobyUser`, values
      );
      console.log("Book Demo By User Response:", response);

      if (response?.status === 201) {
        toast.success(response?.data?.message);
        resetForm();
      } 
      else if (response?.status === 400 || response?.status === 409) {
        toast(response?.data?.message, {
          icon: '⚠️',
        });
      }
      else if (response?.status === 500) {
        toast(response?.data?.message, {
          icon: '🛑',
        })
      }
    } 
    catch (error) {
      console.error("Error submitting data:", error);
      
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 || status === 409) {
          toast(data?.message, {
            icon: '⚠️',
          });
        } 
        else if (status === 500) {
          toast(data?.message, {
            icon: '🛑',
          })
        } 
        else {
          toast.error(data?.message || "Unknown error, please try again.");
        }
      } 
      else {
        toast.error("An internal server error occurred!");
      }  
      throw error; 
    }
  };

  return (
    <div className="p-0 w-full">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={addBookDemoReq}
      >
        {({ isSubmitting, isValid, values }) => (
          <Form className="space-y-6">
          <div className="p-1 max-h-[60vh] overflow-y-auto">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="p-2 rounded-xl flex-1 bg-white">
                <div className="space-y-6">
                  {/* Name */}
                  <FormField
                    required
                    label="Name"
                    name="name"
                    placeholder="Enter your name"
                  />

                  {/* DOB */}
                  <FormField
                    required
                    type="date"
                    label="Date of Birth"
                    name="dob"
                    inputProps={{ max: maxDOB }}
                  />

                  {/* Gender */}
                  <FormField required label="Gender" name="gender" as="select">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </FormField>

                  {/* About Help */}
                  <FormField
                    required
                    label="How can we help you?"
                    name="aboutHelp"
                    placeholder="Describe your query briefly"
                    as="textarea"
                  />

                </div>
              </div>
              <div className="px-4 py-2 rounded-xl flex-1 bg-white">
                <div className="space-y-6">

                  {/* Email */}
                  <FormField
                    required
                    type="email"
                    label="Email"
                    name="email"
                    placeholder="Enter your email"
                  />
                
                  {/* Mobile */}
                  <FormField
                    required
                    label="Mobile"
                    name="mobile"
                    placeholder="Enter your mobile number"
                  />

                  {/* Part of Organization */}
                  {/* <div className="flex items-center">
                    <Field
                      type="checkbox"
                      name="partOfOrganization"
                      className="mr-3 w-5 h-5 rounded-lg focus:outline-none focus:ring-0"
                    />
                    <label
                      htmlFor="partOfOrganization"
                      className="text-sm font-medium text-gray-700"
                    >
                      Are you part of an organization?
                    </label>
                  </div> */}

                  {/* Organization Name (Conditional) */}
                  {/* {values.partOfOrganization && (
                    <FormField
                      required
                      label="Organization Name"
                      name="organizationName"
                      placeholder="Enter organization name"
                    />
                  )} */}

                  {/* Preferred Day */}
                  {/* <FormField
                    required
                    label="Preferred Day"
                    name="preferredDay"
                    as="select"
                    placeholder="Enter preferred day"
                  >
                    <option value="">Select Preferred Day</option>
                    <option value="Today">Today</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </FormField> */}

                  {/* Preferred Date */}
                  <FormField
                    required
                    type="date"
                    label="Preferred Date"
                    name="preferredDate"
                    inputProps={{min: minPreferredDate, max: maxPreferredDate}}
                  />

                  {/* Preferred Time Slot */}
                  <div>

                  <FormField
                    label="Preferred Time Slot (Optional)"
                    name="preferredTimeSlot"
                    placeholder="Enter preferred time slot"
                    as="select"
                  >
                    <option value="">Select Preferred Time Slot</option>
                    <option value="Any Time">Any Time</option>
                    <option value="10:00 - 12:00">10:00 - 12:00</option>
                    <option value="14:00 - 16:00">14:00 - 16:00</option>
                    <option value="16:00 - 18:00">16:00 - 18:00</option>
                    <option value="18:00 - 21:00">18:00 - 21:00</option>
                  </FormField>

                  <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Watch our demo video:</h4>
                      <div className="aspect-w-16 aspect-h-9 w-full">
                        <iframe
                          className="w-full h-48 rounded-lg"
                          src="https://www.youtube.com/embed/mo1WbKnuhwo"
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Learn more about our platform features
                      </p>
                    </div>
                    </div>
                  {/* Preferred Date */}
                  {/* <FormField
                    type="date"
                    label="Preferred Date (Optional)"
                    name="preferredDate"
                  /> */}

                </div>
              </div>
            </div>
          </div>

            {/* Action Buttons */}
            <div className="flex bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-end items-center pt-3 z-50">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={closeModal}
                className="mr-3 px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="px-6 py-3 rounded-xl bg-lightBlue-600 text-white hover:bg-lightBlue-700 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200 disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? "Saving..." : "Book A Demo"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

// Custom FormField Component
const FormField = ({ name, label, required = false, type = "text", placeholder, children, as = "input", inputProps = {}, }) => 
  (
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Field
        type={type}
        name={name}
        {...inputProps}
        as={as}
        rows={as === "textarea" ? 4 : undefined}
        className={`w-full px-4 py-3 !rounded-xl border !border-gray-200 bg-white text-gray-900 focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 focus:outline-none transition-all duration-200 ${
          as === "textarea" ? "resize-none" : ""
        }`}
        placeholder={placeholder}
      >
        {children}
      </Field>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );  

export default UserBookDemoForm;
