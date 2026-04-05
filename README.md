# 🩸 BloodZone: Hyperlocal Real-Time Blood Donation Platform

> **A location-aware donation network connecting donors and seekers within dynamic ranges (5km - 50km) in real-time.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![React Native](https://img.shields.io/badge/React_Native-Expo-blue)](https://reactnative.dev/) [![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://nodejs.org/) [![MongoDB](https://img.shields.io/badge/MongoDB-Geospatial-forestgreen)](https://www.mongodb.com/) [![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-black)](https://socket.io/)

---

## 📱 Live Demo

- **🎥 Video Demo:** [YouTube](https://www.youtube.com/watch?v=Iv-OQy9J9Gw)

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

### 👨‍💻 Author

**Abhijit Paul**

- [LinkedIn](https://linkedin.com/in/thexeromin)
- [Email](mailto:thexeromin@gmail.com)
