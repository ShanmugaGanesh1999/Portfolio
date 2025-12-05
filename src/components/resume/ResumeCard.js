import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ResumeCard = ({ title, subTitle, result, des, country }) => {
  const desPages = des;
  const totalPages = desPages.length;
  const [currentPage, setCurrentPage] = useState(1);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev % totalPages) + 1);
  }, [totalPages]);

  const prevPage = () => {
    setCurrentPage((prev) => ((prev - 2 + totalPages) % totalPages) + 1);
  };

  useEffect(() => {
    const interval = setInterval(nextPage, 8000);
    return () => clearInterval(interval);
  }, [nextPage]);

  return (
    <div className="w-full h-auto group flex">
      <div className="w-10 h-[6px] bgOpacity mt-16 relative">
        <span className="absolute w-5 h-5 rounded-full -top-2 -left-3 flex justify-center items-center bg-black bg-opacity-60">
          <span className="w-3 h-3 rounded-full bg-bodyColor inline-flex group-hover:bg-designColor duration-300"></span>
        </span>
      </div>
      <div className="w-full bg-black bg-opacity-20 hover:bg-opacity-30 duration-300 rounded-lg p-4 lgl:px-10 flex flex-col justify-center gap-6 lgl:gap-10 shadow-shadowOne">
        <div className="flex flex-col lgl:flex-row justify-between gap-4 lgl:gap-0 lgl:items-center">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold group-hover:text-white duration-300">
              {title}
            </h3>
            <p className="text-sm mt-2 text-gray-400 group-hover:text-white duration-300">
              {subTitle}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <p className="px-4 py-2 text-designColor bg-black bg-opacity-25 rounded-lg flex justify-center items-center shadow-shadowOne text-sm font-medium">
              {result}
            </p>
            {country && (
              <p className="text-sm mt-2 text-gray-400 group-hover:text-white duration-300">
                {country}
              </p>
            )}
          </div>
        </div>
        <div className="relative overflow-hidden max-w-2xl mx-auto">
          <AnimatePresence initial={false} custom={currentPage} mode="wait">
            <motion.div
              key={currentPage}
              custom={currentPage}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full"
            >
              <p className="text-sm md:text-base font-medium text-gray-400 group-hover:text-gray-300 duration-300">
                {desPages[currentPage - 1]}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={prevPage}
              className="text-designColor hover:text-white duration-300"
              disabled={totalPages === 1}
            >
              <FaChevronLeft />
            </button>
            <span className="text-gray-400">
              {currentPage}/{totalPages}
            </span>
            <button
              onClick={nextPage}
              className="text-designColor hover:text-white duration-300"
              disabled={totalPages === 1}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
