/**
 * 
 * @author Afaaq Majeed
 * @project aloha-roll-call
 */

import React from 'react';
import { Link } from 'react-router-dom';

const ViewAttendance = ({ students }) => {
    return (
        <div>
            {/* Back to Home Button */}
            <Link to="/" className="mt-4 btn">Back to Home</Link>
            <h2 className="mb-4 text-xl">View Attendance</h2>
            <div className="overflow-x-auto">
                <table className="w-full bg-white border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="p-4 font-semibold text-left">Name</th>
                            <th className="p-4 font-semibold text-left">Attendance History</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{student.name}</td>
                                <td className="p-4">
                                    {student.attendance.length > 0 ? (
                                        <ul>
                                            {student.attendance.map((record, index) => (
                                                <li key={index}>
                                                    {record.date}: {record.status}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span>No attendance recorded</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewAttendance;
