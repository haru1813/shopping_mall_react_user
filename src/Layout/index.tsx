import React from 'react';
import { Outlet } from "react-router-dom";
import Header from "./Header.js";
import Nav from "./Nav.tsx";
import Footer from "./Footer.tsx";

export default function Layout() {
  return (
    <>
      <Header />
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
}
