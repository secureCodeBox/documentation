import React, { useState } from "react";
import style from "../css/flipCard.module.scss";

const FlipCard = () => {
  const [flipped, setFlipped] = useState(false);
  function flip() {
    setFlipped(!flipped)
  }

  return (
    <div
      onMouseEnter={flip}
      onMouseLeave={flip}
      className={style["card-container"] + (flipped ? style.flipped : "")}
    >
      <div className={style.front}>
        <div className={style["image-container"]}>
          <img
            className={style["card-image"]}
            src="https://78.media.tumblr.com/d98fb931adb117c70f0dbced9e947520/tumblr_pe582mbWip1tlgv32o1_1280.png"
          ></img>
        </div>
        <p className={style.title}>
          Some sample text to demonstrate how these cards will work, including
          how they truncate long sentences.
        </p>
      </div>

      <div className={style.back}>
        <p>
          Some sample text to demonstrate how these cards will work, including
          how they truncate long sentences. This section displays the
          full-length blog post.
        </p>
        <p>
          Bloggity bloggity bloggity blog. This would be the full text of the
          abbreviated blog post.
        </p>
      </div>
    </div>
  );
};
export default FlipCard;
