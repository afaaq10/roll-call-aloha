/**
 * 
 * @author: Afaaq Majeed
 * 
 * @project: Roll-Call Aloha
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import { markAttendanceForStudent, fetchStudents } from '../firebase';

const TakeAttendance = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const getStudents = async () => {
            const studentsData = await fetchStudents();
            setStudents(studentsData);
        };

        getStudents();
    }, []);

    const markAttendance = async (studentId, status) => {
        const attendanceRecord = {
            [new Date().toISOString().split('T')[0]]: status,
        };
        await markAttendanceForStudent(studentId, attendanceRecord);

        const updatedStudentsData = await fetchStudents();
        setStudents(updatedStudentsData);
    };

    return (
        <div className="p-6">
            <Link to="/" className="flex items-center mb-4 text-lg text-blue-600">
                <ArrowLeft size={20} className="mr-2" /> Back to Home
            </Link>

            <h2 className="mb-6 text-2xl font-semibold">Take Attendance</h2>

            <div className="space-y-6">
                {students.map((student) => {
                    const lastAttendance = student.attendance && student.attendance.length > 0
                        ? student.attendance.reduce((latest, record) => {
                            return new Date(record.date) > new Date(latest.date) ? record : latest;
                        })
                        : null;

                    const status = lastAttendance ? lastAttendance.status : null;

                    const isPresent = status === 'present';

                    const cardBgColor = isPresent ? 'bg-green-100' : (status ? 'bg-red-200' : 'bg-white');
                    const textColor = isPresent ? 'text-green-800' : (status ? 'text-red-800' : 'text-gray-800');

                    return (
                        <div
                            key={student.id}
                            className={`shadow-md rounded-lg p-6 flex flex-col gap-4 border ${cardBgColor} ${textColor}`}
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-xl font-medium">{student.name}</h3>
                                    <p className="text-gray-600">Level: {student.class}</p>
                                    <p className="text-gray-600">Phone: {student.phone}</p>
                                </div>

                                {lastAttendance && (
                                    <div className="flex gap-2">
                                        <span
                                            className={`inline-block py-1 px-4 rounded-full text-white ${isPresent ? 'bg-green-500' : 'bg-red-500'}`}
                                        >
                                            {isPresent ? 'Present' : 'Absent'}
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
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TakeAttendance;
