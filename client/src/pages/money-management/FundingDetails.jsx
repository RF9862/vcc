import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ReactPaginate from "react-paginate";

import { useLoading } from "../../components/AppProvider";
import Modal from "../../components/Modal";
import axios from "../../config/axios";

export default function FundingDetails() {
  const { setLoading } = useLoading();
  const [typeSelected, setTypeSelected] = useState("");
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [page, typeSelected, startDate, endDate]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/order/get-orders", {
        params: {
          page,
          type: typeSelected || ["deposit", "withdrawal"],
          startDate,
          endDate,
        },
      });
      setOrders(res.data.docs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageClick = ({ selected }) => {
    setPage(selected + 1);
  };

  const handleDetailClick = async (id) => {
    try {
      setLoading(true);
      const orderDetailsRes = await axios.get("/order/get-order-details", {
        params: {
          orderId: id,
        },
      });
      setSelectedOrderDetail(orderDetailsRes.data);
      setIsDetailModalOpen(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedOrderDetail(null);
  };

  return (
    <div className="bg-slate-800 shadow p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-blue-500">
        Funding details
      </h3>
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
        <select
          className={clsx(`flex-1 p-2 border rounded-lg`, {
            "text-gray-400": typeSelected === "",
            "text-black": typeSelected !== "",
          })}
          value={typeSelected}
          onChange={(e) => setTypeSelected(e.target.value)}
        >
          <option value="" className="text-gray-500" disabled>
            Type
          </option>
          <option value="deposit" className="text-black">
            Deposit
          </option>
          <option value="withdrawal" className="text-black">
            Withdrawal
          </option>
        </select>
        <input
          type="date"
          className="flex-1 p-2 border rounded-lg"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="flex-1 p-2 border rounded-lg"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          className="flex items-center justify-center gap-2 bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600"
          onClick={fetchOrders}
        >
          <FaSearch /> Search
        </button>
      </div>
      <table className="w-full mt-4 table-auto text-white">
        <thead>
          <tr>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Change Amount</th>
            <th className="border px-4 py-2">Balance After Change</th>
            <th className="border px-4 py-2">Created At</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders?.length > 0 ? (
            orders.map(
              ({ type, changeAmount, balAfterChange, createdAt, _id }, idx) => (
                <tr key={`order-${idx}`}>
                  <td className="border px-4 py-2 text-center">{type}</td>
                  <td className="border px-4 py-2 text-center">
                    {changeAmount < 0 ? "-" : ""}$
                    {Math.round(Math.abs(changeAmount) * 100000) / 100000}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    ${balAfterChange}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {moment(createdAt).format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="bg-yellow-500 text-white py-1 px-2 rounded-lg shadow-md hover:bg-yellow-600"
                      onClick={() => handleDetailClick(_id)}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td className="border px-4 py-2 text-center" colSpan="5">
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

      {isDetailModalOpen && (
        <Modal
          title="Order Detail"
          onClose={handleDetailModalClose}
          className="w-8/12"
        >
          <div className="mb-4">
            <div className="text-md">
              <p>
                <strong>Type:</strong>{" "}
                {selectedOrderDetail.transactionDetails.type}
              </p>
              <p>
                <strong>Transaction ID:</strong>{" "}
                <a
                  className="hover:underline hover:text-blue-500"
                  target="_blank"
                  href={`https://tronscan.org/#/transaction/${selectedOrderDetail.transactionDetails.sendTx}`}
                >
                  {selectedOrderDetail.transactionDetails.sendTx}
                </a>
              </p>
              <p>
                <strong>Payment ID:</strong>{" "}
                {selectedOrderDetail.transactionDetails.txnId}
              </p>
              <p>
                <strong>Amount:</strong> $
                {selectedOrderDetail.transactionDetails.amount}
              </p>
              <p>
                <strong>Currency:</strong>
                {selectedOrderDetail.transactionDetails.currency}
              </p>
              <p>
                <strong>Timestamp:</strong>{" "}
                {moment(
                  selectedOrderDetail.transactionDetails.timestamp
                ).format("YYYY-MM-DD HH:mm")}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
