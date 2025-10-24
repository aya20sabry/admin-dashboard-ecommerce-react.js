import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
import { motion } from "framer-motion";

// ✅ IMPORTANT: تأكد من default export في كل الصفحات
const Login = lazy(() => import("../pages/login/login"));
const Overview = lazy(() => import("../pages/Overview/Overview"));
const Categories = lazy(() => import("../pages/Categories/Categories"));
const Subcategories = lazy(() => import("../pages/Subcategories/Subcategories"));

// ✅ تأكد من أن الملفات دي exported صح
// const Bag = lazy(() => import("../pages/Product/Bag"));
const Jacket = lazy(() => import("../pages/Product/Jacket"));
const Sneakers = lazy(() => import("../pages/Product/Sneakers"));
const TShirt = lazy(() => import("../pages/Product/TShirt"));

const SalesReport = lazy(() => import("../pages/Reports/SalesReport"));
const Users = lazy(() => import("../pages/Users/Users"));
const Settings = lazy(() => import("../pages/Settings/Settings"));
const Transaction = lazy(() => import("../pages/Transaction/Transaction"));
const Seller = lazy(() => import("../pages/seller/seller"));

// ✅ إضافة ProductList
const ProductList = lazy(() => import("../pages/Product/productlist"));

const LoadingScreen = () => (
  <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
    <motion.div
      className="w-20 h-20 border-4 border-transparent border-t-blue-500 border-l-purple-500 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
    />
    <motion.h2
      className="mt-8 text-2xl font-semibold"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0.7, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      Loading...
    </motion.h2>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
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
        
        {/* ✅ صفحة المنتجات الجديدة */}
        <Route
          path="/products"
          element={
            <ProtectedRoute allowedRoles={["admin", "seller"]}>
              <Layout>
                <ProductList />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/product/allproduct"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Layout>
                <ProductList />
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

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

