# 🩸 BloodZone: Hyperlocal Real-Time Blood Donation Platform

> **A location-aware donation network connecting donors and seekers within dynamic ranges (5km - 50km) in real-time.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![React Native](https://img.shields.io/badge/React_Native-Expo-blue)](https://reactnative.dev/) [![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://nodejs.org/) [![MongoDB](https://img.shields.io/badge/MongoDB-Geospatial-forestgreen)](https://www.mongodb.com/) [![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-black)](https://socket.io/)

---

## 📱 Live Demo

- **🎥 Video Demo:** [YouTube](https://www.youtube.com/shorts/AOj7_smdNtQ)
- **📲 Download APK:** [Download Now]()

---

## 🚀 Engineering Highlights

### 1. Geospatial Matching Engine (Dynamic Radius)

Unlike simple directory apps, BloodZone utilizes **MongoDB's 2dsphere indexing** to perform complex compound queries. The system filters donors based on:

- **Physical Distance:** Dynamic filtering ($near) based on user urgency (5km, 10km, 20km, 50km).
- **Temporal Eligibility:** Automatically excludes donors who have donated within the last 3 months.

### 2. Secure Hybrid Authentication

Implemented a **Server-Side Google OAuth 2.0 flow**.

- **Security:** The frontend never handles the raw Auth Code. The code is exchanged on the backend for a Google Profile.
- **Session Management:** A custom JWT layer (Access + Refresh Tokens) is generated to manage long-running sessions without compromising security.

### 3. Real-Time Communication with Auth Guards

Built a low-latency chat system using **Socket.io**.

- **Middleware Protection:** Implemented a strict handshake middleware that validates the JWT `accessToken` before allowing a socket connection.
- **Result:** Only authenticated users can establish a connection, preventing unauthorized listeners or spammers.

---

## 🏗️ System Architecture

### High-Level Data Flow

The app follows a 3-tier architecture separating the Presentation (React Native), Business Logic (Express API), and Data/Geo Layer (MongoDB).

![System Architecture Diagram](https://placehold.co/600x400?text=Insert+Architecture+Diagram+Here)
_(`React Native App` ↔ `Express API` ↔ `MongoDB Atlas`)_

### Authentication Sequence

We utilize a custom implementation of the OAuth 2.0 Authorization Code grant type.

![Auth Flow Diagram](https://placehold.co/600x400?text=Insert+Auth+Sequence+Diagram)
_(`App` → `Google Auth` → `Server Exchange` → `JWT Issue`)_

---

## 💻 Key Code Snippets

### The Geospatial Matching Engine

_This controller logic powers the core search feature, allowing variable range filtering._

```typescript
// ⬇️ BELOW IS THE ACTUAL LOGIC USED IN PRODUCTION ⬇️
```

## 🛠️ Tech Stack

| Layer         | Technology          | Key Use Case                            |
| :------------ | :------------------ | :-------------------------------------- |
| **Frontend**  | React Native (Expo) | Android (Verified), iOS (Beta)          |
| **Backend**   | Node.js + Express   | REST API                                |
| **Database**  | MongoDB (Mongoose)  | **Geospatial Indexing** & Data Storage  |
| **Real-Time** | Socket.io           | Bidirectional Event-Based Communication |
| **Auth**      | Google OAuth + JWT  | Secure Identity Management              |

> **⚠️ Compatibility Note:** This application has been developed and strictly tested on **Android** devices. While React Native is cross-platform, iOS compatibility has not been verified due to my hardware limitations.

---

## 📸 Screenshots

|     **Cluster Map**      |        **Donor Profile**         |      **Secure Chat**       |
| :----------------------: | :------------------------------: | :------------------------: |
| ![Map](./assets/map.png) | ![Profile](./assets/profile.png) | ![Chat](./assets/chat.png) |

---

## ⚙️ How to Run Locally

Follow these steps to set up the project on your local machine.

### 1. Prerequisites

- **Node.js**: v24 or higher
- **npm** or **yarn**
- **MongoDB Atlas Account**: You need a connection string (URI).
- **Google Cloud Console**: You need OAuth 2.0 credentials (`CLIENT_ID` and `CLIENT_SECRET`).

### 2. Setup Backend (Server)

First, clone the backend repository and start the server.

```bash
git clone [https://github.com/thexeromin/bloodzone-backend.git](https://github.com/thexeromin/bloodzone-backend.git)
cd bloodzone-backend
npm install

```

**Configure Environment Variables:**
Create a `.env` file in the root folder and add the following keys:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=7d

SERVER_URL=your-current-backend-url
APP_SCHEME=bloodzone://

PORT=8000
MONGO_URI=your-mongo-uri
```

**Start the Server:**

```bash
npm run dev
# Server should be running on http://localhost:8000

```

### 3. Setup Frontend (App)

Open a new terminal window, clone the app repository, and install dependencies.

```bash
git clone [https://github.com/thexeromin/bloodzone-app.git](https://github.com/thexeromin/bloodzone-app.git)
cd bloodzone-app
npm install

```

**Configure API Endpoint:**
Create a `.env` file in the root folder and add the following keys:

```env
API=your-backend-url
EXPO_PUBLIC_SCHEME=bloodzone://
```

**Start the App:**

```bash
npx expo run:android
```

---

## 🔮 Future Roadmap

- [ ] **Push Notifications (FCM):** To alert offline donors of nearby emergencies.
- [ ] **Prescription OCR:** AI validation of medical requisition forms using Google Vision API.
- [ ] **Redis Caching:** To reduce database load for high-traffic geospatial queries.

---

### 👨‍💻 Author

**Abhijit Paul**

- [LinkedIn](https://linkedin.com/in/thexeromin)
- [Email](mailto:thexeromin@gmail.com)
