"use client";

import React from "react";
import { motion } from "framer-motion";
import { slideInFromLeft, slideInFromRight, slideInFromTop } from "../../utils/motion";
import { SparklesIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

function HeroContent() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col md:flex-row items-center justify-center px-6 md:px-20 mt-10 md:mt-20 w-full z-[20]"
    >
      {/* Left Section - Text */}
      <div className="h-full w-full flex flex-col gap-5 justify-center m-auto text-center md:text-start">
      <motion.div
        variants={slideInFromTop}
        className="Welcome-box py-[6px] px-[6px] border border-[#7042f88b] opacity-[0.9] 
                  flex items-center justify-center md:justify-start mt-10 md:mt-0"  
      >
        <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
        <h1 className="Welcome-text text-[13px] md:text-[15px]">
          Hi, I&apos;m Janaka Nupehewage - A Passionate Developer
        </h1>
      </motion.div>


        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-4 md:gap-6 mt-4 md:mt-6 text-3xl md:text-6xl font-bold text-white max-w-[600px] w-auto h-auto"
        >
          <span>
            Providing{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
              the best
            </span>{" "}
            project experience
          </span>
        </motion.div>

        <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-base md:text-lg text-gray-400 my-4 md:my-5 max-w-[600px]"
        >
          I&apos;m a developer who focuses on building applications that solve real-world problems.
          With a strong foundation in web development, I create scalable and efficient solutions that
          deliver both functionality and a great user experience. Let&apos;s turn ideas into reality!
        </motion.p>

        <motion.a
          variants={slideInFromLeft(1)}
          className="py-2 px-4 md:px-6 bg-gradient-to-r from-purple-700 to-cyan-600 text-white cursor-pointer rounded-lg max-w-[210px] mx-auto md:mx-0"
        >
          Turn Your Ideas into Reality
        </motion.a>
      </div>

      {/* Right Section - Image (Moves Down on Small Screens) */}
      <motion.div
        variants={slideInFromRight(0.8)}
        className="w-full flex justify-center md:justify-end items-center mt-10 md:mt-0 md:ml-10" // Image moves down on small screens
      >
        <Image
          src="/mainIconsdark.svg"
          alt="work icons"
          height={400}
          width={400}
          className="w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] md:relative md:right-[-20px]" 
        />
      </motion.div>
    </motion.div>
  );
}

export default HeroContent;
