# 🏛️ Tipahare DigiGuide - Setup Guide

## 🎯 Project Overview

A modern QR code-based digital museum guide system built with Next.js 16, TypeScript, and Tailwind CSS.

**Timeline**: 6 weeks | **Budget**: IDR 3,500,000 | **Team**: 4 developers

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd tipahare-digiguide
npm install --legacy-peer-deps
```

### 2. Setup Environment Variables

Create `.env.local` file:

```env
# Database (Get from Vercel Postgres)
POSTGRES_URL="your_postgres_connection_string"
POSTGRES_URL_NON_POOLING="your_postgres_non_pooling_string"

# Auth (Generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your_secret_key_here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Initialize Database

Start the development server:
```bash
npm run dev
```

Initialize database by making a POST request to:
```
http://localhost:3000/api/init-db
```

You can use curl:
```bash
curl -X POST http://localhost:3000/api/init-db
```

This creates all tables and seeds the admin user.

**Default Admin Credentials**:
- Username: `admin`
- Password: `admin123`

### 4. Access the Application

- **Homepage**: http://localhost:3000
- **Admin Login**: http://localhost:3000/login
- **QR Scanner**: http://localhost:3000/scan

## 📁 Project Structure

```
tipahare-digiguide/
├── app/
│   ├── (auth)/login/       # Admin login
│   ├── (auth)/admin/       # Admin dashboard
│   ├── artifacts/[id]/     # Artifact details
│   ├── scan/               # QR scanner
│   └── api/                # API endpoints
├── components/             # React components
├── lib/                    # Utilities & config
├── types/                  # TypeScript types
└── public/                 # Static files
```

## 🔧 Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Vercel Postgres
- **Auth**: NextAuth.js
- **QR**: qrcode + html5-qrcode

## 📝 API Endpoints

### Artifacts
- `GET /api/artifacts` - List all
- `POST /api/artifacts` - Create new
- `GET /api/artifacts/[id]` - Get one
- `PUT /api/artifacts/[id]` - Update
- `DELETE /api/artifacts/[id]` - Delete

### QR Codes
- `GET /api/qr-codes` - List all
- `POST /api/qr-codes` - Generate new

### Feedback
- `GET /api/feedback` - List all
- `POST /api/feedback` - Submit new

## 🎨 Features

✅ Mobile-first responsive design  
✅ QR code scanning with camera  
✅ Offline PWA capability  
✅ Admin dashboard for CRUD  
✅ Visitor feedback system  
✅ Multimedia content (images + audio)

## 🚢 Deployment to Vercel

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git push
```

2. **Deploy**:
   - Go to vercel.com
   - Import repository
   - Add environment variables
   - Deploy!

## 🔒 Security Notes

- Change default admin password immediately
- Keep `NEXTAUTH_SECRET` secure
- Never commit `.env.local` to git
- Use HTTPS in production

## 📱 Mobile Testing

Test on actual devices:
- iOS Safari (iPhone)
- Android Chrome
- Camera permissions
- QR scanning accuracy

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `POSTGRES_URL` in `.env.local`
- Check Vercel Postgres dashboard
- Ensure database is active

### NextAuth Errors
- Regenerate `NEXTAUTH_SECRET`
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies

### QR Scanner Not Working
- Allow camera permissions
- Use HTTPS (required for camera)
- Test on actual mobile device

## 📚 Next Steps

1. ✅ Initialize database
2. 🔄 Create admin login page
3. 🔄 Build admin dashboard
4. 🔄 Implement QR scanner
5. 🔄 Create artifact pages
6. 🔄 Add PWA features
7. 🔄 Deploy to production

## 👥 Team

For questions, contact the development team.

---

**Built with ❤️ for cultural heritage preservation**
