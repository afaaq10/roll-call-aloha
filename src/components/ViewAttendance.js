/**
 * 
 * @author: Afaaq Majeed
 * 
 * @project: Roll-Call Aloha
 */

import React from 'react';
import { fetchStudents } from '../firebase';
import { Link } from 'react-router-dom';
import { format, parse, isValid } from 'date-fns';
import { Search, Calendar } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import Loading from './Loading';

const ViewAttendance = ({ selectedProgram }) => {
    const [students, setStudents] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState('');
    const [openAccordion, setOpenAccordion] = React.useState(null);
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const studentsData = await fetchStudents(selectedProgram);
            setStudents(studentsData);
            setLoading(false);
        };
        fetchData();
    }, [selectedProgram]);

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

    const toggleAccordion = (studentId) => {
        setOpenAccordion(openAccordion === studentId ? null : studentId);
    };

    return (
        <div className="p-6">
            <Link to="/" className="flex items-center mb-4 text-lg text-blue-600">
                <ArrowLeft size={20} className="mr-2" />
            </Link>

            <h2 className="mb-6 text-2xl font-semibold text-center">View Attendance</h2>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="flex flex-col items-center justify-between mb-6 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                        <div className="flex items-center w-full space-x-2 md:w-auto">
                            <Search size={18} className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by student name"
                                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-64"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center w-full space-x-2 md:w-auto">
                            <Calendar size={18} className="text-gray-500" />
                            <input
                                type="date"
                                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-64"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                    </div>
                    {filteredStudents.length === 0 ? (
                        <div className="text-center text-gray-500">No student found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full bg-white border-collapse rounded-lg shadow-md">
                                <thead>
                                    <tr className="bg-gray-100 border-b">
                                        <th className="p-4 font-semibold text-left text-gray-600">Name</th>
                                        <th className="p-4 font-semibold text-left text-gray-600">Attendance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((student) => {
                                        const filteredAttendance = filterAttendanceByDate(student.attendance);
                                        const isOpen = openAccordion === student.id;

                                        return (
                                            <tr key={student.id} className="border-b hover:bg-gray-50">
                                                <td className="p-4">{student.name}</td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => toggleAccordion(student.id)}
                                                        className="text-blue-500 hover:text-blue-700 focus:outline-none"
                                                    >
                                                        {isOpen ? 'Hide' : 'Show'}
                                                    </button>
                                                    {isOpen && (
                                                        <div className="mt-4">
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
                                                                            <li key={index} className="flex items-center justify-between py-2">
                                                                                <span className="text-gray-600">
                                                                                    {format(new Date(formattedDate), 'dd MMM yyyy')}:
                                                                                </span>
                                                                                <span
                                                                                    className={`inline-block px-4 py-1 rounded-full text-white ${record.status === 'present' ? 'bg-green-500' : 'bg-red-500'}`}
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
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ViewAttendance;
