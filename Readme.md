# 🌍 Traveloop — Personalized Travel Planning Platform

Traveloop is a modern full-stack travel planning application that helps users create personalized multi-city itineraries, manage travel budgets, organize activities, and collaborate on trips.

---

# ✨ Features

## 🔐 Authentication
- User Signup & Login
- JWT Authentication
- Protected Routes
- User Profiles

## 🧳 Trip Planning
- Create and manage trips
- Multi-city itinerary builder
- Day-wise planning
- Add trip descriptions and travel dates

## 🌆 Destinations
- Explore destinations
- Destination detail pages
- Popular cities
- Destination cards with images

## 🎯 Activities
- Browse activities
- Add activities to trips
- Activity categories
- Cost estimation

## 💰 Budget Management
- Expense tracking
- Budget breakdown
- Estimated trip costs
- Spending analytics

## 📝 Notes & Packing
- Travel notes
- Packing checklist
- Organize travel essentials

## 🌐 Community
- Shared itineraries
- Community travel posts
- Public trip sharing

## 📊 Admin Dashboard
- User analytics
- Trip analytics
- Revenue overview
- Popular cities & activities
- Dynamic charts

---

# 🛠️ Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- Framer Motion
- React Router DOM
- Axios
- Recharts
- Lucide Icons

## Backend
- Django
- Django REST Framework
- Simple JWT
- SQLite

---

# 📂 Project Structure

```bash
traveloop/
│
├── backend/              # Django backend
│   ├── api/
│   ├── traveloop/
│   └── manage.py
│
├── src/                  # React frontend
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   └── assets/
│
├── public/
├── package.json
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/khushboocodes/Traveloop.git
cd traveloop
```

---

# 🚀 Frontend Setup

```bash
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🚀 Backend Setup

## Create Virtual Environment

```bash
cd backend

python -m venv venv
```

## Activate Virtual Environment

### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

---

## Install Backend Dependencies

Install the required Python packages manually:

```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers pillow
```
---

## Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Create Superuser

```bash
python manage.py createsuperuser
```

---

## Start Backend

```bash
python manage.py runserver
```

Backend runs on:

```bash
http://127.0.0.1:8000
```

---

# 🔑 Admin Panel

```bash
http://127.0.0.1:8000/admin
```

---

# 📡 API Endpoints

| Endpoint | Description |
|---|---|
| `/api/auth/login/` | User login |
| `/api/auth/register/` | User registration |
| `/api/destinations/` | Destinations |
| `/api/activities/` | Activities |
| `/api/trips/` | Trips |
| `/api/expenses/` | Expenses |
| `/api/community/` | Community posts |
| `/api/admin/stats/` | Admin analytics |

---

# 🎨 UI Design

- Modern SaaS-style interface
- Light theme UI
- Responsive design
- Smooth animations
- Interactive cards and dashboards

---

# 🔮 Future Improvements

- AI-powered itinerary suggestions
- Google Maps integration
- Hotel & flight APIs
- Real-time collaboration
- Mobile app version
- Payment integration

---

# 👨‍💻 Author

### Khushboo Khator
### Harshvardhan Singh Bhadoria

---

# 📄 License

This project is for educational and hackathon purposes.
