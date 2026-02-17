// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faWind, faCarOn, faPlug, faArrowUpFromWaterPump, faDumpsterFire } from '@fortawesome/free-solid-svg-icons';
// import { air1 } from '../assets/images/index.js';
// import { useNavigate } from 'react-router-dom';
// import { Button } from 'react-bootstrap';
// export default function Dashboard() {
//     const navigate = useNavigate();
//     return (
//         <div>
//             <div>
//                 <h1 className="text-6xl text-[#333333] font-semibold mb-6 text-center">Dashboard</h1>
//                 <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 m-4'>
//                     <div className='w-1/1 h-60 bg-gradient-to-b from-slate-700 to-purple-700 rounded-[15px] border-1 border-[#704886] shadow-lg p-2 font-semibold text-white transition-transform duration-300 hover:scale-105 '>City name, Map(displayed different aspects)</div>
//                     <button 
//                     onClick={() => navigate('/air')}
//                     className='flex flex-col justify-center items-center w-1/1 h-60 bg-gradient-to-b from-slate-700 to-purple-700 rounded-[15px] border-1 border-[#704886] shadow-lg p-2 font-semibold text-white transition-transform duration-300 hover:scale-105 '
//                     >
//                         <h2 className='m-2 font-semibold text-purple-100'>Air Quality</h2>
//                         <FontAwesomeIcon icon={faWind} size='5x' className='m-2 text-purple-500'/>
//                         <h4 className='text-purple-100'>Air Quality Index: 2.61 (Sensitive)</h4>
//                     </button>
//                     <button 
//                     className='w-1/1 h-60 bg-gradient-to-b from-slate-700 to-purple-700 rounded-[15px] border-1 border-[#704886] shadow-lg p-2 font-semibold text-white transition-transform duration-300 hover:scale-105 '>
//                         <h3 className='m-2 font-semibold text-purple-100'>Traffic Congestion Forecasting</h3>
//                         <FontAwesomeIcon icon={faCarOn} size='5x' className='m-2 text-purple-500'/>
//                         <h4>Traffic Density Map & Time-Series Line Chart</h4></button>
//                     <button 
//                     className='w-1/1 h-60 bg-gradient-to-b from-slate-700 to-purple-700 rounded-[15px] border-1 border-[rgb(112,72,134)] shadow-lg p-2 font-semibold text-white transition-transform duration-300 hover:scale-105 '>
//                         <h3 className='m-2 font-semibold text-purple-100'>Energy Usuage</h3>
//                         <FontAwesomeIcon icon={faPlug} size='5x' className='m-2 text-purple-500'/>
//                         <h4>Insights (tacked Area Chart )</h4></button>
//                     <button 
//                     className='w-1/1 h-60 bg-gradient-to-b from-slate-700 to-purple-700 rounded-[15px] border-1 border-[#704886] shadow-lg p-2 font-semibold text-white transition-transform duration-300 hover:scale-105 '>
//                         <h3 className='m-2 font-semibold text-purple-100'>Water Usuage</h3>
//                         <FontAwesomeIcon icon={faArrowUpFromWaterPump} size='5x' className='m-2 text-purple-500'/>
                        
//                         <h4>Water Usage Optimization (Bar Chart )</h4></button>
//                     <button 
//                     className='w-1/1 h-60 bg-gradient-to-b from-slate-700 to-purple-700 rounded-[15px] border-1 border-[#704886] shadow-lg p-2 font-semibold text-white transition-transform duration-300 hover:scale-105 '>
//                         <h4 className='m-2 font-semibold text-purple-100'>WasteWaste Management Optimization</h4>
//                         <FontAwesomeIcon icon={faDumpsterFire} size='5x' className='m-2 text-purple-500'/>
                        
//                         <h4>Pie Chart & Route Optimization Map</h4>
//                         </button>
                    
//                 </div>
//                 <div className='w-1/1 h-60 bg-gradient-to-b from-slate-700 to-purple-700 rounded-[15px] border-1 border-[#704886] shadow-lg p-2 font-semibold text-white m-4 transition-transform duration-300 hover:scale-95 '>Overall</div>
//             </div>
//         </div>
//     );
// };


// import React from 'react';
// import { faWind, faCarOn, faPlug, faArrowUpFromWaterPump, faDumpsterFire } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';
// import DashboardCard from '../components/DashboardCard';

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const cards = [
//     {
//       title: 'City Overview',
//       description: 'Explore your city metrics visually with a dynamic map.',
//       icon: faWind,
//     },
//     {
//       title: 'Air Quality',
//       description: 'Air Quality Index: 2.61 (Sensitive)',
//       icon: faWind,
//       onClick: () => navigate('/air'),
//     },
//     {
//       title: 'Traffic Forecast',
//       description: 'Real-time traffic & prediction charts.',
//       icon: faCarOn,
//     },
//     {
//       title: 'Energy Usage',
//       description: 'Electricity insights via stacked area chart.',
//       icon: faPlug,
//     },
//     {
//       title: 'Water Usage',
//       description: 'Bar chart analysis of water consumption trends.',
//       icon: faArrowUpFromWaterPump,
//     },
//     {
//       title: 'Waste Management',
//       description: 'Pie charts and optimized collection routes.',
//       icon: faDumpsterFire,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] via-[#2c2c54] to-[#1e1e2f] px-6 py-10">
//       <h1 className="text-center text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text mb-12 drop-shadow-lg">
//         Smart City Dashboard
//       </h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
//         {cards.map((card, idx) => (
//           <DashboardCard
//             key={idx}
//             title={card.title}
//             description={card.description}
//             icon={card.icon}
//             onClick={card.onClick}
//           />
//         ))}
//       </div>

//       <div className="max-w-2xl mx-auto mt-12">
//         <DashboardCard
//           title="Overall Summary"
//           description="Get a unified view of all sustainability metrics."
//           icon={faWind}
//           className="hover:scale-100"
//         />
//       </div>
//     </div>
//   );
// }


import React from 'react';
import { motion } from "framer-motion";
import { faWind, faCarOn, faPlug, faArrowUpFromWaterPump, faDumpsterFire } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import SustainablityCard from '../components/SustainablityCard';

export default function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    // {
    //   title: 'City Overview',
    //   description: 'View interactive metrics for your city',
    //   icon: faWind,
    // },
    {
      title: 'Air Quality',
      description: 'AQI',
      icon: faWind,
      onClick: () => navigate('/air'),
    },
    {
      title: 'Traffic Forecast',
      description: 'Real-time traffic data and congestion predictions',
      icon: faCarOn,
      onClick: () => navigate('/traffic'),
    },
    {
      title: 'Energy Usage',
      description: 'Daily energy consumption insights',
      icon: faPlug,
      onClick: () => navigate('/energy'),
    },
    {
      title: 'Water Usage',
      description: 'Water consumption and conservation tips',
      icon: faArrowUpFromWaterPump,
      onClick: () => navigate('/water'),
    },
    {
      title: 'Waste Management',
      description: 'AI-based waste detection & cleaning verification',
      icon: faDumpsterFire,
      onClick: () => navigate('/waste'),
    },
    
  ];
  return (
    <div className="min-h-screen px-4 py-10">
      {/* Heading Animation */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-center text-purple-700 mb-10"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Smart City Dashboard
      </motion.h1>
      <div className='w-full flex justify-center items-center'>
        <div className='flex flex-col lg:flex-row items-start justify-center gap-6 px-4 md:px-8 lg:px-12 w-4/5'>
          <motion.div
            className="w-full lg:w-64"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <SustainablityCard/>
          </motion.div>
          {/* Cards Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
          
            {cards.map((card, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                
                <DashboardCard
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  onClick={card.onClick}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Summary Card */}
      {/* <motion.div
        className="max-w-3xl mx-auto mt-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
      >m;,','
      </motion.div> */}
    </div>
  );
}