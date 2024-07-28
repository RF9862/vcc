import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth, useLoading } from "./components/AppProvider";
import LoginForm from "./components/LoginForm";
import Modal from "./components/Modal";
import RegisterForm from "./components/RegisterForm";
import axios from "./config/axios";
import CreditCard from "./icons/CreditCard";
import Network from "./icons/Network";
import Security from "./icons/Security";

const listData = [
  {
    title: "One-stop card solution",
    description:
      "Whether you are an individual or a business, we provide intelligent global payment solutions",
    icon: <CreditCard width={45} height={45} />,
  },
  {
    title: "Multi-scenario application",
    description:
      "Meet your consumption needs for business travel, shopping, applications, games, advertising, etc.",
    icon: <Network width={45} height={45} />,
  },
  {
    title: "Safety is the lifeline",
    description: "Use SSL to protect your data security",
    icon: <Security width={45} height={45} />,
  },
];

export default function App() {
  const [showRegister, setShowRegister] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  const signup = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post(`/auth/signup`, values);
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return isAuthenticated ? (
    <Navigate to="/dashboard/home" />
  ) : (
    <>
      <Helmet>
        <title>Home</title>
        <meta
          name="description"
          content="Visa Mastercard virtual card development platform, veteran virtual card service provider, 7*24 hours fully self-service backend for recharge, card issuance, card binding, and card cancellation operations. Multi-currency settlement, used for overseas e-commerce shopping, service subscriptions, and advertising payments."
        />
      </Helmet>
      <div className="bg-gray-50 p-4 h-full">
        <div className="w-full h-full bg-white flex flex-col lg:flex-row justify-around">
          <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold mb-4">
              HQVCC: Your Secure Virtual Card Solution
            </h2>
            <h3 className="text-2xl mb-4 text-center">
              Global Virtual Card Issuance for Businesses and Individuals
            </h3>
            <p className="mb-4 text-xl">
              HQVCC offers a global virtual card service in partnership with
              international card issuers. We provide both Visa and Mastercard
              virtual cards that can be applied for online and linked to your
              multi-currency account. This empowers you to make secure and
              convenient online purchases across a wide range of platforms – all
              in multiple currencies.
              <br />
              <br />
              Benefits:
              <br />
              <br />
              Instant Issuance: Use your virtual card immediately after
              application.
              <br />
              Real-Time Payments: Enjoy seamless and fast transactions anywhere
              in the world.
              <br />
              Enhanced Security: SSL encryption safeguards your data for peace
              of mind.
              <br />
              Multiple Use Cases: Perfect for business travel, online shopping,
              subscriptions, entertainment, advertising, and more.
              <br />
              <br />
              One-Stop Solution for All Your Global Payment Needs
              <br />
              <br />
              Whether you're an individual or a business, HQVCC provides
              intelligent and secure virtual card solutions to simplify your
              international transactions.
              <br />
              Experience the Convenience and Security of HQVCC Virtual Cards
              Today!
            </p>
            <div className="space-y-4">
              {listData.map(({ title, description, icon }, idx) => (
                <div
                  key={`list-item-${idx}`}
                  className="flex items-center space-x-3"
                >
                  {icon}
                  <div>
                    <h4 className="text-lg font-bold">{title}</h4>
                    <p className="text-gray-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/2 bg-gray-100 p-8 flex flex-col justify-center">
            <div className="flex justify-center">
              <img src="/img/logo.png" alt="Side panel logo" width={200} />
            </div>
            <h3 className="text-xl font-bold mb-4">Log into your account</h3>
            <LoginForm
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await login(values.email, values.password);
                  navigate("/dashboard/home");
                } catch (err) {
                  console.error(err);
                }
                setLoading(false);
              }}
            />
            <p className="mt-4 text-center">
              <button
                className="text-cyan-400 font-bold text-sm"
                onClick={() => setShowRegister(true)}
              >
                Sign up now
              </button>
            </p>
          </div>
        </div>
        {showRegister && (
          <Modal title="Register" onClose={() => setShowRegister(false)}>
            <RegisterForm
              onCancel={() => setShowRegister(false)}
              onSubmit={(values) => {
                signup(values);
              }}
            />
          </Modal>
        )}
      </div>
    </>
  );
}
