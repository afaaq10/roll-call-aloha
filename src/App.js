/**
 * 
 * @author: Afaaq Majeed
 * 
 * @project: Roll-Call Aloha
 */

import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import TakeAttendance from './components/TakeAttendance';
import ViewAttendance from './components/ViewAttendance';
import Navbar from './components/Navbar';
import { Trash2 } from 'lucide-react';
import { addStudentToDatabase, deleteStudentFromDatabase, fetchStudents, markAttendanceForStudent } from './firebase';
import Dashboard from './Dashboard';

const App = () => {
    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({ name: '', class: '', phone: '' });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const studentsData = await fetchStudents();
            setStudents(studentsData);
        };
        fetchData();
    }, []);

    const addStudent = () => {
        if (!newStudent.name || !newStudent.class || !newStudent.phone) {
            setAlertMessage('Please fill in all fields');
            setShowAlert(true);
            return;
        }

        const student = { id: Date.now().toString(), ...newStudent, attendance: [] };
        setStudents([...students, student]);
        addStudentToDatabase(student);
        setNewStudent({ name: '', class: '', phone: '' });
        setAlertMessage('Student added successfully');
        setShowAlert(true);
    };

    const deleteStudent = (id) => {
        setStudents(students.filter(student => student.id !== id));
        deleteStudentFromDatabase(id);
        setAlertMessage('Student deleted successfully');
        setShowAlert(true);
    };

    const markAttendance = (studentId, status) => {
        const attendanceRecord = {
            [new Date().toISOString().split('T')[0]]: status,
        };
        markAttendanceForStudent(studentId, attendanceRecord);
        setAlertMessage(`Attendance marked as ${status}`);
        setShowAlert(true);
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => setShowAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    return (
        <Router>
            <div className="max-w-4xl p-6 mx-auto">
                <Navbar toggleMenu={toggleMenu} menuOpen={menuOpen} setMenuOpen={setMenuOpen} modalRef={modalRef} />

                {showAlert && (
                    <div className="p-2 mb-4 text-green-800 bg-green-100 rounded-lg">
                        <strong>{alertMessage}</strong>
                    </div>
                )}

                <Routes>
                    <Route
                        path="/take-attendance"
                        element={<TakeAttendance students={students} markAttendance={markAttendance} />}
                    />
                    <Route
                        path="/view-attendance"
                        element={<ViewAttendance students={students} />}
                    />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route
                        path="/"
                        element={
                            <>
                                <div className="flex flex-col gap-6 mb-6">
                                    <input
                                        type="text"
                                        placeholder="Student Name"
                                        value={newStudent.name}
                                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                        className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Level"
                                        value={newStudent.class}
                                        onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                                        className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        value={newStudent.phone}
                                        onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                                        className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={addStudent}
                                        className="p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                    >
                                        Register
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full bg-white border-collapse">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="p-4 font-semibold text-left">Name</th>
                                                <th className="p-4 font-semibold text-left">Level</th>
                                                <th className="p-4 font-semibold text-left">Phone</th>
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
                                                        <button
                                                            className="p-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                                                            onClick={() => deleteStudent(student.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
