import React from "react";

const Section = ({
  children,
  title,
  subtitle,
  alignment  = "left",
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  alignment?: "center" | "left" | "right";
}) => (
  <>
    <div
      style={{
        textAlign: alignment,
      }}
    >
      <h2>{title}</h2>
      <div>{subtitle}</div>
    </div>
    {children}
  </>
);
export default Section;
