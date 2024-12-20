/**
 * 
 * @author: Afaaq Majeed
 * 
 * @project: Roll-Call Aloha
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, Users, CalendarDays, ArrowLeft, Eye } from 'lucide-react';
import { fetchStudents } from './firebase';
import { Link } from 'react-router-dom';

const StatsCard = ({ title, value, icon: Icon, valueColor = "text-gray-900" }) => (
    <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <Icon className="w-4 h-4 text-gray-500" />
        </div>
        <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
    </div>
);

const Dashboard = ({ selectedProgram, onProgramChange }) => {
    const [students, setStudents] = React.useState([]);
    const [attendanceData, setAttendanceData] = React.useState([]);
    const [attendanceList, setAttendanceList] = React.useState([]);
    const [totalStudents, setTotalStudents] = React.useState(0);
    const [totalPresent, setTotalPresent] = React.useState(0);
    const [totalAbsent, setTotalAbsent] = React.useState(0);
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
    const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => {
        const fetchData = async () => {
            const studentsData = await fetchStudents(selectedProgram);
            setStudents(studentsData);
        };
        fetchData();
    }, [selectedProgram]);

    const getDailyAttendance = () => {
        let totalStudentsCount = 0;
        let totalPresentCount = 0;
        let totalAbsentCount = 0;

        const maxLevel = selectedProgram === 'tiny_tots' ? 10 : 8;
        const classAttendance = {};

        for (let i = 1; i <= maxLevel; i++) {
            classAttendance[i] = {
                totalStudents: 0,
                presentCount: 0,
                absentCount: 0
            };
        }

        students.forEach(student => {
            const studentClass = parseInt(student.class);
            if (!studentClass || studentClass < 1 || studentClass > maxLevel) return;

            classAttendance[studentClass].totalStudents++;
            totalStudentsCount++;

            const attendance = student.attendance || [];
            const todayAttendance = attendance.find(record =>
                new Date(record.date).toISOString().split('T')[0] === selectedDate
            );

            if (todayAttendance) {
                if (todayAttendance.status === 'present') {
                    classAttendance[studentClass].presentCount++;
                    totalPresentCount++;
                } else if (todayAttendance.status === 'absent') {
                    classAttendance[studentClass].absentCount++;
                    totalAbsentCount++;
                }
            }
        });

        setTotalStudents(totalStudentsCount);
        setTotalPresent(totalPresentCount);
        setTotalAbsent(totalAbsentCount);

        const data = Object.entries(classAttendance).map(([classLevel, stats]) => {
            const presentPercentage = stats.totalStudents > 0
                ? Math.round((stats.presentCount / stats.totalStudents) * 100)
                : 0;

            const absentPercentage = stats.totalStudents > 0
                ? Math.round((stats.absentCount / stats.totalStudents) * 100)
                : 0;

            return {
                name: `L${classLevel}`,
                fullName: `Level ${classLevel}`,
                present: presentPercentage,
                absent: absentPercentage,
                totalStudents: stats.totalStudents,
                presentCount: stats.presentCount,
                absentCount: stats.absentCount
            };
        });

        setAttendanceData(data);
    };

    const getAttendanceList = () => {
        const attendanceDetails = students.map(student => {
            const attendance = student.attendance || [];
            const selectedDateAttendance = attendance.filter(record => {
                const recordDate = new Date(record.date);
                return recordDate.toISOString().split('T')[0] === selectedDate;
            });

            const status = selectedDateAttendance.length > 0
                ? selectedDateAttendance[selectedDateAttendance.length - 1].status
                : 'No data';

            return {
                name: student.name,
                class: student.class,
                status: status
            };
        });

        setAttendanceList(attendanceDetails);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleOutsideClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            setIsModalOpen(false);
        }
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    React.useEffect(() => {
        if (students.length > 0) {
            getDailyAttendance();
            getAttendanceList();
        }
    }, [selectedDate, students]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="p-3 bg-white border rounded-lg shadow-lg">
                    <p className="text-sm font-bold text-gray-800">{data.fullName}</p>
                    <div className="mt-2 space-y-1">
                        <p className="text-sm text-emerald-600">Present: {data.present}% ({data.presentCount})</p>
                        <p className="text-sm text-red-600">Absent: {data.absent}% ({data.absentCount})</p>
                        <p className="text-sm text-gray-600">Total Students: {data.totalStudents}</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }) => (
        <div className="flex justify-center gap-4 mt-2 text-sm">
            {payload.map((entry, index) => (
                <div key={index} className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded ${entry.color === "#10b981" ? "bg-emerald-500" : "bg-red-500"}`} />
                    <span>{entry.value}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen p-4 bg-gray-50 lg:p-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex justify-between">
                    <Link to="/" className="flex items-center mb-4 text-lg text-blue-600">
                        <ArrowLeft size={20} className="mr-2" />
                    </Link>
                    <button
                        onClick={toggleModal}
                        className="flex items-center p-1 mb-4 text-white bg-blue-500 rounded-lg hover:bg-blue-700"
                    >
                        <Eye size={18} className="" />
                    </button>
                </div>
                <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-xl font-bold text-center text-gray-800 md:text-left lg:text-2xl">Attendance Dashboard</h1>

                    <div className="flex items-center justify-center space-x-2 md:justify-end sm:space-x-4">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="p-2 border rounded-md"
                        />
                    </div>
                </div>

                {isModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay"
                        onClick={handleOutsideClick}
                    >
                        <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-[900px] p-6 relative max-h-[80vh] my-8">
                            <button
                                onClick={toggleModal}
                                className="absolute p-2 text-gray-500 top-2 right-2 hover:text-gray-700"
                            >
                                <span className="sr-only">Close</span> ×
                            </button>
                            <h2 className="mb-4 text-lg font-semibold text-gray-800">Student Attendance List</h2>
                            <div className="flex justify-end mb-4">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    className="p-2 border rounded-md"
                                />
                            </div>
                            <div className="overflow-y-auto max-h-[calc(80vh-8rem)]">
                                <table className="w-full text-left border-collapse table-auto">
                                    <thead className="sticky top-0 bg-white">
                                        <tr>
                                            <th className="px-4 py-2 font-semibold text-gray-600">Name</th>
                                            <th className="px-4 py-2 font-semibold text-gray-600">Level</th>
                                            <th className="px-4 py-2 font-semibold text-gray-600">Attendance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceList.map((student, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-2">{student.name}</td>
                                                <td className="px-4 py-2">{student.class}</td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-1 text-sm rounded-full ${student.status === 'present'
                                                        ? 'bg-green-200 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-2">
                    <StatsCard
                        title="Present Today"
                        value={totalPresent}
                        icon={CalendarDays}
                        valueColor="text-emerald-600"
                    />
                    <StatsCard
                        title="Absent Today"
                        value={totalAbsent}
                        icon={Calendar}
                        valueColor="text-red-600"
                    />
                    <StatsCard
                        title="Total Students"
                        value={totalStudents}
                        icon={Users}
                    />
                    <StatsCard
                        title="Attendance Rate"
                        value={`${totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0}%`}
                        icon={Calendar}
                        valueColor="text-blue-600"
                    />
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm sm:p-6">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">Attendance Statistics by Level</h2>
                    <div className="w-full mt-4" style={{ height: windowWidth < 640 ? '300px' : '400px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={attendanceData}
                                margin={{
                                    top: 20, right: 30, left: 20, bottom: 5
                                }}
                                barSize={windowWidth < 640 ? 15 : 20}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: windowWidth < 640 ? 10 : 12 }}
                                    interval={0}
                                    angle={windowWidth < 640 ? 0 : -45}
                                    textAnchor={windowWidth < 640 ? "middle" : "end"}
                                    height={windowWidth < 640 ? 30 : 60}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    ticks={[0, 25, 50, 75, 100]}
                                    tick={{ fontSize: windowWidth < 640 ? 10 : 12 }}
                                    width={windowWidth < 640 ? 30 : 40}
                                />
                                <Tooltip content={CustomTooltip} />
                                <Legend content={CustomLegend} />
                                <Bar
                                    dataKey="present"
                                    fill="#10b981"
                                    name="Present"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={50}
                                />
                                <Bar
                                    dataKey="absent"
                                    fill="#ef4444"
                                    name="Absent"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={50}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
