// import React from "react";
// import { Switch, Route, Redirect } from "react-router-dom";

// // components

// import Navbar from "../components/User/Navbars/AuthNavbar";
// import FooterSmall from "../components/User/Footers/FooterSmall.js";

// // views

// import Login from "../views/auth/Login.js";
// import Register from "../views/auth/Register.js";

// export default function Auth() {
//   return (
//     <>
//       <Navbar transparent />
//       <main>
//         <section className="relative w-full h-full py-40 min-h-screen">
//           <div
//             className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
//             style={{
//               backgroundImage:
//                 "url(" + require("assets/img/register_bg_2.png").default + ")",
//             }}
//           ></div>
//           <Switch>
//             <Route path="/auth/login" exact component={Login} />
//             <Route path="/auth/register" exact component={Register} />
//             <Redirect from="/auth" to="/auth/login" />
//           </Switch>
//           <FooterSmall absolute />
//         </section>
//       </main>
//     </>
//   );
// }



import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";


// components
import Navbar from "../components/User/Navbars/AuthNavbar";
import FooterSmall from "../components/User/Footers/FooterSmall";

// views
import Login from "../views/auth/Login";
import Register from "../views/auth/Register";
import ResetPasswordModal from "../views/auth/ResetPasswordModal"; 

export default function Auth() {
  return (
    <>
      <Navbar transparent />
      <main>
        <section className="relative w-full h-full py-40 min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
            style={{
              backgroundImage:
                "url(" + new URL('../assets/img/register_bg_2.png', import.meta.url).href + ")",
            }}
          ></div>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="reset-password" element={<ResetPasswordModal />} />
            <Route path="*" element={<Navigate to="login" replace />} />
          </Routes>
          <FooterSmall absolute />
        </section>
      </main>
    </>
  );
}