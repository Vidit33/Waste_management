// CircularLayout.jsx

import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faFlag, faEye, faGears } from '@fortawesome/free-solid-svg-icons';

const CircularLayout = () => {
  return (
    <div className="relative py-20">
      <div className="container mx-auto">
        <h2 className="text-center text-3xl font-bold text-purple-800">
          Driving the Future of <span className="text-green-500 font-merienda">Sustainable Cities</span>
        </h2>
        <div className="mt-12 flex flex-col md:flex-row justify-between">
          <div className="skew-y-6 text-center border-1 border-purple-500 py-5 px-3 md:w-1/3 w-full shadow-md bg-gradient-to-r to-purple-200  from-purple-50">
            <div className="-skew-y-6">
              <FontAwesomeIcon
                icon={faBullseye}
                size="3x"
                className="text-purple-700"
              />
              <h3 className="mt-4 text-xl font-semibold">Our Aim</h3>
              <div className="text-lg opacity-80 text-justify p-2">
              To leverage AI and data-driven insights for optimizing urban sustainability, improving resource efficiency, and enhancing city living.
              </div>
            </div>
          </div>
          <div className="-skew-y-6 text-center border-1 border-purple-500 py-5 px-3 md:w-1/3 w-full shadow-md bg-gradient-to-r to-purple-50  from-purple-200">
            <div className="skew-y-6">
              <FontAwesomeIcon
                icon={faFlag}
                size="3x"
                className="text-purple-700"
              />
              <h3 className="mt-4 text-xl font-semibold">Our Mission</h3>
              <div className="text-lg opacity-80 text-justify">
              To provide an AI-powered platform that predicts environmental trends, optimizes resource usage, and offers actionable solutions for smarter, greener cities.
              </div>
            </div>
          </div>
          <div className="skew-y-6 text-center border-1 border-purple-600 py-5 px-3 md:w-1/3 w-full shadow-md bg-gradient-to-r to-purple-200  from-purple-50">
            <div className="-skew-y-6">
              <FontAwesomeIcon
                icon={faEye}
                size="3x"
                className="text-purple-700"
              />
              <h3 className="mt-4 text-xl font-semibold">Our Vision</h3>
              <div className="text-lg opacity-80 text-justify">
              To create a future where cities operate sustainably, efficiently, and intelligently, ensuring a healthier environment and improved quality of life for all.
              </div>
            </div>
          </div>
          <div className="-skew-y-6 text-center border-1 border-purple-500 py-5 px-3 md:w-1/3 w-full shadow-md bg-gradient-to-r to-purple-50  from-purple-200">
            <div className="skew-y-6">
              <FontAwesomeIcon
                icon={faGears}
                size="3x"
                className="text-purple-700"
              />
              <h3 className="mt-4 text-xl font-semibold"> Our Approach</h3>
              <div className="text-lg opacity-80 text-justify">
              We combine advanced data analytics, predictive modeling, and real-time urban monitoring to deliver practical AI solutions that transform city systems and decision-making
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-16 bg-purple-100 mt-5">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-purple-800">Why We <span className="text-green-500 font-merienda">Care</span></h2>
          <div className="mt-4 text-lg text-[#3E3E3E]">
          Our goal is to enhance urban sustainability by leveraging AI-driven insights, enabling smarter resource management, reducing environmental impact, and improving city living.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularLayout;
