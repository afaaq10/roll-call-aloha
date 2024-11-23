/**
 * 
 * @author: Afaaq Majeed
 * 
 * @project: Roll-Call Aloha
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';

const Navbar = ({ toggleMenu, menuOpen, setMenuOpen, modalRef }) => {
    return (
        <div className="relative flex items-center justify-between mb-6"> {/* Added relative positioning here */}
            <h1 className="text-2xl font-bold">Roll Call Aloha</h1>
            <button onClick={toggleMenu} className="text-xl">
                <MoreHorizontal />
            </button>
            {menuOpen && (
                <div
                    ref={modalRef}
                    className="absolute right-0 p-2 mt-2 bg-white border rounded shadow-md top-8" // Adjusted right and top properties
                >
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
