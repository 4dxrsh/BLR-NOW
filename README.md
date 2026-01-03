# 📍 BLR-NOW: Hyperlocal Event Notice Board

**BLR-NOW** is a map-first, real-time community notice board built with the **MERN Stack**. It is designed to bridge the "hyperlocal disconnect" by allowing residents of Bengaluru to discover and host spontaneous, community-driven events—from pickup football games to pop-up art workshops—happening right outside their door.

---

## 🚀 The Core Vision

In an era of global hyper-connectivity, we are becoming increasingly disconnected from our own neighborhoods. Crucial local information is often trapped in fragmented silos like private WhatsApp groups or Instagram stories. **BLR-NOW** breaks these silos by providing a single, visual, and real-time platform for the "now" of your community.

---

## ✨ Key Features

* **Map-First Discovery:** An interactive Leaflet-powered map that populates event markers based on your current location.
* **Geospatial Search:** Find events within a specific radius using MongoDB’s native **2dsphere** indexing and `$near` queries.
* **Instant Event Hosting:** A streamlined flow for creators to pin a location, add rules, and publish events for the next day onwards.
* **Address Geocoding:** Integrated **Nominatim API** for forward and reverse geocoding (searching by address or clicking the map).
* **Smart RSVP System:** Real-time attendance tracking and automatic migration of past events to "Attended" status in user profiles.
* **Secure Authentication:** JWT-based authentication with password hashing via `bcryptjs`.

---

## 🛠️ Tech Stack

### Frontend

* **React.js:** Single Page Application (SPA) architecture.
* **React Leaflet:** Interactive map integration.
* **Axios:** Asynchronous API handling.
* **React Context API:** Global state management for user authentication.

### Backend

* **Node.js & Express.js:** Robust RESTful API construction.
* **MongoDB:** NoSQL database chosen for its powerful **Geospatial querying** capabilities.
* **Mongoose:** Object Data Modeling (ODM).

### Security

* **JSON Web Tokens (JWT):** Secure state-less authentication.
* **Bcryptjs:** Industry-standard password hashing.

---

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/blr-now.git
cd blr-now

```

### 2. Backend Setup

```bash
cd server
npm install

```

* Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

```


* Start the server:

```bash
npm start

```

### 3. Frontend Setup

```bash
cd client
npm install
npm start

```

---

## 🗺️ How the Geospatial Logic Works (For Viva Preparation)

The heart of this project lies in the **2dsphere index**.

1. **Storage:** Events are stored as **GeoJSON** points: `location: { type: "Point", coordinates: [lng, lat] }`.
2. **Indexing:** We run `Event.collection.createIndex({ location: "2dsphere" })` to allow distance-based calculations.
3. **Querying:** We use the `$near` operator to fetch events within a `maxDistance` of the user’s viewport coordinates.

---

## 👥 The Creators

* **Adarsh Rajesh**
* **Abhinav Agraharam**
* **Aadhavan Muthusamy**

---
