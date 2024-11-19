/**
 * 
 * @author Afaaq Majeed
 * @project aloha-roll-call
 */

import React from 'react';
import { Link } from 'react-router-dom';

const TakeAttendance = ({ students, markAttendance }) => {
    return (
        <div>
            <h2 className="mb-4 text-xl">Take Attendance</h2>
            <div className="overflow-x-auto">
                <table className="w-full bg-white border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="p-4 font-semibold text-left">Name</th>
                            <th className="p-4 font-semibold text-left">Today's Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{student.name}</td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => markAttendance(student.id, 'present')}
                                            className="btn-green"
                                        >
                                            Present
                                        </button>
                                        <button
                                            onClick={() => markAttendance(student.id, 'absent')}
                                            className="btn-red"
                                        >
                                            Absent
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Back to Home Button */}
            <Link to="/" className="mt-4 btn">Back to Home</Link>
        </div>
    );
};

export default TakeAttendance;
