/**
 * Project aloha-roll-call
 * 
 * @author Afaaq Majeed
 */

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';

const App = () => {
    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({
        name: '',
        class: '',
        phone: ''
    });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const addStudent = () => {
        if (!newStudent.name || !newStudent.class || !newStudent.phone) {
            setAlertMessage('Please fill in all fields');
            setShowAlert(true);
            return;
        }

        const student = {
            id: Date.now(),
            ...newStudent,
            attendance: []
        };

        setStudents([...students, student]);
        setNewStudent({ name: '', class: '', phone: '' });
        setAlertMessage('Student added successfully');
        setShowAlert(true);
    };

    const deleteStudent = (id) => {
        setStudents(students.filter(student => student.id !== id));
        setAlertMessage('Student deleted successfully');
        setShowAlert(true);
    };

    const markAttendance = (studentId, status) => {
        setStudents(students.map(student => {
            if (student.id === studentId) {
                const attendance = {
                    date: new Date().toISOString().split('T')[0],
                    status: status
                };
                return {
                    ...student,
                    attendance: [...student.attendance, attendance]
                };
            }
            return student;
        }));

        if (status === 'absent') {
            setAlertMessage('Absence notification would be sent (SMS integration needed)');
            setShowAlert(true);
        }
    };

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => setShowAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    return (
        <div className="max-w-4xl p-4 mx-auto">
            <h1 className="mb-6 text-2xl font-bold">Student Attendance Management</h1>

            {showAlert && (
                <div className="mb-4 alert alert-success">
                    <strong>{alertMessage}</strong>
                </div>
            )}

            <div className="grid grid-cols-4 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Student Name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="input"
                />
                <input
                    type="text"
                    placeholder="Class/Level"
                    value={newStudent.class}
                    onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                    className="input"
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    className="input"
                />
                <button onClick={addStudent} className="btn">
                    <Plus size={16} />
                    Add Student
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full bg-white border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="p-4 font-semibold text-left">Name</th>
                            <th className="p-4 font-semibold text-left">Class</th>
                            <th className="p-4 font-semibold text-left">Phone</th>
                            <th className="p-4 font-semibold text-left">Today's Attendance</th>
                            <th className="p-4 font-semibold text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{student.name}</td>
                                <td className="p-4">{student.class}</td>
                                <td className="p-4">{student.phone}</td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button
                                            size="sm"
                                            onClick={() => markAttendance(student.id, 'present')}
                                            className="btn-green"
                                        >
                                            Present
                                        </button>
                                        <button
                                            size="sm"
                                            onClick={() => markAttendance(student.id, 'absent')}
                                            className="btn-red"
                                        >
                                            Absent
                                        </button>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <button
                                        className="btn-danger"
                                        onClick={() => deleteStudent(student.id)}
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default App;
