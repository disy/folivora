import LoginForm from "./LoginForm.jsx";
import React from "react";
import ReactDOM from "react-dom";


function init() {
   let code = window.location.hash.replace(/^#/, '');
   let Stamp = JSON.parse(localStorage.getItem("Stamp"));
   let role;

   if (Stamp) {
      let timestamp = Stamp.timestamp;
      let interval = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - timestamp < interval && Date.now() > timestamp) {
         role = Stamp.role;
      } else {
         localStorage.removeItem("Stamp");
      }
   }

   let connectionPromise;
   //<LoginForm />
   if (!role && !code) {

      ReactDOM.render(
          <h1>Hello World</h1>,
         document.getElementById("root")
      );
   } else {

   }
}

init();
