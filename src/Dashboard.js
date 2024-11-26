/**
 * 
 * @author: Afaaq Majeed
 * 
 * @project: Roll-Call Aloha
 */


import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, ChevronLeft, ChevronRight, Users, CalendarDays, ArrowLeft } from 'lucide-react';
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

const Dashboard = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalPresent, setTotalPresent] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const studentsData = await fetchStudents();
            setStudents(studentsData);
        };
        fetchData();
    }, []);

    const getMonthAttendance = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const classAttendance = {};
        let totalStudentsCount = 0;
        let totalPresentCount = 0;

        for (let i = 1; i <= 8; i++) {
            classAttendance[i] = {
                totalStudents: 0,
                presentCount: 0,
                absentCount: 0,
                daysWithRecords: new Set()
            };
        }

        students.forEach(student => {
            const studentClass = parseInt(student.class);
            if (!studentClass || studentClass < 1 || studentClass > 8) return;

            classAttendance[studentClass].totalStudents++;
            totalStudentsCount++;

            const attendance = student.attendance || [];
            attendance.forEach(record => {
                const recordDate = new Date(record.date);
                if (recordDate.getMonth() === month && recordDate.getFullYear() === year) {
                    classAttendance[studentClass].daysWithRecords.add(record.date);
                    if (record.status === 'present') {
                        classAttendance[studentClass].presentCount++;
                        totalPresentCount++;
                    } else if (record.status === 'absent') {
                        classAttendance[studentClass].absentCount++;
                    }
                }
            });
        });

        setTotalStudents(totalStudentsCount);
        setTotalPresent(totalPresentCount);

        const data = Object.entries(classAttendance).map(([classLevel, stats]) => {
            const totalRecords = stats.presentCount + stats.absentCount;
            const daysInMonth = stats.daysWithRecords.size;

            const presentPercentage = totalRecords > 0
                ? Math.round((stats.presentCount / totalRecords) * 100)
                : 0;

            const absentPercentage = totalRecords > 0
                ? Math.round((stats.absentCount / totalRecords) * 100)
                : 0;

            return {
                name: `L${classLevel}`,
                fullName: `Level ${classLevel}`,
                present: presentPercentage,
                absent: absentPercentage,
                totalStudents: stats.totalStudents,
                daysWithRecords: daysInMonth
            };
        });

        setAttendanceData(data);
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
    };

    useEffect(() => {
        if (students.length > 0) {
            getMonthAttendance();
        }
    }, [currentMonth, students]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="p-3 bg-white border rounded-lg shadow-lg">
                    <p className="text-sm font-bold text-gray-800">{data.fullName}</p>
                    <div className="mt-2 space-y-1">
                        <p className="text-sm text-emerald-600">Present: {data.present}%</p>
                        <p className="text-sm text-red-600">Absent: {data.absent}%</p>
                        <p className="text-sm text-gray-600">Students: {data.totalStudents}</p>
                        <p className="text-sm text-gray-600">Days: {data.daysWithRecords}</p>
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
                <Link to="/" className="flex items-center mb-4 text-lg text-blue-600">
                    <ArrowLeft size={20} className="mr-2" /> Home
                </Link>
                <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold text-gray-800 lg:text-3xl">Attendance Dashboard</h1>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button
                            onClick={prevMonth}
                            className="p-2 text-gray-600 transition-all bg-white rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm font-medium text-gray-700 sm:text-base">
                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                            onClick={nextMonth}
                            className="p-2 text-gray-600 transition-all bg-white rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
                    <StatsCard
                        title="Total Students"
                        value={totalStudents}
                        icon={Users}
                    />
                    <StatsCard
                        title="Present Today"
                        value={totalPresent}
                        icon={CalendarDays}
                        valueColor="text-emerald-600"
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
                                margin={
                                    windowWidth < 640
                                        ? { top: 20, right: 10, left: -8, bottom: 20 }
                                        : { top: 20, right: 30, left: 20, bottom: 5 }
                                }
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
