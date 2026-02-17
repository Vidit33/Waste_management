import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faRobot, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';


const fList = [
    {
        id: 1,
        title: "Clear, Visual Results",
        icon: faChartBar,
        disc: "Urban data is presented through clear visuals and color-coded analytics, making it easy to interpret trends and implement effective sustainability solutions.", 
    },
    {
        id: 2,
        title: "AI-Powered Chatbot Assistance",
        icon:  faRobot,
        disc:  "Our AI-powered assistant delivers instant responses, guides users through data insights, and provides actionable recommendations for optimizing urban sustainability.", 
    },
    {
        id: 3,
        title: "Download Reports",
        icon:  faDownload,
        disc:  "Generate downloadable reports with AI-driven insights, empowering city planners and stakeholders to make informed, data-backed sustainability decisions.", 
    },
];

const FeaturePanel = ({ title, icon, disc }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative group rounded-xl shadow-xl p-8 bg-white h-[400px] flex flex-col justify-between overflow-hidden"
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-200 to-purple-500 rounded-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative flex flex-col justify-between items-center text-center p-2 h-full">
                {/* Icon */}
                <div className="h-[70px] w-[70px] flex justify-center items-center mb-2">
                    <FontAwesomeIcon className="text-6xl text-purple-700 group-hover:text-[#3E3E3E] transition-colors duration-300" icon={icon} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-[#3E3E3E] mb-4">{title}</h3>

                {/* Description */}
                <p className="text-sm text-[#201f1f] opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    {disc}
                </p>
            </div>
        </motion.div>
    );
};

export default function Feature() {
    return (
        <div className="px-6 py-10">
            <h1 className="text-6xl text-purple-700 font-semibold mb-6 text-center">Features</h1>
            <div className="flex flex-wrap justify-center items-center gap-6">
                {fList.map((fEle) => (
                    <div key={fEle.id} className="w-full sm:w-1/2 md:w-1/3 xl:w-1/4 p-4">
                        <FeaturePanel 
                            title={fEle.title} 
                            icon={fEle.icon} 
                            disc={fEle.disc} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
