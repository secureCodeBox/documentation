import React, { useState } from "react";

const FlipCard = () => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
    </div>
  );
};
export default FlipCard;
