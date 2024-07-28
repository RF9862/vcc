import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";

const KindTips = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-slate-800 shadow p-4 rounded-lg mb-4">
      <div className="flex items-center mb-2">
        <FaHeart className="text-yellow-500" />
        <h3 className="text-yellow-500 text-lg font-semibold ml-2">
          Kind tips
        </h3>
      </div>
      <div className="text-white">
        <p className="font-bold">
          The payment policy of the VCC platform is as follows:
        </p>
        <br />
        <span className="font-bold">Keep Your VCC Account Healthy:</span> Low
        Rejections & Refunds: Aim for less than 15% rejection/refund rate to
        avoid issues.
        <br />
        <span className="font-bold">Don&apos;t Abuse:</span> Play fair! No fake
        rejections or refunds.
        <br />
        <span className="font-bold">Fix Rejections:</span> Unbind rejected cards
        (merchant interface) instead of deleting.
        <br />
        <br />
        {showMore && (
          <>
            <h3 className="font-bold">Avoid These:</h3>
            <br />
            <span className="font-bold">Free Trial Abuse:</span> Don&apos;t
            misuse free trials or zero-cost card opening.
            <br />
            <span className="font-bold">Banned Sites:</span> VCCs can&apos;t be
            used on Steam, Walmart, Uber, Foodpanda.
            <br />
            Unsure? Ask!, Contact support for unclear categories or potential
            bank restrictions.
            <br />
            Platforms may disable categories without notice.
            <br />
            Follow these tips for a smooth VCC experience!
          </>
        )}
      </div>
      <button
        onClick={() => setShowMore(!showMore)}
        className="text-yellow-600 mt-2"
      >
        {showMore ? "LESS" : "MORE"}
      </button>
    </div>
  );
};

export default KindTips;
