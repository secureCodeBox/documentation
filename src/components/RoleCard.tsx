import React from "react";

export default function ({
  imageSrc,
  name,
  role,
}: {
  imageSrc: string;
  name: string;
  role: string;
}) {
  return (
    <div className="card-demo">
      <div className="card" style={{ width: "200px" }}>
        <div className="card__image">
          {/* The image is designed ot be square, hence for the best looking result use square images. */}
          <img
            src={imageSrc}
            alt="Role image"
            style={{ height: "200px", width: "200px", objectFit: "cover" }}
          />
        </div>
        <div className="card__body">
          <h4>{name}</h4>
          <small>{role}</small>
        </div>
      </div>
    </div>
  );
}
