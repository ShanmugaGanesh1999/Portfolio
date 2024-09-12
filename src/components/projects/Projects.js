import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import Title from "../layouts/Title";
import ProjectsCard from "./ProjectsCard";

import { projectTwo } from "../../assets/index";

import astarImage from "../../assets/images/projects/astar.png";
import sudokuImage from "../../assets/images/projects/sudoku.png";
import ticTacToeImage from "../../assets/images/projects/tic.png";
import imageStegImage from "../../assets/images/projects/imgsteg.png";
import vcImage from "../../assets/images/projects/vc.png";
import gitcraftImage from "../../assets/images/projects/gitcraft.png";
import hmsImage from "../../assets/images/projects/hms.png";
import lmsImage from "../../assets/images/projects/lms.png";
import rmsImage from "../../assets/images/projects/rms.png";
import melodyMapperImage from "../../assets/images/projects/melodymapper.png";

const Projects = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const projectsPerPage = 6;

  const allProjects = [
    {
      title: "Intersection",
      secondaryTitle: "Intercollegiate Competition Management System",
      des: "Real-time system for mapping, scheduling, and grading student presentations in intercollegiate competitions.",
      src: projectTwo,
      githubLink: "https://github.com/lokeshvelayudham/intersection",
    },
    {
      title: "GitCraft",
      secondaryTitle: "A Craft Posting Application",
      des: "A craft posting application where users can share, fork, and improve crafts. Features a comment section for feedback and collaborative improvement.",
      src: gitcraftImage,
      githubLink: "https://github.com/ShanmugaGanesh1999/GitCraftAPI",
    },
    {
      title: "Attendance & Leave Management System",
      secondaryTitle: "Employee Time Monitoring",
      des: "GPS-based attendance tracking and streamlined leave management for efficient employee time monitoring.",
      src: lmsImage,
      githubLink: "https://github.com/ShanmugaGanesh1999",
    },
    {
      title: "HIMS",
      secondaryTitle: "Hospital Management System",
      des: "Small-scale hospital tool managing doctors, appointments, and patient prescriptions for efficient healthcare administration.",
      src: hmsImage,
      githubLink:
        "https://github.com/ShanmugaGanesh1999/HospitalRecordManagementSystemAPI",
    },
    {
      title: "Melody Mapper",
      secondaryTitle: "Spotify API-based Recommendation System",
      des: "Spotify API-based recommendation system using transformers, GPU, and parallel learning models for HPDC.",
      src: melodyMapperImage,
      githubLink: "https://github.com/ShanmugaGanesh1999/GitCraftAPI",
    },
    {
      title: "RMS",
      secondaryTitle: "Recruiting Management System",
      des: "Advanced RMS boosting recruitment analytics, improving candidate selection efficiency through trend analysis.",
      src: rmsImage,
      githubLink:
        "https://github.com/ShanmugaGanesh1999/RecruitmentManagementSystemAPI",
    },
    {
      title: "Singhal Kshemkalyani Vector Clock",
      secondaryTitle: "Distributed Algorithm Implementation",
      des: "Real-time vector clock algorithm for distributed systems, ensuring causal ordering of events across nodes.",
      src: vcImage,
      githubLink:
        "https://github.com/ShanmugaGanesh1999/DistAlgo---SinghalKshemkalyaniVectorClock",
    },
    {
      title: "Image Steganography",
      secondaryTitle: "Hidden Data in Images - Cryptography",
      des: "Conceals secret messages within digital images, ensuring covert communication and data privacy.",
      src: imageStegImage,
      githubLink:
        "https://github.com/ShanmugaGanesh1999/ImageSteganographyPython",
    },
    {
      title: "Sudoku Solver",
      secondaryTitle: "Backtracking Algorithm in Python",
      des: "Efficient Sudoku puzzle solver using backtracking algorithm, demonstrating problem-solving and algorithmic skills in Python.",
      src: sudokuImage,
      githubLink: "https://github.com/ShanmugaGanesh1999/SudokuSolverPython",
    },
    {
      title: "A* Pathfinder",
      secondaryTitle: "Shortest Path Algorithm with GUI",
      des: "Python GUI implementation of A* algorithm for finding shortest paths with barriers, demonstrating advanced pathfinding techniques.",
      src: astarImage,
      githubLink:
        "https://github.com/ShanmugaGanesh1999/PathFindingAlgorithmVisualizerPython",
    },
    {
      title: "Tic Tac Toe Solver",
      secondaryTitle: "Human vs Computer in Python",
      des: "Python Tic Tac Toe: Play against AI using minimax algorithm.",
      src: ticTacToeImage,
      githubLink: "https://github.com/ShanmugaGanesh1999/TicTacToePython",
    },
  ];

  const totalPages = Math.ceil(allProjects.length / projectsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  const currentProjects = allProjects.slice(
    currentPage * projectsPerPage,
    (currentPage + 1) * projectsPerPage
  );

  return (
    <section
      id="projects"
      className="w-full py-20 border-b-[1px] border-b-black"
    >
      <div className="flex justify-center items-center text-center">
        <Title
          title="VISIT MY PORTFOLIO AND KEEP YOUR FEEDBACK"
          des="My Projects"
        />
      </div>
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-14"
          >
            {currentProjects.map((project, index) => (
              <ProjectsCard
                key={index}
                title={project.title}
                secondaryTitle={project.secondaryTitle}
                des={project.des}
                src={project.src}
                githubLink={project.githubLink}
              />
            ))}
          </motion.div>
        </AnimatePresence>
        <button
          onClick={handlePrevPage}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full text-3xl text-designColor hover:text-gray-300 transition-colors duration-300"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={handleNextPage}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full text-3xl text-designColor hover:text-gray-300 transition-colors duration-300"
        >
          <FaChevronRight />
        </button>
      </div>
      <div className="mt-12 flex justify-center">
        <a
          href="https://github.com/ShanmugaGanesh1999?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-titleFont border border-designColor px-10 py-2 text-designColor hover:bg-designColor hover:text-gray-900 duration-300"
        >
          View All
        </a>
      </div>
    </section>
  );
};

export default Projects;
