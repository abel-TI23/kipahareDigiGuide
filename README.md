# 🏛️ Ki Pahare DigiGuide

**Digital Museum Collection - Sundanese Cultural Heritage**

A modern web application for exploring and managing Sundanese cultural artifacts with QR code integration and admin management system.

---



## ✨ **Features**

### 🔐 Authentication System
- User registration with validation
- Secure login system
- Password hashing with bcryptjs
- Duplicate email/username checking

### 📦 CRUD Operations
- **Create:** Add new artifacts with complete information
- **Read:** Browse artifacts with search and category filters
- **Update:** Edit existing artifact data
- **Delete:** Remove artifacts with confirmation dialog

### 🎨 User Interface
- Museum-themed design (Ki Pahare branding)
- Responsive layout (mobile & desktop)
- Toast notifications for user feedback
- Confirmation modals for critical actions
- Search and filter functionality

### 🗄️ Database
- Supabase PostgreSQL integration
- Persistent data storage
- Row Level Security (RLS)
- Real-time data synchronization

---

## 🛠️ **Tech Stack**

- **Framework:** Next.js 16.0.0 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL)
- **Authentication:** bcryptjs
- **Deployment:** Vercel

---

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ installed
- Supabase account
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/abel-TI23/kipahareDigiGuide.git
cd kipahareDigiGuide
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**

Create `.env.local` file:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

4. **Setup Supabase Database**

Go to Supabase SQL Editor and run:
```sql
-- See PROJECT_DOCUMENTATION_EN.md for complete SQL schema
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 **Project Structure**

```
app/
├── (auth)/              # Authentication pages
├── admin/               # Admin dashboard & CRUD
├── api/                 # API routes
└── page.tsx            # Homepage

components/
├── ui/                 # UI components (Toast, Modal)
└── artifacts/          # Artifact components

lib/
├── supabase.ts         # Database client
├── dummy-data.ts       # Static data
└── utils.ts            # Helper functions
```

---

## 📚 **Documentation**

- [Setup Guide](SETUP.md)
- [Project Documentation (ID)](PROJECT_DOCUMENTATION.md)
- [Project Documentation (EN)](PROJECT_DOCUMENTATION_EN.md)
- [Project Status](PROJECT_STATUS.md)

---

## 🎓 **Academic Project**

**Course:** Web Based Application Development  
**Session:** 11 - Routing and URL Handling  
**Institution:** Nusa Putra University  
**Lecturer:** Anggun Pergina, M.Kom

**Assignment Requirements:**
1. ✅ Create authentication system (login + register)
2. ✅ Implement CRUD operations
3. ✅ Use proper routing structure
4. ✅ Submit documentation in PDF

---

## 👨‍💻 **Author**

**Abel-TI23**  
Nusa Putra University

---

## 📄 **License**

This project is created for educational purposes.

---

## 🙏 **Acknowledgments**

- Nusa Putra University
- Anggun Pergina, M.Kom (Lecturer)
- Supabase for database hosting
- Vercel for deployment platform
