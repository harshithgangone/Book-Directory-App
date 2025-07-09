# Book Directory App

# 🛠️ Full Stack Web Application

This is a full-stack project built with:

- ⚛️ **Frontend:** React + Vite
- 🚀 **Backend:** Node.js + Express

---

## 📁 Project Structure

```
root/
├── frontend/     # React + Vite frontend
└── backend/      # Node.js + Express backend
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- npm or yarn

---

## 🔧 Installation & Running

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

This will start the React app at `http://localhost:5173/` by default.

---

### 3. Setup Backend

```bash
cd backend
npm install
npm run start
```

This will start the backend server (Express) at `http://localhost:3000/` or whichever port you define.

---

## 🌐 Environment Variables

Create a `.env` file inside the `backend/` directory and add required environment variables like:

```
PORT=3000
MONGODB_URI=your_mongo_connection_string
```

---

## ✅ Scripts Overview

### Frontend

- `npm run dev` – Start Vite dev server
- `npm run build` – Build frontend for production
- `npm run preview` – Preview the production build

### Backend

- `npm start` – Start the server (default)
- `npm run dev` – Start with nodemon (if configured)

---

## 📦 Deployment

To deploy, build the frontend and serve it from the backend or host them separately.

---

## 🙌 Contribution

Feel free to fork and submit pull requests. For major changes, please open an issue first to discuss.

---

## 📄 License

[MIT](LICENSE)

---
```
