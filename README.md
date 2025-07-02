### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Android Studio** 
### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DuongD0/todo-app.git
   cd TodoApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase** (Required)
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore Database
   - **Enable Firebase Storage** for image uploads
   - Copy your Firebase configuration values
   - Update the `.env` file with your Firebase credentials:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the application**
   ```bash
   npm start
   ```

## 📱 Running on Device

### Option 1: Expo Go (Quickest)
1. Install **Expo Go** app on your phone:
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Scan the QR code displayed in your terminal
3. The app will open on your device

### Option 2: Android Emulator
1. Make sure Android Studio is installed
2. Press `a` in the terminal when the development server is running
3. The app will open in your Android emulator

## Features

- **User Authentication** - Secure login and registration
- **Task Management** - Create, edit, delete, and organize todos
- **Priority Levels** - High, Medium, Low priority classification
- **Due Dates** - Set and track task deadlines
- **Tags** - Organize tasks with custom tags
- **Image Attachments** - Add photos to your tasks
- **Real-time Sync** - Changes sync instantly across devices
- **Responsive Design** - Works seamlessly on all screen sizes

## 🛠️ Commands

`npm start` Start the development server 
`npm run android` Run on Android device/emulator 


## Firebase Setup Details

1. **Authentication**: Email/password authentication is enabled
2. **Firestore**: Real-time database for storing todos
3. **Storage**: Firebase Storage for image uploads

### Firestore Security Rules
In your Firebase Console, update Firestore security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{todoId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Firebase Storage Security Rules
In your Firebase Console, update Storage security rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
  }
}
```

