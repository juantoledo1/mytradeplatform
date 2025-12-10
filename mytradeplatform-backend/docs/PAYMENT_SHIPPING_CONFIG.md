# 🔧 Configuración de Pagos y Envíos - MyTradePlatform

## 📋 Resumen de Cambios
- **Pagos:** Cambio de sistema propio a **Stripe Connect**
- **Envíos:** Integración con **Shippo** para etiquetas y tracking
- **Escrow:** Sistema de garantía con Stripe para proteger transacciones

---

## 💳 STRIPE CONNECT - Configuración Completa

### 1. Variables de Entorno Requeridas
```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_CLIENT_ID=ca_...

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
```

### 2. Instalación de Dependencias
```bash
npm install stripe @stripe/stripe-js
```

### 3. Configuración del Servicio Stripe
```typescript
// src/payment/stripe-connect.service.ts
import Stripe from 'stripe';

@Injectable()
export class StripeConnectService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  // Crear cuenta conectada
  async createConnectedAccount(userId: number) {
    const account = await this.stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Guardar account_id en base de datos
    await this.prisma.user.update({
      where: { id: userId },
      data: { stripeAccountId: account.id }
    });

    return account;
  }

  // Generar link de onboarding
  async createOnboardingLink(accountId: string) {
    const accountLink = await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.FRONTEND_URL}/wallet/stripe/refresh`,
      return_url: `${process.env.FRONTEND_URL}/wallet/stripe/success`,
      type: 'account_onboarding',
    });

    return accountLink;
  }

  // Crear escrow (pago retenido)
  async createEscrow(tradeId: number, amount: number, sellerId: number) {
    const seller = await this.prisma.user.findUnique({
      where: { id: sellerId }
    });

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir a centavos
      currency: 'usd',
      application_fee_amount: Math.round(amount * 0.029 * 100), // 2.9% fee
      transfer_data: {
        destination: seller.stripeAccountId,
      },
      metadata: {
        tradeId: tradeId.toString(),
        type: 'escrow'
      }
    });

    return paymentIntent;
  }

  // Liberar escrow
  async releaseEscrow(paymentIntentId: string) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'requires_capture') {
      await this.stripe.paymentIntents.capture(paymentIntentId);
    }

    return paymentIntent;
  }

  // Reembolsar escrow
  async refundEscrow(paymentIntentId: string) {
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    return refund;
  }
}
```

### 4. Endpoints de Stripe Connect
```typescript
// src/payment/payment.controller.ts
@Controller('payment')
export class PaymentController {
  constructor(private stripeService: StripeConnectService) {}

  @Post('connect/onboard')
  @UseGuards(JwtAuthGuard)
  async onboardStripeAccount(@CurrentUser() user: any) {
    const account = await this.stripeService.createConnectedAccount(user.id);
    const link = await this.stripeService.createOnboardingLink(account.id);
    
    return { url: link.url };
  }

  @Post('escrow')
  @UseGuards(JwtAuthGuard)
  async createEscrow(
    @Body() body: { tradeId: number; amount: number; sellerId: number }
  ) {
    const escrow = await this.stripeService.createEscrow(
      body.tradeId,
      body.amount,
      body.sellerId
    );
    
    return { clientSecret: escrow.client_secret };
  }

  @Post('escrow/:tradeId/release')
  @UseGuards(JwtAuthGuard)
  async releaseEscrow(@Param('tradeId') tradeId: number) {
    const trade = await this.prisma.trade.findUnique({
      where: { id: tradeId },
      include: { payment: true }
    });

    await this.stripeService.releaseEscrow(trade.payment.stripePaymentIntentId);
    
    // Actualizar estado del trade
    await this.prisma.trade.update({
      where: { id: tradeId },
      data: { status: 'COMPLETED' }
    });

    return { message: 'Escrow released successfully' };
  }
}
```

---

## 📦 SHIPPO - Configuración Completa

### 1. Variables de Entorno
```env
# Shippo Configuration
SHIPPO_API_KEY=shippo_test_...
SHIPPO_WEBHOOK_SECRET=shippo_webhook_secret_...
```

### 2. Instalación de Dependencias
```bash
npm install shippo
```

### 3. Configuración del Servicio Shippo
```typescript
// src/shipping/shippo.service.ts
import * as shippo from 'shippo';

@Injectable()
export class ShippoService {
  private shippo: any;

  constructor(private configService: ConfigService) {
    this.shippo = shippo(this.configService.get('SHIPPO_API_KEY'));
  }

  // Crear etiqueta de envío
  async createShippingLabel(tradeId: number, fromAddress: any, toAddress: any) {
    const shipment = await this.shippo.shipment.create({
      address_from: fromAddress,
      address_to: toAddress,
      parcels: [{
        length: '5',
        width: '5',
        height: '5',
        distance_unit: 'in',
        weight: '1',
        mass_unit: 'lb'
      }],
      async: false
    });

    // Seleccionar la mejor tarifa
    const rate = shipment.rates[0];
    
    // Crear etiqueta
    const transaction = await this.shippo.transaction.create({
      rate: rate.object_id,
      label_file_type: 'PDF',
      async: false
    });

    // Guardar en base de datos
    await this.prisma.shippingLabel.create({
      data: {
        tradeId,
        trackingNumber: transaction.tracking_number,
        labelUrl: transaction.label_url,
        carrier: rate.provider,
        cost: parseFloat(rate.amount),
        status: 'PENDING'
      }
    });

    return {
      trackingNumber: transaction.tracking_number,
      labelUrl: transaction.label_url,
      carrier: rate.provider,
      cost: parseFloat(rate.amount)
    };
  }

  // Obtener tracking
  async getTrackingStatus(trackingNumber: string) {
    const tracking = await this.shippo.track.get_status(trackingNumber);
    return tracking;
  }

  // Webhook para actualizaciones de tracking
  async handleWebhook(payload: any, signature: string) {
    const event = this.shippo.webhook.constructEvent(payload, signature);
    
    if (event.type === 'tracking.updated') {
      await this.updateTradeStatus(event.data.tracking_number, event.data.status);
    }
  }

  private async updateTradeStatus(trackingNumber: string, status: string) {
    const label = await this.prisma.shippingLabel.findUnique({
      where: { trackingNumber }
    });

    if (label) {
      await this.prisma.shippingLabel.update({
        where: { id: label.id },
        data: { status }
      });

      // Actualizar estado del trade si es necesario
      if (status === 'DELIVERED') {
        await this.prisma.trade.update({
          where: { id: label.tradeId },
          data: { status: 'SHIPPED' }
        });
      }
    }
  }
}
```

### 4. Endpoints de Shippo
```typescript
// src/shipping/shipping.controller.ts
@Controller('shipping')
export class ShippingController {
  constructor(private shippoService: ShippoService) {}

  @Post('labels')
  @UseGuards(JwtAuthGuard)
  async createLabel(
    @Body() body: { tradeId: number; toAddress: any; fromAddress: any }
  ) {
    const label = await this.shippoService.createShippingLabel(
      body.tradeId,
      body.fromAddress,
      body.toAddress
    );
    
    return label;
  }

  @Get('tracking/:trackingNumber')
  async getTracking(@Param('trackingNumber') trackingNumber: string) {
    const status = await this.shippoService.getTrackingStatus(trackingNumber);
    return status;
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Body() payload: any,
    @Headers('shippo-signature') signature: string
  ) {
    await this.shippoService.handleWebhook(payload, signature);
    return { received: true };
  }
}
```

---

## 🔄 FLUJO COMPLETO DE TRADE

### 1. Crear Trade con Escrow
```typescript
// Cuando se acepta un trade
const acceptTrade = async (tradeId: number) => {
  // 1. Crear escrow en Stripe
  const escrow = await paymentApi.createEscrow({
    tradeId,
    amount: trade.totalValue,
    sellerId: trade.sellerId
  });

  // 2. Actualizar trade con escrow
  await tradeApi.updateTrade(tradeId, {
    status: 'ACCEPTED',
    escrowId: escrow.id
  });

  // 3. Notificar a ambos usuarios
  await notificationService.sendNotification(
    trade.buyerId,
    'TRADE_ACCEPTED',
    'Your trade has been accepted!'
  );
};
```

### 2. Procesar Envío
```typescript
// Cuando se envía el item
const shipItem = async (tradeId: number, addresses: any) => {
  // 1. Crear etiqueta de envío
  const label = await shippingApi.createLabel({
    tradeId,
    fromAddress: addresses.seller,
    toAddress: addresses.buyer
  });

  // 2. Actualizar trade
  await tradeApi.updateTrade(tradeId, {
    status: 'SHIPPED',
    trackingNumber: label.trackingNumber
  });

  // 3. Notificar tracking
  await notificationService.sendNotification(
    trade.buyerId,
    'ITEM_SHIPPED',
    `Your item has been shipped! Tracking: ${label.trackingNumber}`
  );
};
```

### 3. Completar Trade
```typescript
// Cuando se confirma la entrega
const completeTrade = async (tradeId: number) => {
  // 1. Liberar escrow
  await paymentApi.releaseEscrow(tradeId);

  // 2. Completar trade
  await tradeApi.updateTrade(tradeId, {
    status: 'COMPLETED',
    completedAt: new Date()
  });

  // 3. Calcular ratings
  await ratingService.calculateRatings(tradeId);

  // 4. Notificar finalización
  await notificationService.sendNotification(
    trade.sellerId,
    'TRADE_COMPLETED',
    'Your trade has been completed successfully!'
  );
};
```

---

## 🗄️ CAMBIOS EN BASE DE DATOS

### 1. Tabla de Pagos
```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  trade_id INTEGER REFERENCES trades(id),
  stripe_payment_intent_id VARCHAR(255),
  stripe_account_id VARCHAR(255),
  amount DECIMAL(10,2),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Tabla de Envíos
```sql
CREATE TABLE shipping_labels (
  id SERIAL PRIMARY KEY,
  trade_id INTEGER REFERENCES trades(id),
  tracking_number VARCHAR(255),
  label_url TEXT,
  carrier VARCHAR(100),
  cost DECIMAL(10,2),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Actualizar Tabla de Trades
```sql
ALTER TABLE trades ADD COLUMN escrow_id INTEGER;
ALTER TABLE trades ADD COLUMN tracking_number VARCHAR(255);
ALTER TABLE trades ADD COLUMN shipping_cost DECIMAL(10,2);
```

---

## 🧪 TESTING

### 1. Datos de Prueba Stripe
```typescript
// Usar tarjetas de prueba de Stripe
const testCards = {
  visa: '4242424242424242',
  visaDebit: '4000056655665556',
  mastercard: '5555555555554444',
  amex: '378282246310005'
};
```

### 2. Datos de Prueba Shippo
```typescript
const testAddresses = {
  from: {
    name: 'John Doe',
    street1: '1092 Indian Summer Ct',
    city: 'San Jose',
    state: 'CA',
    zip: '95122',
    country: 'US'
  },
  to: {
    name: 'Jane Smith',
    street1: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'US'
  }
};
```

---

## 📱 INTEGRACIÓN FRONTEND

### 1. Configuración Stripe
```typescript
// frontend/src/config/stripe.ts
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
```

### 2. Componente de Pago
```typescript
// frontend/src/components/PaymentForm.tsx
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = ({ tradeId, amount }) => {
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
      // Pago exitoso
      onPaymentSuccess(paymentIntent);
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

## 🚀 DEPLOYMENT

### 1. Variables de Producción
```env
# Stripe Production
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Shippo Production
SHIPPO_API_KEY=shippo_live_...

# URLs de Producción
FRONTEND_URL=https://mytradeplatform.com
BACKEND_URL=https://api.mytradeplatform.com
```

### 2. Webhooks de Producción
- **Stripe:** `https://api.mytradeplatform.com/payment/webhook`
- **Shippo:** `https://api.mytradeplatform.com/shipping/webhook`

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

- [ ] Configurar variables de entorno
- [ ] Instalar dependencias Stripe y Shippo
- [ ] Crear servicios de pago y envío
- [ ] Implementar endpoints de API
- [ ] Actualizar esquema de base de datos
- [ ] Configurar webhooks
- [ ] Crear componentes de frontend
- [ ] Implementar flujo completo de trade
- [ ] Configurar datos de prueba
- [ ] Testing end-to-end
- [ ] Deploy a producción

---

## 🔗 ENLACES ÚTILES

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Shippo API Documentation](https://goshippo.com/docs/)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Shippo Webhooks](https://goshippo.com/docs/webhooks)

---

*Documentación creada para MyTradePlatform - Sistema de intercambio con pagos seguros y envíos automatizados*
