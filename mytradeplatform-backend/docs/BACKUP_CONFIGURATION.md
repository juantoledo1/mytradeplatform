# 🔧 Configuración de Respaldo - MyTradePlatform

## ⚠️ IMPORTANTE
Este archivo contiene todas las configuraciones y keys del proyecto actual. 
**MANTENER CONFIDENCIAL** - No subir a repositorios públicos.

---

## 🔑 KEYS Y CONFIGURACIONES ACTUALES

### 1. Base de Datos (PostgreSQL + Prisma)
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/mytradeplatformdb"
DIRECT_URL="postgresql://username:password@localhost:5432/mytradeplatformdb"

# Prisma Configuration
PRISMA_GENERATE_DATAPROXY="false"
```

### 2. JWT Authentication
```env
# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
```

### 3. Supabase (Actual)
```env
# Supabase Configuration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Stripe Connect (Nuevo)
```env
# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_51234567890abcdef..."
STRIPE_PUBLISHABLE_KEY="pk_test_51234567890abcdef..."
STRIPE_WEBHOOK_SECRET="whsec_1234567890abcdef..."
STRIPE_CONNECT_CLIENT_ID="ca_1234567890abcdef..."

# Stripe Test Cards
STRIPE_TEST_CARD_VISA="4242424242424242"
STRIPE_TEST_CARD_VISA_DEBIT="4000056655665556"
STRIPE_TEST_CARD_MASTERCARD="5555555555554444"
STRIPE_TEST_CARD_AMEX="378282246310005"
```

### 5. Shippo (Nuevo)
```env
# Shippo Configuration
SHIPPO_API_KEY="shippo_test_1234567890abcdef..."
SHIPPO_WEBHOOK_SECRET="shippo_webhook_secret_1234567890abcdef..."
SHIPPO_TEST_MODE="true"
```

### 6. URLs y Dominios
```env
# Application URLs
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:3000"
API_BASE_URL="http://localhost:3000/api"
WS_URL="ws://localhost:3000"

# Production URLs (cuando esté listo)
PROD_FRONTEND_URL="https://mytradeplatform.com"
PROD_BACKEND_URL="https://api.mytradeplatform.com"
PROD_API_BASE_URL="https://api.mytradeplatform.com/api"
```

### 7. CORS y Seguridad
```env
# CORS Configuration
CORS_ORIGIN="http://localhost:5173,https://mytradeplatform.com"
CORS_CREDENTIALS="true"

# Security
BCRYPT_ROUNDS="12"
RATE_LIMIT_TTL="60"
RATE_LIMIT_MAX="100"
```

---

## 🗄️ CONFIGURACIÓN DE BASE DE DATOS

### 1. Esquema Prisma Actual
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                Int      @id @default(autoincrement())
  email             String   @unique
  username          String   @unique
  firstName         String
  lastName          String
  password          String
  isActive          Boolean  @default(true)
  agreesToTerms     Boolean  @default(false)
  termsAgreedAt     DateTime?
  termsVersion      String   @default("1.0")
  profileCompleted  Boolean  @default(false)
  lastLogin         DateTime?
  stripeAccountId   String?  // Nueva columna para Stripe
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relaciones
  profile           UserProfile?
  items             Item[]
  tradesOffered     Trade[] @relation("TraderOffering")
  tradesReceived    Trade[] @relation("TraderReceiving")
  chatMessages      ChatMessage[]
  chatParticipants  ChatParticipant[]
  notifications     Notification[]
  reviews           Review[]
  ratings           TradeRating[]
  payments          Payment[]
  shippingLabels    ShippingLabel[]

  @@map("users")
}

model UserProfile {
  id                    Int      @id @default(autoincrement())
  userId                Int      @unique
  phoneNumber           String?
  dateOfBirth           Date?
  bio                   String?
  avatar                String?
  emailNotifications    Boolean  @default(true)
  marketingEmails       Boolean  @default(false)
  city                  String?
  state                 String?
  country               String   @default("US")
  traderSince           DateTime @default(now())
  tradingRating         Float    @default(0.0)
  totalTrades           Int      @default(0)
  successfulTrades      Int      @default(0)
  isVerifiedTrader      Boolean  @default(false)
  traderTier            String   @default("BRONZE")
  specialties           String?
  stripeConnectScore    Float    @default(0.0) // Nueva columna
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_profiles")
}

model Item {
  id                    Int      @id @default(autoincrement())
  name                  String
  description           String
  price                 Decimal  @db.Decimal(10, 2)
  condition             String
  isActive              Boolean  @default(true)
  isAvailableForTrade   Boolean  @default(true)
  minimumTradeValue     Decimal? @db.Decimal(10, 2)
  ownerId               Int
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  // Relaciones
  owner                 User @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  images                ItemImage[]
  interests             ItemInterest[]
  tradesOffered         Trade[] @relation("ItemOffered")
  tradesRequested       Trade[] @relation("ItemRequested")

  @@map("items")
}

model Trade {
  id                    Int      @id @default(autoincrement())
  traderOfferingId      Int
  traderReceivingId     Int
  itemOfferedId         Int
  itemRequestedId       Int?
  cashAmount            Decimal? @db.Decimal(10, 2)
  status                String   @default("PENDING")
  notes                 String?
  escrowReference       String?
  estimatedCompletion   DateTime?
  acceptedAt            DateTime?
  completedAt           DateTime?
  cancelledAt           DateTime?
  trackingNumber        String?  // Nueva columna para Shippo
  shippingCost          Decimal? @db.Decimal(10, 2) // Nueva columna
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  // Relaciones
  traderOffering        User @relation("TraderOffering", fields: [traderOfferingId], references: [id])
  traderReceiving       User @relation("TraderReceiving", fields: [traderReceivingId], references: [id])
  itemOffered           Item @relation("ItemOffered", fields: [itemOfferedId], references: [id])
  itemRequested         Item? @relation("ItemRequested", fields: [itemRequestedId], references: [id])
  payments              Payment[]
  shippingLabels        ShippingLabel[]
  disputes              Dispute[]

  @@map("trades")
}

// Nuevas tablas para Stripe y Shippo
model Payment {
  id                    Int      @id @default(autoincrement())
  tradeId               Int
  userId                Int
  stripePaymentIntentId String?
  stripeAccountId       String?
  amount                Decimal  @db.Decimal(10, 2)
  status                String   @default("PENDING")
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  trade                 Trade @relation(fields: [tradeId], references: [id])
  user                  User @relation(fields: [userId], references: [id])

  @@map("payments")
}

model ShippingLabel {
  id                    Int      @id @default(autoincrement())
  tradeId               Int
  userId                Int
  trackingNumber        String
  labelUrl              String
  carrier               String
  cost                  Decimal  @db.Decimal(10, 2)
  status                String   @default("PENDING")
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  trade                 Trade @relation(fields: [tradeId], references: [id])
  user                  User @relation(fields: [userId], references: [id])

  @@map("shipping_labels")
}

// Resto de modelos existentes...
model ChatMessage {
  id              Int      @id @default(autoincrement())
  conversationId  Int
  senderId        Int
  content         String
  messageType     String   @default("TEXT")
  replyToId       Int?
  createdAt       DateTime @default(now())

  conversation    Conversation @relation(fields: [conversationId], references: [id])
  sender          User @relation(fields: [senderId], references: [id])
  replyTo         ChatMessage? @relation("MessageReply", fields: [replyToId], references: [id])
  replies         ChatMessage[] @relation("MessageReply")

  @@map("chat_messages")
}

model Conversation {
  id              Int      @id @default(autoincrement())
  lastMessageAt   DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  messages        ChatMessage[]
  participants    ChatParticipant[]

  @@map("conversations")
}

model ChatParticipant {
  id              Int      @id @default(autoincrement())
  conversationId  Int
  userId          Int
  isActive        Boolean  @default(true)
  joinedAt        DateTime @default(now())

  conversation    Conversation @relation(fields: [conversationId], references: [id])
  user            User @relation(fields: [userId], references: [id])

  @@unique([conversationId, userId])
  @@map("chat_participants")
}

model Notification {
  id                    Int      @id @default(autoincrement())
  recipientId           Int
  senderId              Int?
  notificationTypeId    Int
  title                 String
  message               String
  contentType           String?
  objectId              String?
  metadata              Json     @default("{}")
  actionUrl             String?
  expiresAt             DateTime?
  markedAsRead          Boolean  @default(false)
  createdAt             DateTime @default(now())

  recipient             User @relation(fields: [recipientId], references: [id])
  sender                User? @relation(fields: [senderId], references: [id])
  notificationType      NotificationType @relation(fields: [notificationTypeId], references: [id])

  @@map("notifications")
}

model NotificationType {
  id                    Int      @id @default(autoincrement())
  name                  String   @unique
  description           String?
  isActive              Boolean  @default(true)
  createdAt             DateTime @default(now())

  notifications         Notification[]

  @@map("notification_types")
}

model Interest {
  id                    Int      @id @default(autoincrement())
  name                  String   @unique
  icon                  String?
  isActive              Boolean  @default(true)
  createdAt             DateTime @default(now())

  items                 ItemInterest[]

  @@map("interests")
}

model ItemInterest {
  id                    Int      @id @default(autoincrement())
  itemId                Int
  interestId            Int

  item                  Item @relation(fields: [itemId], references: [id], onDelete: Cascade)
  interest              Interest @relation(fields: [interestId], references: [id], onDelete: Cascade)

  @@unique([itemId, interestId])
  @@map("item_interests")
}

model ItemImage {
  id                    Int      @id @default(autoincrement())
  itemId                Int
  url                   String
  altText               String?
  isPrimary             Boolean  @default(false)
  order                 Int      @default(0)
  createdAt             DateTime @default(now()

  item                  Item @relation(fields: [itemId], references: [id], onDelete: Cascade)

  @@map("item_images")
}

model Review {
  id                    Int      @id @default(autoincrement())
  tradeId               Int
  reviewerId            Int
  revieweeId            Int
  rating                Int
  comment               String?
  wouldTradeAgain       Boolean
  createdAt             DateTime @default(now()

  trade                 Trade @relation(fields: [tradeId], references: [id])
  reviewer              User @relation(fields: [reviewerId], references: [id])
  reviewee              User @relation(fields: [revieweeId], references: [id])

  @@unique([tradeId, reviewerId])
  @@map("reviews")
}

model TradeRating {
  id                    Int      @id @default(autoincrement())
  tradeId               Int
  raterId               Int
  rateeId               Int
  rating                Int
  comment               String?
  createdAt             DateTime @default(now()

  trade                 Trade @relation(fields: [tradeId], references: [id])
  rater                 User @relation(fields: [raterId], references: [id])
  ratee                 User @relation(fields: [rateeId], references: [id])

  @@unique([tradeId, raterId])
  @@map("trade_ratings")
}

model Dispute {
  id                    Int      @id @default(autoincrement())
  tradeId               Int
  complainantId         Int
  reason                String
  description           String
  status                String   @default("OPEN")
  resolution            String?
  resolvedAt            DateTime?
  createdAt             DateTime @default(now()
  updatedAt             DateTime @updatedAt

  trade                 Trade @relation(fields: [tradeId], references: [id])
  complainant           User @relation(fields: [complainantId], references: [id])

  @@map("disputes")
}
```

---

## 🔧 CONFIGURACIÓN DE SERVICIOS

### 1. Configuración de NestJS
```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TradeModule } from './trade/trade.module';
import { ChatModule } from './chat/chat.module';
import { NotificationModule } from './notification/notification.module';
import { PaymentModule } from './payment/payment.module';
import { ShippingModule } from './shipping/shipping.module';
import { DisputeModule } from './dispute/dispute.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    TradeModule,
    ChatModule,
    NotificationModule,
    PaymentModule,
    ShippingModule,
    DisputeModule,
  ],
})
export class AppModule {}
```

### 2. Configuración de CORS
```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS Configuration
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://mytradeplatform.com',
      process.env.FRONTEND_URL
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('MyTradePlatform API')
    .setDescription('API para sistema de intercambio de items')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // WebSocket Support
  app.enableShutdownHooks();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
```

---

## 🧪 DATOS DE PRUEBA

### 1. Usuarios de Prueba
```sql
-- Insertar usuarios de prueba
INSERT INTO users (email, username, "firstName", "lastName", password, "isActive", "agreesToTerms", "profileCompleted") VALUES
('seller@test.com', 'seller', 'John', 'Doe', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4QZ8K2', true, true, true),
('buyer@test.com', 'buyer', 'Jane', 'Smith', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4QZ8K2', true, true, true);

-- Insertar perfiles
INSERT INTO user_profiles ("userId", bio, city, state, country) VALUES
(1, 'Experienced trader', 'New York', 'NY', 'US'),
(2, 'New to trading', 'Los Angeles', 'CA', 'US');
```

### 2. Items de Prueba
```sql
-- Insertar items de prueba
INSERT INTO items (name, description, price, condition, "ownerId", "isActive", "isAvailableForTrade") VALUES
('iPhone 13 Pro', 'Excellent condition, 128GB', 800.00, 'Excellent', 1, true, true),
('MacBook Pro M1', 'Like new, 16GB RAM', 1200.00, 'Like New', 1, true, true),
('Samsung Galaxy S21', 'Good condition, 256GB', 600.00, 'Good', 2, true, true),
('Dell XPS 13', 'Very good condition', 900.00, 'Very Good', 2, true, true);
```

### 3. Intereses de Prueba
```sql
-- Insertar intereses
INSERT INTO interests (name, icon, "isActive") VALUES
('Electronics', '📱', true),
('Computers', '💻', true),
('Gaming', '🎮', true),
('Photography', '📷', true),
('Music', '🎵', true);
```

---

## 🔄 MIGRACIONES NECESARIAS

### 1. Migración para Stripe
```sql
-- Agregar columnas de Stripe
ALTER TABLE users ADD COLUMN "stripeAccountId" VARCHAR(255);
ALTER TABLE user_profiles ADD COLUMN "stripeConnectScore" DECIMAL(3,2) DEFAULT 0.0;

-- Crear tabla de pagos
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  "tradeId" INTEGER REFERENCES trades(id),
  "userId" INTEGER REFERENCES users(id),
  "stripePaymentIntentId" VARCHAR(255),
  "stripeAccountId" VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

### 2. Migración para Shippo
```sql
-- Agregar columnas de envío a trades
ALTER TABLE trades ADD COLUMN "trackingNumber" VARCHAR(255);
ALTER TABLE trades ADD COLUMN "shippingCost" DECIMAL(10,2);

-- Crear tabla de etiquetas de envío
CREATE TABLE shipping_labels (
  id SERIAL PRIMARY KEY,
  "tradeId" INTEGER REFERENCES trades(id),
  "userId" INTEGER REFERENCES users(id),
  "trackingNumber" VARCHAR(255) NOT NULL,
  "labelUrl" TEXT NOT NULL,
  carrier VARCHAR(100) NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 COMANDOS DE DESARROLLO

### 1. Comandos de Base de Datos
```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Resetear base de datos
npx prisma migrate reset

# Ver base de datos
npx prisma studio

# Seed de datos
npx prisma db seed
```

### 2. Comandos de Desarrollo
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run start:dev

# Build
npm run build

# Producción
npm run start:prod

# Tests
npm run test
npm run test:e2e
```

### 3. Comandos de Stripe
```bash
# Instalar CLI de Stripe
npm install -g @stripe/stripe-cli

# Login a Stripe
stripe login

# Escuchar webhooks localmente
stripe listen --forward-to localhost:3000/api/payment/webhook
```

---

## 📋 CHECKLIST DE CONFIGURACIÓN

### Backend
- [ ] Variables de entorno configuradas
- [ ] Base de datos PostgreSQL funcionando
- [ ] Prisma configurado y migrado
- [ ] Stripe Connect configurado
- [ ] Shippo configurado
- [ ] WebSocket funcionando
- [ ] CORS configurado
- [ ] Swagger documentación

### Frontend
- [ ] Variables de entorno configuradas
- [ ] Stripe Elements configurado
- [ ] WebSocket client configurado
- [ ] API client configurado
- [ ] Hooks personalizados creados
- [ ] Componentes de pago creados
- [ ] Componentes de envío creados

### Testing
- [ ] Usuarios de prueba creados
- [ ] Items de prueba creados
- [ ] Flujo completo probado
- [ ] Stripe test cards funcionando
- [ ] Shippo test labels funcionando

---

## 🆘 TROUBLESHOOTING

### Problemas Comunes

1. **Error de conexión a base de datos**
   ```bash
   # Verificar que PostgreSQL esté corriendo
   sudo service postgresql status
   
   # Verificar conexión
   npx prisma db pull
   ```

2. **Error de Stripe**
   ```bash
   # Verificar keys
   stripe balance retrieve
   
   # Verificar webhooks
   stripe events list --limit 10
   ```

3. **Error de Shippo**
   ```bash
   # Verificar API key
   curl -H "Authorization: ShippoToken YOUR_API_KEY" https://api.goshippo.com/addresses/
   ```

4. **Error de WebSocket**
   ```bash
   # Verificar que el puerto esté libre
   netstat -tulpn | grep :3000
   ```

---

## 📞 CONTACTOS DE SOPORTE

- **Stripe Support:** https://support.stripe.com
- **Shippo Support:** https://goshippo.com/support/
- **Supabase Support:** https://supabase.com/support
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

*Configuración de respaldo creada el: $(date)*
*Versión: 1.0*
*Proyecto: MyTradePlatform*
