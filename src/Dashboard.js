/**
 * Project aloha-roll-call
 * 
 * @author Afaaq Majeed
 */

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const students = [
        {
            id: 1,
            name: "John Doe",
            class: "10A",
            phone: "1234567890",
            attendance: [
                { date: '2024-03-01', status: 'present' },
                { date: '2024-03-02', status: 'present' },
                { date: '2024-03-03', status: 'absent' },
                { date: '2024-03-04', status: 'present' },
                { date: '2024-03-05', status: 'present' },
            ]
        },
    ];

    const getMonthAttendance = (attendance) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const monthData = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day).toISOString().split('T')[0];
            const record = attendance.find(a => a.date === date);
            monthData.push({
                date: day,
                status: record ? record.status : 'unmarked'
            });
        }
        return monthData;
    };

    // const calculateStats = (attendance) => {
    //     const total = attendance.length;
    //     const present = attendance.filter(a => a.status === 'present').length;
    //     const absent = attendance.filter(a => a.status === 'absent').length;
    //     const presentPercentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    //     return {
    //         total,
    //         present,
    //         absent,
    //         presentPercentage
    //     };
    // };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
    };

    return (
        <div className="max-w-4xl p-4 mx-auto">
            <h2 className="mb-6 text-xl font-bold">Dashboard</h2>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="btn">
                        <ChevronLeft size={16} />
                        Prev
                    </button>
                    <span>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={nextMonth} className="btn">
                        <ChevronRight size={16} />
                        Next
                    </button>
                </div>

                <button onClick={() => setSelectedStudent(students[0])} className="btn">
                    <Calendar size={16} />
                    View Student Attendance
                </button>
            </div>

            {selectedStudent && (
                <>
                    <h3 className="mb-4 font-semibold">{selectedStudent.name} ({selectedStudent.class})</h3>
                    <div className="alert alert-info">
                        <strong>Attendance Stats for the Month</strong>
                    </div>

                    <div className="mb-4">
                        <p>Total Days: {students.length}</p>
                        <p>Present: {students.length}</p>
                    </div>

                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={getMonthAttendance(selectedStudent.attendance)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="status" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </>
            )}
        </div>
    );
};

export default Dashboard;
