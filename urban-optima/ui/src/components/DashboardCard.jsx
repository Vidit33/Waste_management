// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import classNames from 'classnames';

// export default function DashboardCard({ title, description, icon, onClick, className }) {
//   return (
//     <div
//       onClick={onClick}
//       className={classNames(
//         'cursor-pointer backdrop-blur-md bg-white/10 border border-purple-300 shadow-xl',
//         'rounded-2xl p-5 flex flex-col items-center justify-center text-white hover:scale-105 transition-transform duration-300 ease-in-out',
//         'hover:shadow-purple-500/30 hover:border-purple-400',
//         className
//       )}
//     >
//       <FontAwesomeIcon icon={icon} size="3x" className="text-purple-300 mb-4 drop-shadow-lg" />
//       <h3 className="text-lg md:text-xl font-semibold mb-2 text-center">{title}</h3>
//       <p className="text-sm text-purple-100 text-center px-2">{description}</p>
//     </div>
//   );
// }


import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

export default function DashboardCard({ title, description, icon, onClick, className }) {
  return (
    <div
      onClick={onClick}
      role="button"
      className={classNames(
        'cursor-pointer bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 ease-in-out',
        'p-6 flex flex-col justify-center items-center text-center hover:-translate-y-1',
        className
      )}
    >
      <FontAwesomeIcon icon={icon} size="2x" className="text-purple-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  );
}
