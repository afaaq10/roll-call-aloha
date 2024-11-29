// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set, get, remove } from "firebase/database";

// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID,
//     measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
// };

// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// export const addStudentToDatabase = (student) => {
//     const studentRef = ref(db, 'students/' + student.id);
//     set(studentRef, student);
// };

// export const deleteStudentFromDatabase = (id) => {
//     const studentRef = ref(db, 'students/' + id);
//     remove(studentRef);
// };

// export const fetchStudents = async () => {
//     const studentsRef = ref(db, 'students');
//     const snapshot = await get(studentsRef);
//     return snapshot.exists() ? Object.values(snapshot.val()) : [];
// };

// export const markAttendanceForStudent = async (studentId, attendanceRecord) => {
//     const attendanceRef = ref(db, `students/${studentId}/attendance`);
//     const snapshot = await get(attendanceRef);
//     const currentAttendance = snapshot.exists() ? snapshot.val() : [];

//     const newRecord = {
//         date: Object.keys(attendanceRecord)[0],
//         status: attendanceRecord[Object.keys(attendanceRecord)[0]]
//     };

//     const existingIndex = currentAttendance.findIndex(record =>
//         record.date === newRecord.date
//     );

//     let updatedAttendance;
//     if (existingIndex >= 0) {
//         updatedAttendance = [...currentAttendance];
//         updatedAttendance[existingIndex] = newRecord;
//     } else {
//         updatedAttendance = [...currentAttendance, newRecord];
//     }

//     await set(attendanceRef, updatedAttendance);
// };



import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, remove } from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Add student to the selected program
export const addStudentToDatabase = (program, student) => {
    const studentRef = ref(db, `students/${program}/${student.id}`);
    set(studentRef, student);
};

// Delete student from the selected program
export const deleteStudentFromDatabase = (program, id) => {
    const studentRef = ref(db, `students/${program}/${id}`);
    remove(studentRef);
};

// Fetch students for the selected program
// export const fetchStudents = async (program) => {
//     const studentsRef = ref(db, `students/${program}`);
//     const snapshot = await get(studentsRef);
//     console.log("Firebase Snapshot Data:", snapshot.val());
//     return snapshot.exists() ? Object.values(snapshot.val()) : [];
// };

export const fetchStudents = async (program) => {
    try {
        const studentsRef = ref(db, `students/${program}`);
        const snapshot = await get(studentsRef);
        console.log("Firebase Snapshot Data:", snapshot.val());

        if (!snapshot.exists()) {
            console.log("No students found for this program");
            return []; // Return an empty array if no students exist
        }

        const studentsData = Object.keys(snapshot.val()).map(id => ({
            id,
            ...snapshot.val()[id]
        }));

        return studentsData;
    } catch (error) {
        console.error("Error fetching students:", error);
        return []; // Return an empty array on error
    }
};


// Mark attendance for the selected student
export const markAttendanceForStudent = async (program, studentId, attendanceRecord) => {
    const attendanceRef = ref(db, `students/${program}/${studentId}/attendance`);
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
