import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, remove } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBJmUCZvZxcigHAfuOHJo9pf8N4OJGRf3E",
    authDomain: "roll-call-aloha.firebaseapp.com",
    projectId: "roll-call-aloha",
    storageBucket: "roll-call-aloha.firebasestorage.app",
    messagingSenderId: "838999942255",
    appId: "1:838999942255:web:0f325345ae9b25bb38999a",
    measurementId: "G-157Y2F98VC"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const addStudentToDatabase = (student) => {
    const studentRef = ref(db, 'students/' + student.id);
    set(studentRef, student);
};

export const deleteStudentFromDatabase = (id) => {
    const studentRef = ref(db, 'students/' + id);
    remove(studentRef);
};

export const fetchStudents = async () => {
    const studentsRef = ref(db, 'students');
    const snapshot = await get(studentsRef);
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
};

export const markAttendanceForStudent = async (studentId, attendanceRecord) => {
    const attendanceRef = ref(db, `students/${studentId}/attendance`);
    const snapshot = await get(attendanceRef);
    const currentAttendance = snapshot.exists() ? snapshot.val() : [];

    const newRecord = {
        date: Object.keys(attendanceRecord)[0],
        status: attendanceRecord[Object.keys(attendanceRecord)[0]]
    };

    const existingIndex = currentAttendance.findIndex(record =>
        record.date === newRecord.date
    );

    let updatedAttendance;
    if (existingIndex >= 0) {
        updatedAttendance = [...currentAttendance];
        updatedAttendance[existingIndex] = newRecord;
    } else {
        updatedAttendance = [...currentAttendance, newRecord];
    }

    await set(attendanceRef, updatedAttendance);
};
