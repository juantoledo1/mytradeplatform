# 🎨 Guía de Integración Frontend - MyTradePlatform

## 📋 Resumen
Esta guía contiene toda la información necesaria para integrar un nuevo frontend con el backend de MyTradePlatform, incluyendo Stripe Connect y Shippo.

---

## 🔌 ENDPOINTS PRINCIPALES

### Autenticación
```typescript
// Base URL: http://localhost:3000/api

POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/profile
PUT  /auth/profile
```

### Trades
```typescript
GET    /trade/items              // Listar items
POST   /trade/items              // Crear item
GET    /trade/items/:id          // Obtener item
PUT    /trade/items/:id          // Actualizar item
DELETE /trade/items/:id          // Eliminar item

GET    /trade/trades             // Listar trades del usuario
POST   /trade/trades             // Crear trade
GET    /trade/trades/:id         // Obtener trade
PUT    /trade/trades/:id/accept  // Aceptar trade
PUT    /trade/trades/:id/cancel  // Cancelar trade
```

### Pagos (Stripe Connect)
```typescript
POST /payment/connect/onboard    // Iniciar onboarding Stripe
POST /payment/escrow             // Crear escrow
POST /payment/escrow/:id/release // Liberar escrow
POST /payment/escrow/:id/refund  // Reembolsar escrow
GET  /payment/account            // Estado de cuenta Stripe
```

### Envíos (Shippo)
```typescript
POST /shipping/labels            // Crear etiqueta de envío
GET  /shipping/tracking/:number  // Obtener tracking
POST /shipping/webhook           // Webhook de Shippo
```

### Notificaciones
```typescript
GET  /notifications              // Listar notificaciones
PUT  /notifications/read         // Marcar como leídas
POST /notifications/send         // Enviar notificación
```

### Chat
```typescript
GET  /chat/conversations         // Listar conversaciones
POST /chat/messages              // Enviar mensaje
GET  /chat/conversations/:id     // Obtener conversación
```

---

## 🔐 AUTENTICACIÓN

### Configuración de Headers
```typescript
// Todas las requests autenticadas necesitan:
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

### Manejo de Cookies
```typescript
// El backend usa cookies HTTP-only para JWT
// Configurar axios para enviar cookies:
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true
});
```

### Flujo de Login
```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    profile?: {
      bio?: string;
      location?: string;
      avatar?: string;
    };
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};
```

---

## 💳 INTEGRACIÓN STRIPE CONNECT

### 1. Configuración Inicial
```typescript
// Instalar dependencias
npm install @stripe/stripe-js @stripe/react-stripe-js

// Configurar Stripe
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
```

### 2. Onboarding de Vendedor
```typescript
const connectStripeAccount = async () => {
  const response = await apiClient.post('/payment/connect/onboard');
  // Redirigir a Stripe
  window.location.href = response.data.url;
};

// Callback después del onboarding
const handleStripeCallback = async (code: string) => {
  await apiClient.post('/payment/connect/callback', { code });
  // Usuario ahora puede recibir pagos
};
```

### 3. Crear Escrow
```typescript
interface CreateEscrowRequest {
  tradeId: number;
  amount: number;
  sellerId: number;
}

const createEscrow = async (data: CreateEscrowRequest) => {
  const response = await apiClient.post('/payment/escrow', data);
  return response.data; // { clientSecret: string }
};
```

### 4. Procesar Pago
```typescript
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = ({ tradeId, amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      }
    );

    if (!error) {
      onSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit">Pay ${amount}</button>
    </form>
  );
};
```

---

## 📦 INTEGRACIÓN SHIPPO

### 1. Crear Etiqueta de Envío
```typescript
interface CreateLabelRequest {
  tradeId: number;
  toAddress: {
    name: string;
    street1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  fromAddress: {
    name: string;
    street1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

const createShippingLabel = async (data: CreateLabelRequest) => {
  const response = await apiClient.post('/shipping/labels', data);
  return response.data; // { trackingNumber, labelUrl, cost }
};
```

### 2. Tracking de Envíos
```typescript
const getTrackingStatus = async (trackingNumber: string) => {
  const response = await apiClient.get(`/shipping/tracking/${trackingNumber}`);
  return response.data;
};
```

### 3. Componente de Envío
```typescript
const ShippingComponent = ({ tradeId }) => {
  const [addresses, setAddresses] = useState(null);
  const [label, setLabel] = useState(null);

  const createLabel = async () => {
    const labelData = await createShippingLabel({
      tradeId,
      toAddress: addresses.buyer,
      fromAddress: addresses.seller
    });
    
    setLabel(labelData);
    // Abrir etiqueta en nueva ventana
    window.open(labelData.labelUrl, '_blank');
  };

  return (
    <div>
      {!label ? (
        <button onClick={createLabel}>Create Shipping Label</button>
      ) : (
        <div>
          <p>Tracking: {label.trackingNumber}</p>
          <a href={label.labelUrl} target="_blank">Print Label</a>
        </div>
      )}
    </div>
  );
};
```

---

## 💬 INTEGRACIÓN CHAT

### 1. WebSocket Connection
```typescript
import io from 'socket.io-client';

const useChat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io('ws://localhost:3000', {
      withCredentials: true
    });

    newSocket.on('newMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const sendMessage = (conversationId: number, content: string) => {
    socket.emit('sendMessage', {
      userId: currentUser.id,
      message: { conversationId, content }
    });
  };

  return { socket, messages, sendMessage };
};
```

### 2. Componente de Chat
```typescript
const ChatComponent = ({ conversationId }) => {
  const { messages, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessage(conversationId, newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="chat">
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className="message">
            <p>{msg.content}</p>
            <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="input">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};
```

---

## 🔔 INTEGRACIÓN NOTIFICACIONES

### 1. Obtener Notificaciones
```typescript
const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    const response = await apiClient.get('/notifications');
    setNotifications(response.data);
    setUnreadCount(response.data.filter(n => !n.marked_as_read).length);
  };

  const markAsRead = async (notificationId: number) => {
    await apiClient.put('/notifications/read', { notification_id: notificationId });
    fetchNotifications();
  };

  return { notifications, unreadCount, markAsRead, fetchNotifications };
};
```

### 2. Componente de Notificaciones
```typescript
const NotificationsComponent = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <div className="notifications">
      <h3>Notifications ({unreadCount})</h3>
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification ${!notification.marked_as_read ? 'unread' : ''}`}
          onClick={() => markAsRead(notification.id)}
        >
          <p>{notification.message}</p>
          <span>{new Date(notification.create_ts).toLocaleDateString()}</span>
        </div>
      ))}
    </div>
  );
};
```

---

## 🎯 TIPOS TYPESCRIPT

### 1. Tipos de Usuario
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profile?: {
    bio?: string;
    location?: string;
    avatar?: string;
    stripeAccountId?: string;
  };
}

interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}
```

### 2. Tipos de Trade
```typescript
interface TradeItem {
  id: number;
  name: string;
  description: string;
  price: number;
  images: Array<{ url: string }>;
  owner: User;
  interests: Array<{ id: number; name: string }>;
}

interface Trade {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  traderOffering: User;
  traderReceiving: User;
  itemOffered: TradeItem;
  itemRequested?: TradeItem;
  cashAmount?: number;
  createdAt: string;
  updatedAt: string;
}
```

### 3. Tipos de Pago
```typescript
interface Escrow {
  id: number;
  tradeId: number;
  amount: number;
  status: 'PENDING' | 'HELD' | 'RELEASED' | 'REFUNDED';
  stripePaymentIntentId: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4?: string;
  brand?: string;
  isDefault: boolean;
}
```

---

## 🧪 TESTING

### 1. Datos de Prueba
```typescript
// Usuarios de prueba
const testUsers = {
  seller: {
    email: 'seller@test.com',
    password: 'password123'
  },
  buyer: {
    email: 'buyer@test.com',
    password: 'password123'
  }
};

// Items de prueba
const testItems = {
  item1: {
    name: 'iPhone 13 Pro',
    description: 'Excellent condition',
    price: 800,
    interests: [1, 2] // IDs de categorías
  }
};
```

### 2. Flujo de Prueba
```typescript
const testCompleteFlow = async () => {
  // 1. Login como vendedor
  const sellerAuth = await login(testUsers.seller);
  
  // 2. Subir item
  const item = await createItem(testItems.item1);
  
  // 3. Login como comprador
  const buyerAuth = await login(testUsers.buyer);
  
  // 4. Crear trade
  const trade = await createTrade({
    itemOfferedId: item.id,
    traderReceivingId: sellerAuth.user.id
  });
  
  // 5. Aceptar trade (como vendedor)
  await acceptTrade(trade.id);
  
  // 6. Crear escrow
  const escrow = await createEscrow({
    tradeId: trade.id,
    amount: item.price,
    sellerId: sellerAuth.user.id
  });
  
  // 7. Procesar pago
  // ... (usar Stripe test cards)
  
  // 8. Crear etiqueta de envío
  const label = await createShippingLabel({
    tradeId: trade.id,
    toAddress: buyerAddress,
    fromAddress: sellerAddress
  });
  
  // 9. Completar trade
  await completeTrade(trade.id);
};
```

---

## 🚀 CONFIGURACIÓN DE DESARROLLO

### 1. Variables de Entorno
```env
# Frontend
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_WS_URL=ws://localhost:3000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Backend (ya configurado)
STRIPE_SECRET_KEY=sk_test_...
SHIPPO_API_KEY=shippo_test_...
```

### 2. Scripts de Desarrollo
```json
{
  "scripts": {
    "dev": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

---

## 📱 COMPONENTES RECOMENDADOS

### 1. Estructura de Carpetas
```
src/
├── components/
│   ├── auth/
│   ├── trade/
│   ├── payment/
│   ├── shipping/
│   ├── chat/
│   └── notifications/
├── hooks/
│   ├── useAuth.ts
│   ├── useChat.ts
│   ├── useNotifications.ts
│   └── useTrades.ts
├── services/
│   ├── api.ts
│   ├── stripe.ts
│   └── shippo.ts
├── types/
│   └── index.ts
└── utils/
    └── constants.ts
```

### 2. Hooks Personalizados
```typescript
// useTrades.ts
export const useTrades = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrades = async () => {
    setLoading(true);
    const response = await apiClient.get('/trade/trades');
    setTrades(response.data);
    setLoading(false);
  };

  const createTrade = async (tradeData) => {
    const response = await apiClient.post('/trade/trades', tradeData);
    setTrades(prev => [...prev, response.data]);
    return response.data;
  };

  return { trades, loading, fetchTrades, createTrade };
};
```

---

## 🔧 TROUBLESHOOTING

### Problemas Comunes

1. **Error 401 Unauthorized**
   - Verificar que el token JWT esté incluido en headers
   - Verificar que `withCredentials: true` esté configurado

2. **Error de CORS**
   - Verificar que el backend tenga configurado CORS para el frontend
   - Verificar URLs en variables de entorno

3. **WebSocket no conecta**
   - Verificar que el backend tenga WebSocket habilitado
   - Verificar URL del WebSocket

4. **Stripe no funciona**
   - Verificar que las claves de Stripe estén correctas
   - Verificar que el dominio esté configurado en Stripe

---

*Guía creada para MyTradePlatform - Integración completa de frontend con backend*
