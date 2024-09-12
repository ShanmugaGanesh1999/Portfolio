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
        <div className="mt-6 lgl:mt-14 w-full h-[1000px] border-l-[6px] border-l-black border-opacity-30 flex flex-col gap-10">
          <ResumeCard
            title="Gym"
            subTitle="Fitness enthusiast since 2014"
            result="Intermediate"
            des={[
              "I'm passionate about maintaining a healthy lifestyle through regular gym workouts",
              "I focus on strength training and cardio exercises, and have seen significant improvements in my overall fitness and well-being",
            ]}
          />
          <ResumeCard
            title="Cooking"
            subTitle="Experimenting with flavors since 2022"
            result="Intermediate"
            des={[
              "I enjoy trying out new recipes and creating fusion dishes",
              "I've hosted several dinner parties for friends, showcasing my culinary skills",
            ]}
          />
          <ResumeCard
            title="Movies & TV Shows"
            subTitle="Avid watcher since childhood"
            result="Enthusiast"
            des={[
              "I'm a big fan of spy, crime, and horror movies, always looking for thrilling plots and unexpected twists",
              "I enjoy binge-watching series like Game of Thrones, Vikings, Friends, and Stranger Things",
              "Anime holds a special place in my heart, with Naruto being my all-time favorite I also love Death Note and many other anime series",
              "I'm always eager to discuss and analyze the storylines, characters, and themes in the shows and movies I watch",
            ]}
          />
          <ResumeCard
            title="Outdoor Adventures"
            subTitle="Exploring the places since 2019"
            result="Enthusiast"
            des={[
              "I'm passionate about various outdoor activities, including hiking, camping, and cycling",
              "I love exploring new destinations, from local trails to international landmarks",
              "Travelling is a big part of my life, allowing me to experience diverse cultures and landscapes",
              "I enjoy riding motorcycles and bicycles, which gives me a unique perspective on my journeys",
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
              "I have professional-level proficiency in English",
              "I've been learning English since I was 7 years old and I've been using it extensively in my professional life, academic pursuits, and personal interactions",
            ]}
          />
          <ResumeCard
            title="Tamil"
            subTitle="Native"
            result="Native"
            des={[
              "Tamil is my mother tongue",
              "I'm fluent in both speaking and writing, and I often engage in Tamil literature and cultural activities",
            ]}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Experience;
