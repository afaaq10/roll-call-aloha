/**
 * 
 * @author: Afaaq Majeed
 * 
 * @project: Roll-Call Aloha
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Search, X } from 'lucide-react';
import { markAttendanceForStudent, fetchStudents } from '../firebase';
import Loading from './Loading';

const TakeAttendance = ({ selectedProgram }) => {
    const [students, setStudents] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [todayDate] = React.useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const getStudents = async () => {
            setLoading(true);
            const studentsData = await fetchStudents(selectedProgram);
            setStudents(studentsData);
            setLoading(false);
        };

        if (selectedProgram) {
            getStudents();
        } else {
            console.log("Selected program is undefined or null");
        }
    }, [selectedProgram]);

    const markAttendance = async (studentId, status) => {
        const attendanceRecord = {
            [todayDate]: status,
        };
        await markAttendanceForStudent(selectedProgram, studentId, attendanceRecord);

        const updatedStudentsData = await fetchStudents(selectedProgram);
        setStudents(updatedStudentsData);
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <Link to="/" className="flex items-center text-lg text-blue-600">
                    <ArrowLeft size={20} className="mb-4 mr-2" />
                </Link>
            </div>
            <h2 className="mb-8 text-2xl font-semibold text-center md:text-left">Take Attendance</h2>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="flex items-center w-full mb-4 space-x-2 md:w-auto">
                        <Search size={18} className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by student name"
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {filteredStudents.length === 0 ? (
                        <p className="text-center text-gray-500">No student found</p>
                    ) : (
                        <div className="mt-10 space-y-3">
                            {students.length === 0 ? (
                                <p>No students found for the selected program.</p>
                            ) : (
                                filteredStudents.map((student) => {
                                    const latestAttendance = student.attendance && student.attendance.length > 0
                                        ? student.attendance.reduce((latest, record) => {
                                            return new Date(record.date) > new Date(latest.date) ? record : latest;
                                        })
                                        : null;

                                    const shouldShowLatestAttendance =
                                        latestAttendance &&
                                        latestAttendance.date === todayDate;

                                    const status = shouldShowLatestAttendance ? latestAttendance.status : null;

                                    const isPresent = status === 'present';

                                    const cardBgColor = isPresent ? 'bg-green-100' : (status ? 'bg-red-200' : 'bg-white');
                                    const textColor = isPresent ? 'text-green-800' : (status ? 'text-red-800' : 'text-gray-800');

                                    return (
                                        <div
                                            key={student.id}
                                            className={`md:w-[28rem] shadow-md rounded-lg p-3 flex flex-col gap-4 border ${cardBgColor} ${textColor}`}
                                        >
                                            <div className="flex flex-row justify-between">
                                                <h3 className="text-xl font-medium">{student.name}</h3>
                                                <p className="font-semibold text-gray-600">Level: {student.class}</p>
                                                {status && (
                                                    <div className="">
                                                        <span
                                                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white ${isPresent ? 'bg-green-500' : 'bg-red-500'}`}
                                                        >
                                                            {isPresent ? 'P' : 'A'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-4 mt-4">
                                                <button
                                                    onClick={() => markAttendance(student.id, 'present')}
                                                    className="flex items-center gap-2 px-6 py-2 text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none"
                                                >
                                                    <Check size={16} /> Present
                                                </button>
                                                <button
                                                    onClick={() => markAttendance(student.id, 'absent')}
                                                    className="flex items-center gap-2 px-6 py-2 text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none"
                                                >
                                                    <X size={16} /> Absent
                                                </button>
                                            </div>
                                            <div className="flex justify-end text-sm font-normal text-gray-600">Timing: {student.timing}</div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TakeAttendance;
