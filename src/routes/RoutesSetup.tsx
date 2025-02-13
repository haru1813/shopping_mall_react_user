import { Routes, Route } from "react-router-dom";
import Layout from "../Layout/index.tsx";
import Home from "../home.tsx";
import React from "react";
import Product_list from "../pages/product_list.tsx";

export default function RoutesSetup() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product_list" element={<Product_list />} />
      </Route>
    </Routes>
  );
}
