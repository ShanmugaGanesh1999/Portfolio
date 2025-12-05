import React from "react";
import { motion } from "framer-motion";
import ResumeCard from "./ResumeCard";

const Experience = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      className="w-full flex flex-col lgl:flex-row gap-10 lgl:gap-20"
    >
      <div>
        <div className="py-6 lgl:py-12 font-titleFont flex flex-col gap-4">
          <p className="text-sm text-designColor tracking-[4px]">HOBBIES</p>
          <h2 className="text-3xl md:text-4xl font-bold">My Interests</h2>
        </div>
        <div className="mt-6 lgl:mt-14 w-full h-auto border-l-[6px] border-l-black border-opacity-30 flex flex-col gap-10">
          <ResumeCard
            title="Gym"
            subTitle="Fitness enthusiast since 2014"
            result="Intermediate"
            des={[
              "Passionate about maintaining a healthy lifestyle through regular gym workouts.",
              "Focus on strength training and cardio exercises for overall fitness improvement.",
            ]}
          />
          <ResumeCard
            title="Cooking"
            subTitle="Experimenting with flavors since 2022"
            result="Intermediate"
            des={[
              "Enjoy trying new recipes and creating fusion dishes.",
              "Host dinner parties to showcase culinary skills.",
            ]}
          />
          <ResumeCard
            title="Movies & TV Shows"
            subTitle="Avid watcher since childhood"
            result="Enthusiast"
            des={[
              "Fan of spy, crime, and horror movies with thrilling plots and unexpected twists.",
              "Enjoy binge-watching series like Game of Thrones, Vikings, Friends, and Stranger Things.",
              "Anime enthusiast, with Naruto as all-time favorite.",
              "Love discussing and analyzing storylines, characters, and themes in shows and movies.",
            ]}
          />
          <ResumeCard
            title="Outdoor Adventures"
            subTitle="Exploring the places since 2019"
            result="Enthusiast"
            des={[
              "Passionate about hiking, camping, and cycling.",
              "Love exploring new destinations, from local trails to international landmarks.",
              "Travelling is a big part of life, experiencing diverse cultures and landscapes.",
              "Enjoy riding motorcycles and bicycles for a unique perspective on journeys.",
            ]}
          />
        </div>
      </div>
      <div>
        <div className="py-6 lgl:py-12 font-titleFont flex flex-col gap-4">
          <p className="text-sm text-designColor tracking-[4px]">LANGUAGES</p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Communication Skills
          </h2>
        </div>
        <div className="mt-6 lgl:mt-14 w-full h-[1000px] border-l-[6px] border-l-black border-opacity-30 flex flex-col gap-10">
          <ResumeCard
            title="English"
            subTitle="Fluent"
            result="Professional"
            des={[
              "Professional-level proficiency in English.",
              "Learning since age 7, used extensively in professional, academic, and personal life.",
            ]}
          />
          <ResumeCard
            title="Tamil"
            subTitle="Native"
            result="Native"
            des={[
              "Tamil is my mother tongue.",
              "Fluent in speaking and writing, engage in Tamil literature and cultural activities.",
            ]}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Experience;
