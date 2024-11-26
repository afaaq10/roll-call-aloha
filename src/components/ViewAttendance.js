/**
 * 
 * @author: Afaaq Majeed
 * 
 * @project: Roll-Call Aloha
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { fetchStudents } from '../firebase';

const ViewAttendance = () => {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const studentsData = await fetchStudents();
            setStudents(studentsData);
        };
        fetchData();
    }, []);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filterAttendanceByDate = (attendance) => {
        if (Array.isArray(attendance)) {
            if (selectedDate) {
                const formattedSelectedDate = format(new Date(selectedDate), 'yyyy-MM-dd');
                return attendance.filter(record => {
                    const recordDate = safeFormatDate(record.date);
                    if (!recordDate) {
                        return false;
                    }
                    console.log('Selected Date:', formattedSelectedDate);
                    console.log('Record Date:', recordDate);
                    return recordDate === formattedSelectedDate;
                });
            }
            return attendance;
        }
        return [];
    };


    const safeFormatDate = (dateString) => {
        if (typeof dateString === 'number') {
            const date = new Date(dateString);
            return isValid(date) ? format(date, 'yyyy-MM-dd') : null;
        } else if (typeof dateString === 'string') {
            const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
            return isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd') : null;
        }
        return null;
    };

    return (
        <div className="p-6">
            <Link to="/" className="flex items-center mb-4 text-lg text-blue-600">
                <ArrowLeft size={20} className="mr-2" />Home
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
                                                {filteredAttendance.map((record, index) => {
                                                    const formattedDate = safeFormatDate(record.date);

                                                    if (!formattedDate) {
                                                        return (
                                                            <li key={index} className="text-red-500">Invalid date</li>
                                                        );
                                                    }

                                                    return (
                                                        <li key={index} className="flex items-center justify-between py-1">
                                                            <span className="text-gray-600">
                                                                {format(new Date(formattedDate), 'dd MMM yyyy')}:
                                                            </span>
                                                            <span
                                                                className={`inline-block px-4 py-1 rounded-full text-white ${record.status === 'present' ? 'bg-green-500' : 'bg-red-500'
                                                                    }`}
                                                            >
                                                                {record.status === 'present' ? 'Present' : 'Absent'}
                                                            </span>
                                                        </li>
                                                    );
                                                })}
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
