import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

import { useLoading } from "../../components/AppProvider";
import Modal from "../../components/Modal";
import axios from "../../config/axios";
import RechargeCardForm from "./RechargeCardForm";

export default function CardSearch() {
  const { setLoading } = useLoading();
  const [statusSelected, setStatusSelected] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardDetail, setSelectedCardDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    handleSearch();
  }, [page, statusSelected, searchQuery]);

  const handleDetailClick = async (card) => {
    try {
      setLoading(true);
      const cardDetailsRes = await axios.get("/card/get-card-details", {
        params: {
          id: card._id,
        },
      });
      setSelectedCardDetail(cardDetailsRes.data);
      setIsDetailModalOpen(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedCard(null);
    setSelectedCardDetail(null);
  };

  const handleTerminateCard = async (card) => {
    try {
      console.log(card);
      const res = await axios.post("/card/terminate-card", {
        id: card._id,
      });
      toast.success(res.data.message);
      handleSearch();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get("/card/get-cards", {
        params: {
          status: statusSelected,
          number: searchQuery,
          page,
        },
      });
      setTotalPages(response.data.totalPages);
      setCards(response.data.docs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRechargeClick = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
    handleSearch(); // Refresh the card list after recharging
  };

  const handlePageClick = ({ selected }) => {
    setPage(selected + 1);
  };

  return (
    <div className="bg-slate-800 shadow p-4 rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-4 text-blue-500">Card List</h3>
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Enter the card number to search"
          className="flex-1 p-2 border rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className={clsx("flex-1 p-2 border rounded-lg", {
            "text-gray-400": statusSelected === "",
            "text-black": statusSelected !== "",
          })}
          value={statusSelected}
          onChange={(e) => setStatusSelected(e.target.value)}
        >
          <option value="" disabled>
            Enter the status
          </option>
          <option value="10" className="text-black">
            Valid
          </option>
          <option value="-20" className="text-black">
            Invalid
          </option>
        </select>
        <button
          className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <table className="w-full mt-4 table-auto text-white">
        <thead>
          <tr>
            <th className="border px-4 py-2">Card Number</th>
            <th className="border px-4 py-2">Organization</th>
            <th className="border px-4 py-2">Balance</th>
            <th className="border px-4 py-2">Expiry Date</th>
            <th className="border px-4 py-2">CVV</th>
            <th className="border px-4 py-2">Remark</th>
            <th className="border px-4 py-2">Card Opening Time</th>
            <th className="border px-4 py-2">State</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {cards.length > 0 ? (
            cards.map((card) => (
              <tr key={card.cardId}>
                <td className="border px-4 py-2 text-center">
                  {card.number.replace(/(\d{4})(?=\d)/g, "$1 ")}
                </td>
                <td className="border px-4 py-2 text-center">
                  {card.organization}
                </td>
                <td className="border px-4 py-2 text-center">
                  {card.cardBalance} USD
                </td>
                <td className="border px-4 py-2 text-center">
                  {card.expiryDate}
                </td>
                <td className="border px-4 py-2 text-center">{card.cvv}</td>
                <td className="border px-4 py-2 text-center">{card.remark}</td>
                <td className="border px-4 py-2 text-center">
                  {moment(card.createTime).format("YYYY-MM-DD HH:mm")}
                </td>
                <td className={"border px-4 py-2 text-center"}>
                  <span
                    className={clsx("px-2 py-1 rounded-lg", {
                      "bg-red-500 text-white": card.state !== 10,
                      "bg-green-500 text-white": card.state === 10,
                    })}
                  >
                    {card.state === 10 ? "Valid" : "Invalid"}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  <div className="flex space-x-2 w-full">
                    <button
                      className="bg-yellow-500 text-white py-1 px-2 rounded-lg shadow-md hover:bg-yellow-600"
                      onClick={() => handleRechargeClick(card)}
                    >
                      Recharge
                    </button>
                    <button
                      className="bg-yellow-500 text-white py-1 px-2 rounded-lg shadow-md hover:bg-yellow-600"
                      onClick={() => handleDetailClick(card)}
                    >
                      Detail
                    </button>
                    {card.state === 10 && (
                      <button
                        className="bg-red-500 text-white py-1 px-2 rounded-lg shadow-md hover:bg-red-600"
                        onClick={() => handleTerminateCard(card)}
                      >
                        Terminate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-4 py-2 text-center" colSpan="8">
                <img
                  src="/img/empty-table.png"
                  alt="No data"
                  className="mx-auto"
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ReactPaginate
        className="pagination mt-8 p-2"
        previousLabel={"<"}
        nextLabel={">"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={totalPages}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />
      {isModalOpen && (
        <Modal title="Recharge card" onClose={handleModalClose}>
          <RechargeCardForm
            onCancel={handleModalClose}
            onSubmit={async (values) => {
              try {
                setLoading(true);
                const res = await axios.post("/card/recharge-credit-card", {
                  ...values,
                  id: selectedCard._id,
                });
                if (res.data.code === 0) {
                  toast.success("The card is recharged successfully!");
                }
                fetchCardStats();
                setLoading(false);
              } catch (err) {
                setLoading(false);
                toast.error(err.response.data.error);
              }
            }}
          />
        </Modal>
      )}
      {isDetailModalOpen && (
        <Modal title="Order Detail" onClose={handleDetailModalClose}>
          <div className="mb-4">
            <div className="text-md">
              <p>
                <strong>Card Number:</strong>{" "}
                {selectedCardDetail.number.replace(/(\d{4})(?=\d)/g, "$1 ")}
              </p>
              <p>
                <strong>Organization:</strong> {selectedCardDetail.organization}
              </p>
              <p>
                <strong>Balance:</strong> ${selectedCardDetail.cardBalance}
              </p>
              <p>
                <strong>Card Opening Time:</strong>{" "}
                {moment(selectedCardDetail.createdAt).format(
                  "YYYY-MM-DD HH:mm"
                )}
              </p>
              <p>
                <strong>Expiry Date:</strong> {selectedCardDetail.expiryDate}
              </p>
              <p>
                <strong>CVV:</strong> {selectedCardDetail.cvv}
              </p>
              <p>
                <strong>Remark:</strong> {selectedCardDetail.remark}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <div className="text-md">
              <p>
                <strong>First Name:</strong>{" "}
                {selectedCardDetail.addressMv.firstName}
              </p>
              <p>
                <strong>Last Name:</strong>{" "}
                {selectedCardDetail.addressMv.lastName}
              </p>
              <p>
                <strong>Address:</strong> {selectedCardDetail.addressMv.address}
              </p>
              <p>
                <strong>City:</strong> {selectedCardDetail.addressMv.city}
              </p>
              <p>
                <strong>Post Code:</strong>{" "}
                {selectedCardDetail.addressMv.postCode}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
