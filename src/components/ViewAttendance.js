/**
 * 
 * @author: Afaaq Majeed
 * 
 * @project: Roll-Call Aloha
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

const ViewAttendance = ({ students }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filterAttendanceByDate = (attendance) => {
        if (selectedDate) {
            return attendance.filter(record => record.date === selectedDate);
        }
        return attendance;
    };

    return (
        <div className="p-6">
            <Link to="/" className="flex items-center mb-4 text-lg text-blue-600">
                <ArrowLeft size={20} className="mr-2" /> Back to Home
            </Link>

            <h2 className="mb-6 text-2xl font-semibold">View Attendance</h2>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Search size={18} className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by student name"
                        className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Calendar size={18} className="text-gray-500" />
                    <input
                        type="date"
                        className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full bg-white border-collapse rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-4 font-semibold text-left text-gray-600">Name</th>
                            <th className="p-4 font-semibold text-left text-gray-600">Attendance History</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => {
                            const filteredAttendance = filterAttendanceByDate(student.attendance);

                            return (
                                <tr key={student.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">{student.name}</td>
                                    <td className="p-4">
                                        {filteredAttendance.length > 0 ? (
                                            <ul>
                                                {filteredAttendance.map((record, index) => (
                                                    <li key={index} className="flex items-center justify-between py-1">
                                                        <span className="text-gray-600">
                                                            {format(new Date(record.date), 'dd MMM yyyy')}:
                                                        </span>
                                                        <span
                                                            className={`inline-block px-4 py-1 rounded-full text-white ${record.status === 'present' ? 'bg-green-500' : 'bg-red-500'
                                                                }`}
                                                        >
                                                            {record.status === 'present' ? 'Present' : 'Absent'}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>No attendance recorded</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewAttendance;
