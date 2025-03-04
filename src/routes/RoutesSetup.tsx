import { Routes, Route } from "react-router-dom";
import Layout from "../Layout/index.tsx";
import Home from "../home.tsx";
import React from "react";
import Product_list from "../pages/product/product_list.js";
import Product_detail from "../pages/product/product_detail.js";
import Product_search from "../pages/product/product_search.js";
import Login from "../pages/login/login.tsx";
import Join1 from "../pages/join/join1.tsx";
import Join2 from "../pages/join/join2.js";
import Join3 from "../pages/join/join3.js";
import Join4 from "../pages/join/join4.js";
import NotFound from "../pages/NotFound.jsx";
import Id_find from "../pages/find/id_find.js";
import Pw_find from "../pages/find/pw_find.js";
import Change1 from "../pages/user/change1.js";
import Change2 from "../pages/user/change2.js";
import Basket from "../pages/user/basket.js";
import Buy from "../pages/buy/buy.js";
import Order from "../pages/user/order.js";
import Buy_complete from "../pages/buy/buy_complete.js";

export default function RoutesSetup() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product_list" element={<Product_list />} />
        <Route path="/product_detail" element={<Product_detail />} />
        <Route path="/product_search" element={<Product_search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join1" element={<Join1 />} />
        <Route path="/join2" element={<Join2 />} />
        <Route path="/join3" element={<Join3 />} />
        <Route path="/join4" element={<Join4 />} />
        <Route path="/join4" element={<Join4 />} />
        <Route path="/id_find" element={<Id_find />} />
        <Route path="/pw_find" element={<Pw_find />} />
        <Route path="/change1" element={<Change1 />} />
        <Route path="/change2" element={<Change2 />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/buy_complete" element={<Buy_complete />} />
        <Route path="/order" element={<Order />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
