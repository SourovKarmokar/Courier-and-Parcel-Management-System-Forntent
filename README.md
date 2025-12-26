🚚 Courier & Parcel Management System – Frontend

A modern, responsive React-based frontend application for a Courier & Parcel Management System.
This application provides role-based dashboards for Admin, Customer, and Delivery Agent, with real-time tracking, parcel management, and analytics.

🔗 Live Demo

👉 Frontend URL: (Add your Vercel / Netlify link here)
Example:

https://courierpro-frontend.vercel.app

📂 Repository Structure
frontend/
│
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page-level components (Dashboards, Auth, etc.)
│   ├── redux/             # Redux Toolkit store & slices
│   ├── socket/            # Socket.IO client setup
│   ├── routes/            # Protected & role-based routes
│   ├── utils/             # Helper functions
│   ├── App.jsx            # Root component
│   └── main.jsx           # Entry point
│
├── public/
├── .env                   # Environment variables
├── package.json
└── README.md

🧑‍💻 User Roles & Features
👤 Customer

Register & Login

Book parcel pickup

View booking history

Track parcel status in real-time

Live delivery location on map (Leaflet / Google Maps)

View assigned delivery agent

🚚 Delivery Agent

Login as agent

View assigned parcels

Update parcel status:

Picked Up

In Transit

Delivered

Failed

Share live location (real-time)

👑 Admin

Secure admin dashboard

View all parcels & users

Assign delivery agents

Monitor parcel statuses

View business reports:

Total parcels

Delivered / Pending parcels

Total delivery amount

Export reports (CSV / PDF)

Role management (Admin / Agent / Customer)

⚙️ Tech Stack

React 18

Redux Toolkit – state management

React Router DOM – routing

Tailwind CSS – responsive UI

Axios – API communication

Socket.IO Client – real-time updates

Leaflet / Google Maps – live tracking & map view

📦 Installed NPM Packages
npm install react-router-dom
npm install @reduxjs/toolkit react-redux
npm install axios
npm install socket.io-client
npm install leaflet react-leaflet
npm install @react-google-maps/api   # (optional)
npm install recharts                 # charts (admin dashboard)

🔐 Environment Variables

Create a .env file in the root directory:

VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAP_API_KEY


⚠️ Never commit .env files to GitHub

▶️ How to Run Locally
1️⃣ Clone the Repository
git clone https://github.com/your-username/courier-frontend.git
cd courier-frontend

2️⃣ Install Dependencies
npm install

3️⃣ Start Development Server
npm run dev


Frontend will run at:

http://localhost:5173

🔄 Real-Time Features (Socket.IO)

Parcel status updates (Admin → Customer)

Live agent location tracking

Automatic UI updates without refresh

Socket connection is initialized once and shared across components.

🗺️ Map & Live Tracking

Live delivery location shown on map

Marker updates in real-time

Route visualization (optional)

Fallback location shown when live data unavailable

🎨 UI & UX Highlights

Fully responsive (mobile, tablet, desktop)

Role-based dashboards

Clean professional layout

Status badges with color indicators

Modern card & table design

🚀 Deployment
Frontend Hosting

You can deploy using:

Vercel (recommended)

Netlify

Build command:

npm run build


Output directory:

dist/

📄 Related Deliverables

✅ Backend API (Node.js + Express)

✅ Postman Collection

✅ Final PDF Report

✅ Video Demo

✅ GitHub Documentation

👨‍💼 Author

Name: Your Name
Email: your-email@example.com

GitHub: https://github.com/SourovKarmokar/

LinkedIn: https://www.linkedin.com/in/sourov-karmokar/

🏁 Conclusion

This frontend application demonstrates a real-world courier management system with modern React practices, real-time communication, role-based access control, and professional UI/UX—suitable for job assessment, academic submission, or production use.



