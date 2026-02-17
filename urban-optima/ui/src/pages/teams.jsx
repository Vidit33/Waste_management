import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';
// TeamCard Component
const TeamCard = ({ name, role, github, linkedin, bgColor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="max-w-xs w-full bg-gradient-to-b from-white to-purple-300 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-4 flex flex-col items-center">
        {/* Profile Image Placeholder */}
        <div
          className= {`w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 mb-4 bg-gradient-to-br from-purple-500 to-purple-700`}
          
        ></div>

        {/* Name */}
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        {/* Role */}
        <p className="text-sm text-gray-500">{role || "Team Member"}</p>

        {/* Social Icons */}
        <div className="mt-4 flex space-x-4">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800"
            >
              <FaGithub className="text-2xl" />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-700"
            >
              <FaLinkedin className="text-2xl" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Main Team Component
const Team = () => {
  const teamMembers = [
    {
      name: "Dr. Shishir Chauhan",
      role: "Mentor",
      github: "",
      linkedin: "https://www.linkedin.com/in/shishir-chauhan-b888b2129/",
      holder: "SC",
    },
    {
      name: "Oshika Sharma",
      role: "",
      github: "https://github.com/Oshika22",
      linkedin: "https://www.linkedin.com/in/oshika-sharma-a1120529a/",
      holder: "OS",
    },

    {
      name: "Pranjali Yeotikar",
      role: "", 
      github: "https://github.com/pranjali999",
      linkedin: "https://www.linkedin.com/in/pranjali-yeotikar-042ab82a6/",
      holder: "PY",
    },


  ];

  return (
    <div className="flex flex-col">
        <h1 className="text-5xl text-purple-800 font-bold mb-6 text-center m-4">Meet Our <span className="text-green-500 font-merienda">Team</span></h1>
      <div className="flex flex-wrap justify-center gap-6 p-6">
        {teamMembers.map((member, index) => (
          <TeamCard
            key={index}
            name={member.name}
            role={member.role}
            github={member.github}
            instagram={member.instagram}
            linkedin={member.linkedin}
            bgColor={member.bgColor}
          />
        ))}
      </div>
    </div>
  );
};

export default Team;
