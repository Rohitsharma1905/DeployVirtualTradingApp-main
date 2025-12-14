// import React from 'react'
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import { BASE_API_URL } from "../../../utils/BaseUrl";
// import { toast } from 'react-hot-toast';
// import { Listbox, Transition } from '@headlessui/react';
// import { Check, ChevronsUpDown } from 'lucide-react';


// const initialValues = {
//   name: "",
//   website: "",
//   email: "",
//   mobile: "",
//   contactPerson: "",
//   aboutHelp: "",
//   // preferredDate: null,
//   preferredDate: '',
//   // preferredDay: "",
//   preferredTimeSlot: ""
// };

// const today = new Date();
//   const maxPreferredDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+6).toISOString().split('T')[0];
//   const minPreferredDate = today.toISOString().split('T')[0]

// const validationSchema = Yup.object().shape({
//   name: Yup.string()
//   .min(3, "Name must be at least 3 characters")
//   .max(50, "Name must be less than 50 characters").matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
//     .required('Organization name is required'),

//   website: Yup.string()
//     .url('Enter a valid website URL')
//     .required('Website is required'),

//   email: Yup.string()
//     .required("Email is required")
//     .email("Invalid email")
//     .test(
//       "no-spaces",
//       "Email should not contain spaces",
//       (value) => !/\s/.test(value || "")
//     ),

//   mobile: Yup.string()
//     .required("Phone number is required")
//     .test(
//       "only-digits",
//       "Phone number must contain only digits (0-9)",
//       (value) => /^[9876]\d{9}$/.test(value || "")
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

//   contactPerson: Yup.string()
//   .min(3, "Name must be at least 3 characters")
//   .max(50, "Name must be less than 50 characters").matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
//     .notRequired(),

//   aboutHelp: Yup.string()
//   .min(5, "Message must be at least 5 characters")
//     .max(200, "Message must be less than 200 characters")
//     .required('Required, write your query'),

//   // preferredDate: Yup.date()
//   //   .nullable()
//   //   .notRequired(),

//   // preferredDay: Yup.string()
//   //   .oneOf(["Today", "Monday", "Tuesdy", "Wednesday", "Thursday", "Friday"], "Invalid day")
//   //   .required('Select any Preferred Day is Required'),

//   preferredDate: Yup.date()
//     .required("Select any date to get a demo is Required.")
//     .min(minPreferredDate, "Date must be today or later.")
//     .max(maxPreferredDate, "You must select a date within the next 7 days."),

//   preferredTimeSlot: Yup.string()
//     .oneOf(["Any Time", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"], "Select from available Time Slots"),

// });

// const OrgBookDemoForm = ({ closeModal }) => {

//   const addBookDemoReq = async (values, { resetForm }) => {
//     try {
//       const response = await axios.post(
//         `${BASE_API_URL}/admin/demo/addDemobyOrganization`, values
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
//                     label="Organization Name"
//                     name="name"
//                     placeholder="Enter organization name"
//                   />

//                   {/* Website */}
//                   <FormField
//                     required
//                     label="Website URL"
//                     name="website"
//                     placeholder="Enter website URL"
//                   />
                  
//                   {/* Contact Person */}
//                   <FormField
//                     label="Contact Person (Optional)"
//                     name="contactPerson"
//                     placeholder="Enter contact person name"
//                   />

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
//                     <option value="12:00 - 14:00">12:00 - 14:00</option>
//                     <option value="14:00 - 16:00">14:00 - 16:00</option>
//                     <option value="16:00 - 18:00">16:00 - 18:00</option>
//                     <option value="18:00 - 20:00">18:00 - 20:00</option>
//                   </FormField>

//                 </div>
//               </div>

//               <div className="px-4 py-2 rounded-xl flex-1 bg-white">
//                 <div className="space-y-6">

//                   {/* Email */}
//                   <FormField
//                     required
//                     type="email"
//                     label="Organization Email"
//                     name="email"
//                     placeholder="Enter email address"
//                   />

//                   {/* Mobile */}
//                   <FormField
//                     required
//                     label="Official Contact Number"
//                     name="mobile"
//                     placeholder="Enter mobile number "
//                   />

//                   {/* About Help */}
//                   <FormField
//                     required
//                     label="How can we help your Organization?"
//                     name="aboutHelp"
//                     placeholder="Describe your query briefly"
//                     as="textarea"
//                   />

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

// export default OrgBookDemoForm;




import React from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { BASE_API_URL } from "../../../utils/BaseUrl";
import { toast } from 'react-hot-toast';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronsUpDown } from 'lucide-react';


const initialValues = {
  name: "",
  website: "",
  email: "",
  mobile: "",
  contactPerson: "",
  aboutHelp: "",
  preferredDate: '',
  preferredTimeSlot: ""
};

const today = new Date();
  const maxPreferredDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+6).toISOString().split('T')[0];
  const minPreferredDate = today.toISOString().split('T')[0]

const validationSchema = Yup.object().shape({
  name: Yup.string()
  .min(3, "Name must be at least 3 characters")
  .max(50, "Name must be less than 50 characters").matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .required('Organization name is required'),

  website: Yup.string()
    .url('Enter a valid website URL')
    .required('Website is required'),

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email")
    .test(
      "no-spaces",
      "Email should not contain spaces",
      (value) => !/\s/.test(value || "")
    ),

  mobile: Yup.string()
    .required("Phone number is required")
    .test(
      "only-digits",
      "Phone number must contain only digits (0-9)",
      (value) => /^[9876]\d{9}$/.test(value || "")
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

  contactPerson: Yup.string()
  .min(3, "Name must be at least 3 characters")
  .max(50, "Name must be less than 50 characters").matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .notRequired(),

  aboutHelp: Yup.string()
  .min(5, "Message must be at least 5 characters")
    .max(200, "Message must be less than 200 characters")
    .required('Required, write your query'),

  preferredDate: Yup.date()
    .required("Select any date to get a demo is Required.")
    .min(minPreferredDate, "Date must be today or later.")
    .max(maxPreferredDate, "You must select a date within the next 7 days."),

  preferredTimeSlot: Yup.string()
    .oneOf(["Any Time", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"], "Select from available Time Slots"),

});

const OrgBookDemoForm = ({ closeModal }) => {

  const addBookDemoReq = async (values, { resetForm }) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/admin/demo/addDemobyOrganization`, values
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
                    label="Organization Name"
                    name="name"
                    placeholder="Enter organization name"
                  />

                  {/* Website */}
                  <FormField
                    required
                    label="Website URL"
                    name="website"
                    placeholder="Enter website URL"
                  />
                  
                  {/* Contact Person */}
                  <FormField
                    label="Contact Person (Optional)"
                    name="contactPerson"
                    placeholder="Enter contact person name"
                  />

                  {/* Preferred Date */}
                  <FormField
                    required
                    type="date"
                    label="Preferred Date"
                    name="preferredDate"
                    inputProps={{min: minPreferredDate, max: maxPreferredDate}}
                  />

                  {/* Preferred Time Slot */}
                  <FormField
                    label="Preferred Time Slot (Optional)"
                    name="preferredTimeSlot"
                    placeholder="Enter preferred time slot"
                    as="select"
                  >
                    <option value="">Select Preferred Time Slot</option>
                    <option value="Any Time">Any Time</option>
                    <option value="10:00 - 12:00">10:00 - 12:00</option>
                    <option value="12:00 - 14:00">12:00 - 14:00</option>
                    <option value="14:00 - 16:00">14:00 - 16:00</option>
                    <option value="16:00 - 18:00">16:00 - 18:00</option>
                    <option value="18:00 - 20:00">18:00 - 20:00</option>
                  </FormField>

                </div>
              </div>

              <div className="px-4 py-2 rounded-xl flex-1 bg-white">
                <div className="space-y-6">

                  {/* Email */}
                  <FormField
                    required
                    type="email"
                    label="Organization Email"
                    name="email"
                    placeholder="Enter email address"
                  />

                  {/* Mobile */}
                  <FormField
                    required
                    label="Official Contact Number"
                    name="mobile"
                    placeholder="Enter mobile number "
                  />

                  {/* About Help */}
                  <div>
                    <FormField
                      required
                      label="How can we help your Organization?"
                      name="aboutHelp"
                      placeholder="Describe your query briefly"
                      as="textarea"
                    />
                    
                    {/* YouTube Video Embed */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Watch our demo video:</h4>
                      <div className="aspect-w-16 aspect-h-9 w-full">
                        <iframe
                          className="w-full h-48 rounded-lg"
                          src="https://www.youtube.com/embed/6RpPRoJcxuc"
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

export default OrgBookDemoForm;

