import { createBrowserRouter, Navigate } from "react-router-dom";

import Layout from "../components/layout/Layout";

// Store Pages
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import ProductDetails from "../pages/ProductDetails";
import Products from "../pages/Products";
import Wishlist from "../pages/Wishlist";
import OrderConfirmation from "../pages/OrderConfirmation";
import TrackOrder from "../pages/TrackOrder";
import NotFound from "../pages/NotFound";
import CategoriesPage from "../pages/CategoriesPage";
import ReturnPolicy from "../pages/ReturnPolicy";
import ShippingPolicy from "../pages/ShippingPolicy";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Terms from "../pages/Terms";
import About from "../pages/About";
import CustomerTestimonialsPage from "../pages/CustomerTestimonials";

// Admin Pages
import Login from "../admin/Login";
import Dashboard from "../admin/Dashboard";
import AdminProducts from "../admin/Products";
import AdminCategories from "../admin/Categories";
import AdminOrders from "../admin/Orders";
import AdminSettings from "../admin/Settings";
import ProductForm from "../admin/ProductForm";
import OrderDetails from "../admin/OrderDetails";
import Reviews from "../admin/Reviews";
import CustomerTestimonials from "../admin/CustomerTestimonials";

import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "products",
        element: <Products />,
      },

      {
        path: "product/:slug",
        element: <ProductDetails />,
      },

      {
        path: "cart",
        element: <Cart />,
      },

      {
        path: "wishlist",
        element: <Wishlist />,
      },

      {
        path: "checkout",
        element: <Checkout />,
      },

      {
        path: "order-confirmation/:orderNumber",
        element: <OrderConfirmation />,
      },

      {
        path: "track-order",
        element: <TrackOrder />,
      },

      {
        path: "about",
        element: <About />,
      },

      {
        path: "customer-testimonials",
        element: <CustomerTestimonialsPage />,
      },

      {
        path: "categories",
        element: <CategoriesPage />,
      },

      {
        path: "return-policy",
        element: <ReturnPolicy />,
      },

      {
        path: "shipping-policy",
        element: <ShippingPolicy />,
      },

      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },

      {
        path: "terms",
        element: <Terms />,
      },
    ],
  },

  {
    path: "/admin",
    children: [
      {
        path: "login",
        element: <Login />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },

          {
            path: "dashboard",
            element: <Dashboard />,
          },

          {
            path: "products",
            element: <AdminProducts />,
          },

          {
            path: "products/add",
            element: <ProductForm />,
          },

          {
            path: "products/edit/:id",
            element: <ProductForm />,
          },

          {
            path: "categories",
            element: <AdminCategories />,
          },

          {
            path: "orders",
            element: <AdminOrders />,
          },

          {
            path: "orders/:id",
            element: <OrderDetails />,
          },

          {
            path: "reviews",
            element: <Reviews />,
          },

          {
            path: "customer-testimonials",
            element: <CustomerTestimonials />,
          },

          {
            path: "settings",
            element: <AdminSettings />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
