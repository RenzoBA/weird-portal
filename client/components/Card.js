import React from "react";

const Card = ({ greeting: { timestamp, address, message } }) => {
  return (
    <div className="p-8 bg-[#DA4453] rounded-2xl">
      <p className="text-gray-300 text-sm text-right">
        {timestamp.toUTCString()}
      </p>
      <hr className="my-2" />
      <p className="card-subtitle">Address:</p>
      <h3 className="card-data">{address}</h3>
      <p className="card-subtitle">Message:</p>
      <h3 className="card-data font-normal">{message}</h3>
    </div>
  );
};

export default Card;
