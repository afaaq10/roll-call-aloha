/**
 * 
 * @author Afaaq Majeed
 * @project aloha-roll-call
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';

const Navbar = ({ toggleMenu, menuOpen, setMenuOpen, modalRef }) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Student Attendance Management</h1>
            <button onClick={toggleMenu} className="text-xl">
                <MoreHorizontal />
            </button>
            {menuOpen && (
                <div ref={modalRef} className="absolute p-2 mt-2 bg-white border rounded shadow-md right-4">
                    <Link to="/take-attendance" className="block px-4 py-2" onClick={() => setMenuOpen(false)}>
                        Take Attendance
                    </Link>
                    <Link to="/view-attendance" className="block px-4 py-2" onClick={() => setMenuOpen(false)}>
                        View Attendance
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Navbar;
