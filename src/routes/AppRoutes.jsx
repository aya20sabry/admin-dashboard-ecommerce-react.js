import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../components/layout/Layout";

// Pages
import Overview from "../pages/Overview/Overview";
import Bag from "../pages/Product/Bag";
import Jacket from "../pages/Product/Jacket";
import Sneakers from "../pages/Product/Sneakers";
import TShirt from "../pages/Product/TShirt";
import SalesReport from "../pages/Reports/SalesReport";
import Users from "../pages/Users/Users";
import Settings from "../pages/Settings/Settings";
import Transaction from "../pages/Transaction/Transaction";



const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Overview />
          </Layout>
        }
      />

      <Route
        path="/users"
        element={
          <Layout>
            <Users />
          </Layout>
        }
      />

      <Route
        path="/settings"
        element={
          <Layout>
            <Settings />
          </Layout>
        }
      />
        <Route
        path="/product/bag"
        element={
          <Layout>
            <Bag />
          </Layout>
        }
      />  <Route
      path="/product/tshirt"
      element={
        <Layout>
          <TShirt />
        </Layout>
      }
    />  <Route
    path="/product/jacket"
    element={
      <Layout>
        <Jacket />
      </Layout>
    }
  /> 
   <Route
  path="/product/sneakers"
  element={
    <Layout>
      <Sneakers />
    </Layout>
  }
/>
<Route
  path="/sales-report"
  element={
    <Layout>
      <SalesReport />
    </Layout>
  }
/>  
 <Route
  path="/transaction"
  element={
    <Layout>
      <Transaction />
    </Layout>
  }
/>

      {/* أي Route مش موجود يرجع للصفحة الرئيسية */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
