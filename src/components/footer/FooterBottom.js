import React from "react";

const FooterBottom = () => {
  const year = new Date().getFullYear();
  return (
    <div className="w-full py-10">
      <p className="text-center text-gray-500 text-base">
        © {year}. All rights reserved by Shanmuga Ganesh
      </p>
    </div>
  );
};

export default FooterBottom;
