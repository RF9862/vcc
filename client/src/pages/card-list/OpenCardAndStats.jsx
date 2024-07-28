import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useLoading } from "../../components/AppProvider";
import Modal from "../../components/Modal";
import axios from "../../config/axios";
import OpenCardForm from "./OpenCardForm";

export default function OpenCardAndStats() {
  const { setLoading } = useLoading();
  const [showOpenNewCard, setShowOpenNewCard] = useState(false);
  const [validCards, setValidCards] = useState(0);
  const [cancelledCards, setCancelledCards] = useState(0);

  const fetchCardStats = async () => {
    const totalRes = await axios.get("/card/get-cards", {
      params: {
        status: 10,
      },
    });
    const validRes = await axios.get("/card/get-cards", {
      params: {
        status: 10,
      },
    });
    const valid = validRes.data.totalDocs;
    const cancelled = totalRes.data.totalDocs - valid;
    setValidCards(valid);
    setCancelledCards(cancelled);
  };

  useEffect(() => {
    fetchCardStats();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-800 p-4 rounded-lg mb-4">
      <button
        className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 mb-4 sm:mb-0"
        onClick={() => setShowOpenNewCard(true)}
      >
        New card
      </button>
      <div className="flex space-x-4">
        <div>
          <span className="block text-xl font-semibold text-yellow-500">
            {validCards}
          </span>
          <span className="text-green-500">Valid card</span>
        </div>
        <div>
          <span className="block text-xl font-semibold text-yellow-500">
            {cancelledCards}
          </span>
          <span className="text-red-500">Expired Card</span>
        </div>
      </div>
      {showOpenNewCard && (
        <Modal title="Open New Card" onClose={() => setShowOpenNewCard(false)}>
          <OpenCardForm
            onCancel={() => setShowOpenNewCard(false)}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                const res = await axios.post("/card/open-card", values);
                if (res.data.code === 0) {
                  toast.success("New card is opened successfully!");
                }
              } catch (err) {
                toast.error(err.response.data.error);
              }
              fetchCardStats();
              setLoading(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
