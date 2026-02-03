<div align="center">
  <img src="public/icon.png" alt="Equip View Logo" width="100" />
  <h1>Equip View</h1>
  
  <p>
    <strong>A Modern Chemical Visualization & Equipment Dashboard</strong>
  </p>

  <p>
    <a href="https://chemview.web.app">View Live Demo</a>
    ·
    <a href="https://github.com/TanushriS/EQUIP-VIEW/issues">Report Bug</a>
    ·
    <a href="https://github.com/TanushriS/EQUIP-VIEW/issues">Request Feature</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  </p>
</div>

<br />

## 📋 About The Project

**Equip View** (deployed as *ChemView*) is a state-of-the-art dashboard application designed for tracking and visualizing chemical equipment data. Built with performance and user experience in mind, it leverages the latest web technologies to provide a seamless, secure, and responsive environment.

### ✨ Key Features

- **📍 Robust Location Services**: Automatically detects user location using the browser's Geolocation API with high accuracy, featuring a smart fallback to IP-based detection using `ipapi.co` and reverse geocoding via OpenStreetMap.
- **🔐 Secure Authentication**: Enterprise-grade security powered by Firebase Auth. Supports both classic Email/Password login and seamless **Google Sign-In**.
- **🎨 Modern Aesthetic**: A clean, "glassmorphic" UI built with **Shadcn/UI** and **Tailwind CSS** that looks stunning on any device.
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile screens with smooth transitions and intuitive navigation.
- **⚡ Lightning Fast**: Powered by **Vite** for instant load times and hot module replacement.

---

## 🚀 Live Demo

Check out the live application running on Firebase Hosting:
<br />
👉 **[https://chemview.web.app](https://chemview.web.app)**

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/UI, Lucide React (Icons)
- **Backend / Services**: Firebase (Authentication, Hosting)
- **State Management**: React Context API
- **Routing**: React Router DOM

---

## 💻 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/TanushriS/EQUIP-VIEW.git
    cd EQUIP-VIEW
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    - Rename `.env.example` to `.env`
    - Add your Firebase configuration keys:
    ```env
    VITE_FIREBASE_API_KEY=your_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    ...
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Build for production**
    ```bash
    npm run build
    ```

---

## 🛡️ Security

This project follows best, modern security practices:
- **API Keys**: Stored in environment variables (`.env`), not in the codebase.
- **Protected Routes**: Authentication context ensures sensitive pages are only accessible to logged-in users.
- **Type Safety**: Full TypeScript implementation to prevent runtime errors.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>Made with ❤️ by Tanushri</p>
</div>
