# Algorithmic Trading Platform (MERN Stack)

This project is a **full-stack MERN application** for **algorithmic trading**, featuring **user authentication with OTP verification**, **resource management**, and **chat functionalities**.

## **Features**

✅ **User Authentication** (Signup, Login, OTP Verification, JWT)
✅ **Email-based OTP Verification** (via Nodemailer)
✅ **Secure Password Hashing** (via bcrypt)
✅ **MongoDB for Data Storage**
✅ **Stock Price Prediction (LLM-based)**
✅ **Resource Page for Trading Information**
✅ **Real-time Chat System**
✅ **Fully Responsive Frontend (React.js)**

---

## **Tech Stack**

- **Frontend:** React.js, Context API, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT, bcrypt, Nodemailer (for OTP)
- **Deployment:** Heroku (Backend), Netlify (Frontend)

---

## **Getting Started**

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/opsatya/algo-trade.git
cd HACKATHON/app
```

### **2️⃣ Install Dependencies**
#### Backend
```sh
cd server
npm install
```
#### Frontend
```sh
cd ../client
npm install
```

### **3️⃣ Setup Environment Variables**
Create a `.env` file inside the **backend** folder with the following:
```ini
PORT=5000
MONGO_URI=mongodb+srv://your_mongodb_url
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=your-email@gmail.com
OTP_EXPIRY_MINUTES=3
```
---

## **Running the Application**

### **Backend (Express.js + MongoDB)**
```sh
cd server
npm run dev
```
Your backend should run at: `http://localhost:5000`

### **Frontend (React.js)**
```sh
cd frontend
npm start
```
Your frontend should run at: `http://localhost:5173`

---

## **API Endpoints**
### **1️⃣ Authentication APIs**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | User registration & OTP send |
| `/api/auth/verify-otp` | POST | Verify OTP & activate account |
| `/api/auth/login` | POST | User login & JWT token generation |

### **2️⃣ Chat APIs**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat/send-message` | POST | Send chat message |
| `/api/chat/get-messages` | GET | Fetch chat messages |

### **3️⃣ Resource APIs**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/resources/add` | POST | Add trading resources |
| `/api/resources/get` | GET | Fetch resources |

---

## **Authentication Flow**
1. **Signup:** User registers with **name, email, password**.
2. **OTP Verification:** User receives an OTP via email & verifies it.
3. **Login:** User logs in with **email & password**.
4. **JWT Token:** On successful login, a **JWT token** is generated for authentication.
5. **Access Protected Routes:** User accesses the dashboard, chat, and trading resources.

---

## **Deployment**

### **Backend Deployment (Heroku)**
1. Push your backend code to GitHub.
2. Deploy to **Heroku**.
3. Set **environment variables** in the deployment platform.

### **Frontend Deployment (Netlify)**
1. Push your frontend code to GitHub.
2. Deploy to **Netlify**.
3. Set the **backend API URL** inside `frontend/src/config.js`.

---

## **Contributing**
- Feel free to fork and submit pull requests!
- Open issues for bug reports & feature requests.

---

## **License**
MIT License. Use freely! 🚀

