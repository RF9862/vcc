import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import ErrorPage from "./ErrorPage";
import { AdminRoute, ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/admin";
import FeeManagement from "./pages/admin/fee-management";
import OrderManagement from "./pages/admin/order-management";
import UserManagement from "./pages/admin/user-management";
import CardList from "./pages/card-list";
import ForgotPassword from "./pages/forgot-password";
import Home from "./pages/home";
import MoneyManagement from "./pages/money-management";
import Order from "./pages/order";
import ResetPassword from "./pages/reset-password";

export default createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "card",
        element: <CardList />,
      },
      {
        path: "wallet",
        element: <MoneyManagement />,
      },
      {
        path: "order",
        element: <Order />,
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <Admin />
          </AdminRoute>
        ),
        children: [
          {
            path: "fee-management",
            element: <FeeManagement />,
          },
          {
            path: "user-management",
            element: <UserManagement />,
          },
          {
            path: "order-management",
            element: <OrderManagement />,
          },
        ],
      },
    ],
  },
]);
