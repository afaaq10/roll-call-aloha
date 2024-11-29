// /**
//  * 
//  * @author: Afaaq Majeed
//  * 
//  * @project: Roll-Call Aloha
//  */

// import React from 'react';
// import { Link } from 'react-router-dom';
// import { MoreHorizontal } from 'lucide-react';

// const Navbar = ({ toggleMenu, menuOpen, setMenuOpen, modalRef }) => {
//     return (
//         <div className="relative flex items-center justify-between mb-6">
//             <h1 className="text-2xl font-bold">Aloha Attendance</h1>
//             <button onClick={toggleMenu} className="text-xl">
//                 <MoreHorizontal />
//             </button>
//             {menuOpen && (
//                 <div
//                     ref={modalRef}
//                     className="absolute right-0 p-2 mt-2 bg-white border rounded shadow-md top-8"
//                 >
//                     <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-300 hover:rounded-md" onClick={() => setMenuOpen(false)}>Dashboard</Link>
//                     <Link to="/take-attendance" className="block px-4 py-2 hover:bg-gray-300 hover:rounded-md" onClick={() => setMenuOpen(false)}>
//                         Take Attendance
//                     </Link>
//                     <Link to="/view-attendance" className="block px-4 py-2 hover:bg-gray-300 hover:rounded-md" onClick={() => setMenuOpen(false)}>
//                         View Attendance
//                     </Link>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Navbar;


import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';

const Navbar = ({ toggleMenu, menuOpen, setMenuOpen, selectedProgram }) => {
    // const { selectedProgram } = useParams();  // Access the selected program from the route params
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setMenuOpen]);

    return (
        <div className="relative flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Aloha Attendance</h1>
            <button onClick={toggleMenu} className="text-xl">
                <MoreHorizontal />
            </button>
            {menuOpen && (
                <div
                    ref={modalRef}
                    className="absolute right-0 p-2 mt-2 bg-white border rounded shadow-md top-8"
                >
                    <NavLink
                        to={`/dashboard/${selectedProgram}`} // Include selectedProgram in the URL
                        className="block px-4 py-2 hover:bg-gray-300 hover:rounded-md"
                        activeClassName="bg-gray-200"
                        onClick={() => setMenuOpen(false)}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to={`/take-attendance/${selectedProgram}`} // Include selectedProgram in the URL
                        className="block px-4 py-2 hover:bg-gray-300 hover:rounded-md"
                        activeClassName="bg-gray-200"
                        onClick={() => setMenuOpen(false)}
                    >
                        Take Attendance
                    </NavLink>
                    <NavLink
                        to={`/view-attendance/${selectedProgram}`} // Include selectedProgram in the URL
                        className="block px-4 py-2 hover:bg-gray-300 hover:rounded-md"
                        activeClassName="bg-gray-200"
                        onClick={() => setMenuOpen(false)}
                    >
                        View Attendance
                    </NavLink>
                </div>
            )}
        </div>
    );
};

export default Navbar;
