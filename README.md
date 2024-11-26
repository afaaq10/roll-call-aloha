# Roll Call Attendance App

This is an attendance tracking app built with React and Firebase. It allows you to take attendance for students and track whether they are present or absent.

## Features

- **Student Management:** View and manage student data.
- **Attendance Tracking:** Mark students as present or absent.
- **Firebase Integration:** Attendance data is stored and retrieved from Firebase Realtime Database.
  
## Getting Started

Follow these steps to run the project locally:

### Prerequisites

Make sure you have `node` and `npm` installed. You can check if you have them installed by running:

```bash
node -v
npm -v

git clone https://github.com/your-username/roll-call-app.git
cd roll-call-app

REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id

npm install


npm start

Your app will be available at http://localhost:3000.

### Notes:

- Replace `your-api-key`, `your-auth-domain`, `your-project-id`, etc., with your actual Firebase credentials in the `.env` section.

Suggestions and feedback are welcome! Feel free to open an issue or pull request for improvement or new features.
