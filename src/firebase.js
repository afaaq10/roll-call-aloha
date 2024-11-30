import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, remove } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";

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
const auth = getAuth(app);

export const loginAdmin = async (username, password) => {
    try {
        const adminRef = ref(db, "adminCredentials");
        const snapshot = await get(adminRef);

        if (snapshot.exists()) {
            const adminCredentials = snapshot.val();
            if (adminCredentials.username === username && adminCredentials.password === password) {
                return true;
            } else {
                throw new Error("Invalid username or password");
            }
        } else {
            throw new Error("Admin credentials not found");
        }
    } catch (error) {
        console.error("Login error:", error);
        return false;
    }
};

export const logoutAdmin = async () => {
    try {
        await signOut(auth);
        console.log("Logged out successfully");
    } catch (error) {
        console.error("Error logging out: ", error);
    }
};

export const addStudentToDatabase = (program, student) => {
    const studentRef = ref(db, `students/${program}/${student.id}`);
    set(studentRef, student);
};

export const deleteStudentFromDatabase = (program, id) => {
    const studentRef = ref(db, `students/${program}/${id}`);
    remove(studentRef);
};

export const fetchStudents = async (program) => {
    try {
        const studentsRef = ref(db, `students/${program}`);
        const snapshot = await get(studentsRef);
        console.log("Firebase Snapshot Data:", snapshot.val());

        if (!snapshot.exists()) {
            console.log("No students found for this program");
            return [];
        }

        const studentsData = Object.keys(snapshot.val()).map(id => ({
            id,
            ...snapshot.val()[id]
        }));

        return studentsData;
    } catch (error) {
        console.error("Error fetching students:", error);
        return [];
    }
};

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
