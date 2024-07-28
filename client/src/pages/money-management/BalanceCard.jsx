import React, { useState } from "react";
import { toast } from "react-toastify";

import { useAuth, useLoading } from "../../components/AppProvider";
import Modal from "../../components/Modal";
import axios from "../../config/axios";
import TopUpForm from "./TopUpForm";
import WithdrawalForm from "./WithdrawalForm";

export default function BalanceCard() {
  const { setLoading } = useLoading();
  const { user } = useAuth();
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [transaction, setTransaction] = useState();

  console.log({ transaction });

  return (
    <div className="bg-slate-800 text-white shadow p-4 rounded-lg mb-4 flex items-center justify-between">
      <div>
        <img
          src="/img/us_flag.svg"
          alt="US Flag"
          className="w-10 h-10 inline-block mr-2 rounded-full border-4"
        />
        <div className="inline-block align-middle">
          <p className="text-xl font-semibold">{user.balance} USD</p>
          <p className="text-gray-500">Dollar</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600"
          onClick={() => setShowTopUpModal(true)}
        >
          Top up
        </button>
        <button
          className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600"
          onClick={() => setShowWithdrawalModal(true)}
        >
          Withdrawal
        </button>
      </div>
      {showTopUpModal && (
        <Modal title="USD Top Up" onClose={() => setShowTopUpModal(false)}>
          <TopUpForm
            onCancel={() => setShowTopUpModal(false)}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                const res = await axios.post("/coinpayments/top-up", values);
                setTransaction(res.data);
                setIsCompleted(true);
              } catch (err) {
                toast.error(err.response.data.error);
              }
              setLoading(false);
            }}
          />
        </Modal>
      )}

      {showWithdrawalModal && (
        <Modal
          title="USDT Withdrawal"
          onClose={() => setShowWithdrawalModal(false)}
        >
          <WithdrawalForm
            onCancel={() => setShowWithdrawalModal(false)}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                const res = await axios.post(
                  "/coinpayments/withdrawal",
                  values
                );

                toast.success(
                  `You requested withdrawal successfully! Requested_ID: ${res.data.id} It takes some time. Please wait...`
                );
              } catch (err) {
                toast.error(err.response.data.error);
              }
              setLoading(false);
            }}
          />
        </Modal>
      )}

      {isCompleted && (
        <Modal
          title="USD Top Up"
          onClose={() => {
            setShowTopUpModal(false);
            setIsCompleted(false);
          }}
          className={"!w-8/12"}
        >
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="space-y-4">
                <p>
                  1. Only <span className="font-bold">USDT (TRC20)</span>{" "}
                  transfers are accepted. Transfers in non-USDT (TRC20) will not
                  be received, resulting in capital loss.
                </p>
                <p>
                  2. Deposit fee: 10≤X≤5000USDT, the fee is{" "}
                  <span className="font-bold">0.5%</span>; X &gt; 500, the fee
                  is <span className="font-bold">0.3%</span>. After the transfer
                  is successful, the fee will be deducted and credited to your
                  account balance.
                </p>
                <p>
                  3. The minimum recharge amount is 10. The system will not
                  process the amount below 10. The system will automatically
                  credit the amount after the recharge reaches 10.
                </p>
                <p>
                  4. The system will automatically confirm the receipt, which
                  takes about <span className="font-bold">10 minutes</span>. If
                  the funds are not credited to your account after 30 minutes,
                  please contact our online customer service for inquiries.
                </p>
                <p>
                  5. Please{" "}
                  <span className="font-bold">
                    check the transfer address carefully
                  </span>
                  . If the transfer address is incorrect due to tampering of the
                  clipboard content, our company will not be responsible for any
                  losses.
                </p>
                <p className="font-bold">
                  Please send the following amount to the given address to
                  complete the balance recharge. This recharge will add{" "}
                  {transaction?.amount ?? 0} USDT to the balance
                </p>
              </div>
              <img
                src={transaction?.qrcode_url}
                alt="coinpayments_qrcode_img"
              />
            </div>
            <p className="flex items-center space-x-2">
              <span className="font-bold">Payment amount (click to copy):</span>
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() =>
                  navigator.clipboard.writeText(`${transaction?.amount ?? 0}`)
                }
              >
                {transaction?.amount ?? 0}
              </span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="font-bold">
                Payment address (click to copy):
              </span>
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() =>
                  navigator.clipboard.writeText(transaction?.address ?? "")
                }
              >
                {transaction?.address ?? ""}
              </span>
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
