import React from "react";
import SideBar from "./SideBar";
import NavBar from "./NavBar";

const Layout = ({ children }) => (
  <div className="flex flex-col h-screen">
    <NavBar />
    <div className="flex flex-1">
      <SideBar />
      <main className="flex-1 overflow-auto bg-gray-100 p-6">
        {children}
      </main>
    </div>
  </div>
);

export default Layout; 