/**
 * 
 * @author: Afaaq Majeed
 * 
 * @project: Roll-Call Aloha
 */

import React from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TakeAttendance from './components/TakeAttendance';
import ViewAttendance from './components/ViewAttendance';
import Navbar from './components/Navbar';
import { Edit2, Trash2 } from 'lucide-react';
import { addStudentToDatabase, deleteStudentFromDatabase, fetchStudents, markAttendanceForStudent } from './firebase';
import Dashboard from './Dashboard';
import Login from './components/Login';
import './App.css';
import Loading from './components/Loading';

const TIMING_SLOTS = [
    { value: '10am-12pm', label: '10am - 12pm' },
    { value: '12pm-2pm', label: '12pm - 2pm' },
    { value: '2pm-4pm', label: '2pm - 4pm' }
];

const App = () => {
    const [students, setStudents] = React.useState([]);
    const [newStudent, setNewStudent] = React.useState({ name: '', class: '', phone: '', code: '3029/', timing: '' });

    const [showAlert, setShowAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');

    const [menuOpen, setMenuOpen] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [studentToDelete, setStudentToDelete] = React.useState(null);

    const [studentToEdit, setStudentToEdit] = React.useState(null);

    const modalRef = React.useRef(null);
    const inputSectionRef = React.useRef(null);

    const [selectedProgram, setSelectedProgram] = React.useState('mental_arithmetic');

    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const storedAuthStatus = localStorage.getItem('isAuthenticated');
        if (storedAuthStatus === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleProgramChange = (program) => {
        setSelectedProgram(program);
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
        setMenuOpen(false);
        localStorage.setItem('isAuthenticated', 'true');
    };

    React.useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const studentsData = await fetchStudents(selectedProgram);
            setStudents(studentsData);
            setLoading(false);

        };
        fetchData();
    }, [selectedProgram]);

    const addStudent = () => {
        if (!newStudent.name || !newStudent.class || !newStudent.phone || !newStudent.code || !newStudent.timing) {
            setAlertMessage('Please fill in all fields');
            setShowAlert(true);
            return;
        }

        const student = { id: Date.now().toString(), ...newStudent, attendance: [] };
        setStudents([...students, student]);
        addStudentToDatabase(selectedProgram, student);
        setNewStudent({ name: '', class: '', phone: '', code: '3029/', timing: '' });
        setAlertMessage('Student added successfully');
        setShowAlert(true);
    };

    const handleEditStudent = (student) => {
        setStudentToEdit(student);
        setNewStudent({
            name: student.name,
            class: student.class,
            phone: student.phone,
            code: student.code || '3029/',
            timing: student.timing || ''
        });

        if (inputSectionRef.current) {
            inputSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSaveEdit = () => {
        if (!newStudent.name || !newStudent.class || !newStudent.phone || !newStudent.timing) {
            setAlertMessage('Please fill in all fields');
            setShowAlert(true);
            return;
        }

        const updatedStudent = { ...studentToEdit, ...newStudent };
        setStudents(students.map(student =>
            student.id === studentToEdit.id ? updatedStudent : student
        ));

        addStudentToDatabase(selectedProgram, updatedStudent);
        setAlertMessage('Student details updated successfully');
        setShowAlert(true);
        setStudentToEdit(null);
        setNewStudent({ name: '', class: '', phone: '', timing: '' });
    };

    const deleteStudent = (id) => {
        setShowDeleteModal(true);
        setStudentToDelete(id);
    };

    const handleConfirmDelete = () => {
        if (studentToDelete) {
            setStudents(students.filter(student => student.id !== studentToDelete));
            deleteStudentFromDatabase(selectedProgram, studentToDelete);
            setAlertMessage('Student deleted successfully');
            setShowAlert(true);
        }
        setShowDeleteModal(false);
    };

    const markAttendance = (studentId, status) => {
        const attendanceRecord = {
            [new Date().toISOString().split('T')[0]]: status,
        };
        markAttendanceForStudent(selectedProgram, studentId, attendanceRecord);
        setAlertMessage(`Attendance marked as ${status}`);
        setShowAlert(true);
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);

    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    React.useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => setShowAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        <Navigate to="/login" />;
    };

    return (
        <Router>
            <div className="max-w-4xl p-6 mx-auto">
                {isAuthenticated && <Navbar toggleMenu={toggleMenu} menuOpen={menuOpen} setMenuOpen={setMenuOpen} modalRef={modalRef} handleLogout={handleLogout} selectedProgram={selectedProgram} />}

                {showAlert && (
                    <div className="p-2 mb-4 text-green-800 bg-green-100 rounded-lg">
                        <strong>{alertMessage}</strong>
                    </div>
                )}
                {loading ? (
                    <div className="">
                        <Loading />  {/* This is your loading spinner */}
                    </div>
                ) : (<div className="">
                    {isAuthenticated && <div className="flex justify-end gap-2 mb-4">
                        <button
                            className={`px-4 py-2 text-white rounded-md ${selectedProgram === 'tiny_tots' ? 'bg-blue-600' : 'bg-gray-300'}`}
                            onClick={() => handleProgramChange('tiny_tots')}
                        >
                            Tiny Tots
                        </button>
                        <button
                            className={`px-4 py-2 text-white rounded-md ${selectedProgram === 'mental_arithmetic' ? 'bg-blue-600' : 'bg-gray-300'}`}
                            onClick={() => handleProgramChange('mental_arithmetic')}
                        >
                            Mental Arithmetic
                        </button>
                    </div>}

                    {showDeleteModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
                            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg sm:w-1/3">
                                <h3 className="mb-4 text-lg font-semibold sm:text-xl">Are you sure you want to delete this student?</h3>
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="px-4 py-2 text-sm text-white bg-gray-400 rounded hover:bg-gray-500 sm:text-base"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete}
                                        className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 sm:text-base"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <Routes>
                        <Route
                            path="/login"
                            element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
                        />
                        <Route
                            path="/take-attendance/:selectedProgram"
                            element={isAuthenticated ? <TakeAttendance students={students} selectedProgram={selectedProgram} markAttendance={markAttendance} /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/view-attendance/:selectedProgram"
                            element={isAuthenticated ? <ViewAttendance students={students} selectedProgram={selectedProgram} /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/dashboard/:selectedProgram"
                            element={isAuthenticated ? <Dashboard selectedProgram={selectedProgram} onProgramChange={handleProgramChange} /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/"
                            element={isAuthenticated ? (
                                <>
                                    <div ref={inputSectionRef} className="flex flex-col gap-6 mb-6">
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
                                            placeholder="Student Code"
                                            value={newStudent.code}
                                            onChange={(e) => {
                                                let value = e.target.value;
                                                if (!value.startsWith('3029/')) {
                                                    value = '3029/';
                                                }
                                                setNewStudent({ ...newStudent, code: value });
                                            }}
                                            className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Phone Number"
                                            value={newStudent.phone}
                                            onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                                            className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <select
                                            value={newStudent.timing}
                                            onChange={(e) => setNewStudent({ ...newStudent, timing: e.target.value })}
                                            className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Timing Slot</option>
                                            {TIMING_SLOTS.map((slot) => (
                                                <option key={slot.value} value={slot.value}>
                                                    {slot.label}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={studentToEdit ? handleSaveEdit : addStudent}
                                            className="p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                        >
                                            {studentToEdit ? 'Edit' : 'Register'}
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full bg-white border-collapse">
                                            <thead>
                                                <tr className="border-b">
                                                    <td className="p-4">SNo</td>
                                                    <th className="p-4 font-semibold text-left">Name</th>
                                                    <th className="p-4 font-semibold text-left">Level</th>
                                                    <th className="p-4 font-semibold text-left">Code</th>
                                                    <th className="p-4 font-semibold text-left">Phone</th>
                                                    <th className="p-4 font-semibold text-left">Timing</th>
                                                    <th className="p-4 font-semibold text-left">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {students.map((student, index) => (
                                                    <tr key={student.id} className="border-b hover:bg-gray-50">
                                                        <td className="p-4">{index + 1}</td>
                                                        <td className="p-4">{student.name}</td>
                                                        <td className="p-4">{student.class}</td>
                                                        <td className="p-4">{student.code}</td>
                                                        <td className="p-4">{student.phone}</td>
                                                        <td className="p-4">{student.timing}</td>
                                                        <td className="flex gap-4 p-4">
                                                            <button
                                                                className="p-2 text-white bg-gray-500 rounded-lg hover:bg-gray-700"
                                                                onClick={() => handleEditStudent(student)}
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
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
                            ) : <Navigate to="/login" />
                            }
                        />
                    </Routes>
                </div>
                )}
            </div>
        </Router>
    );
};

export default App;
