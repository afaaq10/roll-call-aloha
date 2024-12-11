/**
 * 
 * @author: Afaaq Majeed
 * 
 * @project: Roll-Call Aloha
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';

const Navbar = ({ toggleMenu, menuOpen, setMenuOpen, selectedProgram, handleLogout }) => {
    const modalRef = React.useRef();

    React.useEffect(() => {
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
            <h1 className="text-2xl font-bold font-cooper">ALOHA ATTENDANCE</h1>
            <button onClick={toggleMenu} className="text-xl">
                <MoreHorizontal />
            </button>
            {menuOpen && (
                <div
                    ref={modalRef}
                    className="absolute right-0 p-2 mt-2 bg-white border rounded shadow-md top-8"
                >
                    <NavLink
                        to={`/dashboard/${selectedProgram}`}
                        className="block px-4 py-2 hover:bg-gray-300 hover:rounded-md"
                        activeClassName="bg-gray-200"
                        onClick={() => setMenuOpen(false)}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to={`/take-attendance/${selectedProgram}`}
                        className="block px-4 py-2 hover:bg-gray-300 hover:rounded-md"
                        activeClassName="bg-gray-200"
                        onClick={() => setMenuOpen(false)}
                    >
                        Take Attendance
                    </NavLink>
                    <NavLink
                        to={`/view-attendance/${selectedProgram}`}
                        className="block px-4 py-2 hover:bg-gray-300 hover:rounded-md"
                        activeClassName="bg-gray-200"
                        onClick={() => setMenuOpen(false)}
                    >
                        View Attendance
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 mt-2 text-left text-red-600 rounded-md hover:bg-gray-200"
                    >
                        Log Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default Navbar;
