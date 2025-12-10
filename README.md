# MyTradePlatform 🚢

A complete platform for sports equipment trading with secure escrow system and integrated shipping management. Built with React + NestJS.

> Proyecto iniciado en 2025

## 🚀 Features

- **Secure Trading**: Stripe Connect escrow system to protect transactions
- **Shipping Management**: Shippo integration for shipping labels and tracking
- **Real-time Chat**: Direct communication between users
- **Notification System**: Alerts and status updates
- **User Profiles**: Complete profile and reputation management
- **Dispute System**: Integrated conflict resolution

## 🛠️ Technologies

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **SCSS** for styling
- **React Router** for navigation
- **Axios** for HTTP requests
- **React Toastify** for notifications

### Backend
- **NestJS** with TypeScript
- **Prisma** as ORM
- **PostgreSQL** as database
- **JWT** for authentication
- **Stripe Connect** for payments
- **Shippo API** for shipping
- **Supabase** for image storage

## 📁 Project Structure

```
MyTradePlatform/
├── mytradeplatform-frontend/    # React Frontend
├── mytradeplatform-backend/     # NestJS Backend
└── README.md
```

## 🚀 Installation and Setup

### Prerequisites
- Node.js 18+
- PostgreSQL
- Docker (optional)

### Backend

1. Navigate to the backend directory:
```bash
cd mytradeplatform-backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Setup database:
```bash
# Start PostgreSQL with Docker
docker-compose up db -d

# Run migrations
npx prisma migrate dev
npx prisma generate
```

5. Start the server:
```bash
npm run start:dev
```

### Frontend

1. Navigate to the frontend directory:
```bash
cd mytradeplatform-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mytradeplatformdb"
DATABASE_DIRECT_URL="postgresql://user:password@localhost:5432/mytradeplatformdb"

# JWT
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="7d"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
SUPABASE_ITEMS_BUCKET="trade-items"

# Shippo
SHIPPO_API_KEY="shippo_test_..."

# URLs
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:3000"
API_BASE_URL="http://localhost:3000/api"
```

## 📱 Main Features

### For Users
- **Registration and Login**: Complete authentication system
- **Publish Items**: Upload photos and descriptions of items
- **Search Items**: Browse and filter available items
- **Make Offers**: Propose trades with other users
- **Chat**: Direct communication with other users
- **Shipping Tracking**: Monitor shipping status

### For Administrators
- **Dispute Management**: Resolve conflicts between users
- **Moderation**: Review and approve content
- **Statistics**: Dashboard with system metrics

## 🔒 Security

- JWT authentication with refresh tokens
- Data validation with DTOs
- Route protection with guards
- Password encryption with bcrypt
- Supabase security policies

## 📦 Deployment

### Backend
The backend can be deployed with:
- PostgreSQL database
- Configured environment variables
- Process managers like PM2 or containerized with Docker

### Frontend
The frontend can be deployed on platforms like:
- Vercel
- Netlify
- AWS S3
- Or any static hosting service

## 🤝 Contributing

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Shippo for the shipping API
- Stripe for the payment system
- Supabase for file storage
- The React and NestJS community

---

**MyTradePlatform** - Where athletes trade with confidence 🏌️‍♂️⚽🏀
