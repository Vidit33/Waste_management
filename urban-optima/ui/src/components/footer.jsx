import React, { useState, useEffect } from 'react';
const Footer = () => {
    return(
        <>
        <div className='w-full h-[300px] bg-purple-900 mt-6'>
            <p className="text-2xl text-center text-white m-7 ">Timeline</p>
            <p className="text-lg text-white ml-2">PBL-1(August - December / 2024) : Research, planning and data collection</p>
            <p className="text-lg text-white ml-2">PBL-2(January - May / 2025)     : Layout designing and Model Training</p>
            <p className="text-lg text-white ml-2">PBL-3(August - December / 2025) : Implentation of Model and devop concepts</p>
            <p className="text-lg text-white ml-2">PBL-4(January - May / 2026)     : Testing and deployment</p>
            <p className="text-xl text-center text-white mb-7 ">@copyright.All rights reserved</p>
        </div>
        </>
    );
};
export default Footer