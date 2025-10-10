import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login/login";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";

// Admin Pages
import Overview from "../pages/Overview/Overview";
import Categories from "../pages/Categories/Categories";
import Subcategories from "../pages/Subcategories/Subcategories";
import Bag from "../pages/Product/Bag";
import Jacket from "../pages/Product/Jacket";
import Sneakers from "../pages/Product/Sneakers";
import TShirt from "../pages/Product/TShirt";
import SalesReport from "../pages/Reports/SalesReport";
import Users from "../pages/Users/Users";
import Settings from "../pages/Settings/Settings";
import Transaction from "../pages/Transaction/Transaction";

// Seller Page
import Seller from "../pages/seller/seller";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <Overview />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <Users />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <Categories />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/subcategories"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <Subcategories />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/bag"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <Bag />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/tshirt"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <TShirt />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/jacket"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <Jacket />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/sneakers"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <Sneakers />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales-report"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <SalesReport />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transaction"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <Transaction />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Seller Dashboard */}
      <Route
        path="/seller"
        element={
          <ProtectedRoute allowedRoles={["seller"]}>
            <Layout>
              <Seller />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Any undefined path */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
