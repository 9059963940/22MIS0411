# CampusLink-Priority: Real-Time Intelligent Notification Dashboard

An enterprise-grade, real-time campus notification portal built as part of the **Afford Medical Technologies Placement Evaluation Pipeline**. This application ingests complex notification payloads from a remote campus server, dynamically sorts them using a deterministic weighted priority scheduling engine, and manages state streams across asynchronous REST API fetches and non-blocking real-time WebSockets.

---

## 🧑‍💻 Candidate & Submission Metadata
* **Student Name:** seelam deepika
* **Registration / Roll Number:** 22MIS0411
* **Academic Institution:** Vellore Institute of Technology (VIT)
* **Target Role:** Software Development Engineer (SDE) Track
* **Evaluation Context:** Afford Medical Technologies Technical Screening

---

## 🚀 Core Features & Architecture

### 1. Stage 1: Deterministic Priority Sorting Architecture
Implemented a rigorous priority scoring model inside a decoupled engine (`stage1_priority.js`). Messages are categorized and ranked using explicit operational weights combined with deep epoch timestamp comparisons:
* 🔴 **Placement Updates (Weight: 3):** Urgent career opportunities, interview shortlists, and company updates.
* 🟡 **Result Announcements (Weight: 2):** Academic grade sheets, exam schedules, and pass logs.
* 🔵 **General Campus Events (Weight: 1):** Cultural forums, guest lectures, and standard announcements.

If weights match perfectly, the system breaks ties gracefully by ordering the stream chronologically based on precise ISO-8601 server timestamps.

### 2. Stage 2: Telemetry Logging & Interactive Component State
* Fully tracked user interaction via a granular state machine managing unique event hashes (`viewedIds`).
* Integrated custom tracking middleware (`logger.js`) to record interaction footprints seamlessly.
* Optimized card layouts using Material-UI (`@mui/material`), updating left-accent border weights, text styles, and unread badge visibility dynamically upon user clicks.

### 3. Stage 3: Real-Time WebSocket Streaming Engine
* Implemented a permanent event loop listener tracking `ws://4.224.186.213/evaluation-service/ws`.
* Configured real-time frame parsers to push live incoming socket alerts smoothly to the top of the prioritized view state without triggering complete virtual DOM layout redraws or manual webpage refreshes.

---

## 🛠️ Technology Stack
* **Frontend Framework:** React.js (Hooks architecture)
* **Design & Layout Components:** Material-UI (MUI v5)
* **Network Communication:** Native Fetch API & HTML5 WebSocket Web API
* **Version Control:** Git & GitHub

---

## 📂 Project Directory Structure
```text
notification_app_fe/
├── public/                 # Static asset manifests and index.html
├── src/
│   ├── App.js              # Primary state hub, API fetches, and WebSocket streams
│   ├── stage1_priority.js  # Campus priority logic and sorting matrices
│   ├── logger.js           # Interactive tracking middleware logs
│   ├── index.js            # Virtual DOM entry pointer
└── README.md               # Engineering documentation (this file)
