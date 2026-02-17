import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from "framer-motion";
import bgImg from "../assets/images/bg.jpg"; // Adjust the path as necessary
import { bgweb, i1, i2, i3, bg4, globe } from "../assets/images/index"; // Adjust the path as necessary
import Dashboard from './dashboard';
import CreativeVisuals from "../components/CreativeVisuals.jsx";
import CityscapeBackdrop from "../components/CityScape";

const Home = ({ scrollToSection, refs }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.div
        className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-200 via-indigo-50 to-purple-200 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute top-0 left-5 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-purple-200 via-transparent to-transparent blur-2xl pointer-events-none z-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        />

        <motion.div
          className="flex flex-col justify-center items-center w-full h-screen relative mt-20 z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >

          <motion.div
            className="m-4 md:w-1/2  text-[20px] text-center flex flex-col justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <div className="text-[40px] font-semibold font-Limelight m-2 text-center bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900 text-transparent bg-clip-text  w-80 z-10 text-shadow">
              UrbanOptima
            </div>
            <h1 className="text-[25px] font-semibold mb-4 text-center  bg-gradient-to-r from-slate-700 via-purple-900 to-slate-700 text-transparent bg-clip-text z-10 text-shadow">
              Optimizing Urban Life with AI & Data
            </h1>


          </motion.div>

          <CreativeVisuals />
          <CityscapeBackdrop />

        </motion.div>
      </motion.div>
    </>
  );
};

export default Home;

