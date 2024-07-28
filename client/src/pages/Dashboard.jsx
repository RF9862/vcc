import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FaBars,
  FaCartArrowDown,
  FaExchangeAlt,
  FaFileAlt,
  FaHome,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";
import { MdAttachMoney, MdCreditCard } from "react-icons/md";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth, useLoading } from "../components/AppProvider";
import ChangePasswordForm from "../components/ChangePasswordForm";
import Drawer from "../components/Drawer";
import Dropdown from "../components/Dropdown";
import Modal from "../components/Modal";
import { APP_API } from "../config";
import axios from "../config/axios";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { setLoading } = useLoading();
  const [isOpen, setIsOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const sideNavsData = [
    { href: "/dashboard/home", icon: <FaHome />, text: "Home" },
    { href: "/dashboard/card", icon: <MdCreditCard />, text: "Card List" },
    {
      href: "/dashboard/wallet",
      icon: <MdAttachMoney />,
      text: "Wallet",
    },
    { href: "/dashboard/order", icon: <FaCartArrowDown />, text: "Order" },
    ...(user.privilege === "admin"
      ? [
          {
            icon: <FaCartArrowDown />,
            text: "Admin",
            children: [
              {
                href: "/dashboard/admin/fee-management",
                icon: <FaExchangeAlt />,
                text: "Fee Management",
              },
              {
                href: "/dashboard/admin/user-management",
                icon: <FaUser />,
                text: "User Management",
              },
              {
                href: "/dashboard/admin/order-management",
                icon: <FaShoppingCart />,
                text: "Order Management",
              },
            ],
          },
        ]
      : []),
  ];

  const dropDownItems = [
    {
      text: "Change Password",
      handler: () => {
        setShowChangePassword(true);
      },
    },
    {
      text: "Sign Out",
      handler: logout,
    },
  ];

  const changePassword = async (values) => {
    try {
      setLoading(true);
      const res = await axios.put(`${APP_API}/auth/change-password`, values);
      toast.success(res.data.message);
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Home</title>
        <meta
          name="description"
          content="Visa Mastercard virtual card development platform, veteran virtual card service provider, 7*24 hours fully self-service backend for recharge, card issuance, card binding, and card cancellation operations. Multi-currency settlement, used for overseas e-commerce shopping, service subscriptions, and advertising payments."
        />
      </Helmet>
      <div className={`flex h-screen transition-transform`}>
        <header className="fixed w-full flex justify-between p-4 bg-slate-950">
          <button
            onClick={() => setIsOpen((isOpen) => !isOpen)}
            className="p-2 text-blue-400 rounded"
          >
            <FaBars color="white" />
          </button>
          <Dropdown
            title={user?.email ?? "invalid user"}
            items={dropDownItems}
          />
        </header>
        <Drawer data={sideNavsData} isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="flex-grow p-4 mt-12">
          <main className="p-4">
            <Outlet />
          </main>
        </div>
        {showChangePassword && (
          <Modal
            title="Change Password"
            onClose={() => setShowChangePassword(false)}
          >
            <ChangePasswordForm
              onCancel={() => setShowChangePassword(false)}
              onSubmit={changePassword}
            />
          </Modal>
        )}
      </div>
    </>
  );
}
