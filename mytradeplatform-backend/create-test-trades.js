require('dotenv').config({ path: './.env' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestTrades() {
  try {
    // Buscar un usuario de prueba
    const user = await prisma.user.findUnique({
      where: { email: 'testuser@example.com' },
    });

    if (!user) {
      console.error('Usuario no encontrado.');
      return;
    }

    console.log(`Usuario encontrado: ${user.username} (ID: ${user.id})`);

    // Crear un perfil si no existe
    let profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          bio: 'Test user profile',
          avatar: '/placeholder-avatar.png'
        }
      });
      console.log('Perfil creado');
    }

    // Crear otro usuario para el trade
    const otherUser = await prisma.user.upsert({
      where: { email: 'golfswapper92@example.com' },
      update: {},
      create: {
        email: 'golfswapper92@example.com',
        username: 'GolfSwapper92',
        password: '$2b$12$dummy', // Password dummy
        isEmailVerified: true,
      }
    });

    // Crear perfil para el otro usuario
    let otherProfile = await prisma.profile.findUnique({
      where: { userId: otherUser.id }
    });

    if (!otherProfile) {
      otherProfile = await prisma.profile.create({
        data: {
          userId: otherUser.id,
          bio: 'Golf trader profile',
          avatar: '/placeholder-avatar.png'
        }
      });
    }

    // Crear items de prueba
    const item1 = await prisma.item.create({
      data: {
        name: 'TaylorMade SIM2 Driver',
        description: 'Great condition TaylorMade SIM2 driver with headcover. 10.5° loft, stiff shaft.',
        price: 225.00,
        condition: 'Good',
        category: 'Drivers',
        images: '/placeholder-golf-driver.jpg',
        userId: user.id,
        isAvailable: true
      }
    });

    const item2 = await prisma.item.create({
      data: {
        name: 'Scotty Cameron Newport Putter',
        description: 'Scotty Cameron Newport putter, 34 inches. Minor wear on face.',
        price: 265.00,
        condition: 'Very Good',
        category: 'Putters',
        images: '/placeholder-golf-putter.jpg',
        userId: otherUser.id,
        isAvailable: true
      }
    });

    // Crear trade de prueba
    const trade = await prisma.trade.create({
      data: {
        title: 'Driver for Putter Swap',
        description: 'Trading my TaylorMade SIM2 Driver for a Scotty Cameron Newport Putter',
        status: 'PENDING',
        type: 'VAULT',
        traderOfferingId: user.id,
        traderReceivingId: otherUser.id,
        itemOfferedId: item1.id,
        itemRequestedId: item2.id,
        cashAmount: 40.00, // GolfSwapper92 pays $40 to balance
        escrowReference: 'escrow_test_123'
      }
    });

    console.log(`Trade creado exitosamente:`);
    console.log(`- ID: ${trade.id}`);
    console.log(`- Título: ${trade.title}`);
    console.log(`- Status: ${trade.status}`);
    console.log(`- Tipo: ${trade.type}`);
    console.log(`- Usuario ofreciendo: ${user.username}`);
    console.log(`- Usuario recibiendo: ${otherUser.username}`);

    // Crear algunos trades más con diferentes estados
    const trade2 = await prisma.trade.create({
      data: {
        title: 'Golf Club Trade',
        description: 'Another test trade',
        status: 'IN_TRANSIT',
        type: 'QUICK',
        traderOfferingId: otherUser.id,
        traderReceivingId: user.id,
        itemOfferedId: item2.id,
        itemRequestedId: item1.id,
        cashAmount: 0
      }
    });

    const trade3 = await prisma.trade.create({
      data: {
        title: 'Completed Trade',
        description: 'A completed test trade',
        status: 'COMPLETED',
        type: 'VAULT',
        traderOfferingId: user.id,
        traderReceivingId: otherUser.id,
        itemOfferedId: item1.id,
        itemRequestedId: item2.id,
        cashAmount: 0,
        escrowReference: 'escrow_completed_123'
      }
    });

    console.log(`\nTrades adicionales creados:`);
    console.log(`- Trade 2 (In Transit): ${trade2.id}`);
    console.log(`- Trade 3 (Completed): ${trade3.id}`);

  } catch (error) {
    console.error('Error al crear trades de prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestTrades();

