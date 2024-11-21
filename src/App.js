/**
 * 
 * @author Afaaq Majeed
 * @project aloha-roll-call
 */

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TakeAttendance from './components/TakeAttendance';
import ViewAttendance from './components/ViewAttendance';
import Navbar from './components/Navbar';
import { Plus, Trash2 } from 'lucide-react';

const App = () => {
    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({ name: '', class: '', phone: '' });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const modalRef = useRef(null);

    const addStudent = () => {
        if (!newStudent.name || !newStudent.class || !newStudent.phone) {
            setAlertMessage('Please fill in all fields');
            setShowAlert(true);
            return;
        }

        const student = { id: Date.now(), ...newStudent, attendance: [] };
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
                const attendance = { date: new Date().toISOString().split('T')[0], status };
                return { ...student, attendance: [...student.attendance, attendance] };
            }
            return student;
        }));
        setAlertMessage(`Attendance marked as ${status}`);
        setShowAlert(true);
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);

    // Close the modal when clicking outside of it
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
            <div className="max-w-4xl p-4 mx-auto">
                <Navbar toggleMenu={toggleMenu} menuOpen={menuOpen} setMenuOpen={setMenuOpen} modalRef={modalRef} />

                {showAlert && (
                    <div className="mb-4 alert alert-success">
                        <strong>{alertMessage}</strong>
                    </div>
                )}

                <Routes>
                    <Route
                        path="/take-attendance"
                        element={
                            <TakeAttendance
                                students={students}
                                markAttendance={markAttendance}
                            />
                        }
                    />
                    <Route
                        path="/view-attendance"
                        element={<ViewAttendance students={students} />}
                    />
                    <Route
                        path="/"
                        element={
                            <>
                                <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
                                    <input
                                        type="text"
                                        placeholder="Student Name"
                                        value={newStudent.name}
                                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                        className="input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Level"
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
                                                            className="btn-danger"
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
