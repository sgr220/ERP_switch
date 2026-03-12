import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.stockMovement.deleteMany();
  await prisma.stockItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.productionOrder.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcryptjs.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@erp.com',
      password: hashedPassword,
      role: 'ADMIN',
      active: true,
    },
  });

  const operator = await prisma.user.create({
    data: {
      name: 'Operador',
      email: 'operator@erp.com',
      password: hashedPassword,
      role: 'OPERATOR',
      active: true,
    },
  });

  const seller = await prisma.user.create({
    data: {
      name: 'Vendedor',
      email: 'seller@erp.com',
      password: hashedPassword,
      role: 'SELLER',
      active: true,
    },
  });

  // Create products
  const product1 = await prisma.product.create({
    data: {
      name: 'Camiseta Básica',
      type: 'CAMISETA',
      reference: 'BASIC-001',
      sizes: JSON.stringify(['P', 'M', 'G', 'GG', 'XG']),
      colors: JSON.stringify(['Branco', 'Preto', 'Azul', 'Vermelho']),
      salePrice: 29.90,
      active: true,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Polo Premium',
      type: 'POLO',
      reference: 'POLO-001',
      sizes: JSON.stringify(['P', 'M', 'G', 'GG']),
      colors: JSON.stringify(['Branco', 'Cinza', 'Preto', 'Verde']),
      salePrice: 49.90,
      active: true,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Regata Esportiva',
      type: 'REGATA',
      reference: 'REGATA-001',
      sizes: JSON.stringify(['P', 'M', 'G', 'GG']),
      colors: JSON.stringify(['Branco', 'Preto', 'Amarelo']),
      salePrice: 24.90,
      active: true,
    },
  });

  // Create customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'João da Silva',
      document: '12345678900',
      email: 'joao@email.com',
      phone: '11999999999',
      paymentCondition: '30 dias',
      address: 'Rua A, 123, São Paulo, SP',
      active: true,
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Maria Oliveira LTDA',
      document: '12345678000195',
      email: 'maria@empresa.com',
      phone: '1133333333',
      paymentCondition: '60 dias',
      address: 'Av B, 456, Rio de Janeiro, RJ',
      active: true,
    },
  });

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      status: 'PENDING',
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notes: 'Entregar na loja física',
      total: 119.60,
      items: {
        create: [
          {
            productId: product1.id,
            size: 'M',
            color: 'Branco',
            quantity: 2,
            unitPrice: 29.90,
          },
          {
            productId: product2.id,
            size: 'G',
            color: 'Preto',
            quantity: 1,
            unitPrice: 49.90,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customerId: customer2.id,
      status: 'CONFIRMED',
      deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      notes: 'Pedido em lote - uniforme empresa',
      total: 299.40,
      items: {
        create: [
          {
            productId: product1.id,
            size: 'G',
            color: 'Azul',
            quantity: 5,
            unitPrice: 29.90,
          },
          {
            productId: product3.id,
            size: 'M',
            color: 'Branco',
            quantity: 4,
            unitPrice: 24.90,
          },
        ],
      },
    },
  });

  // Create production orders
  await prisma.productionOrder.create({
    data: {
      orderId: order1.id,
      productId: product1.id,
      quantity: 2,
      size: 'M',
      color: 'Branco',
      status: 'PENDING',
      responsibleId: operator.id,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      notes: 'Estampa frente',
    },
  });

  await prisma.productionOrder.create({
    data: {
      orderId: order2.id,
      productId: product1.id,
      quantity: 5,
      size: 'G',
      color: 'Azul',
      status: 'IN_PRODUCTION',
      responsibleId: operator.id,
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      notes: 'Uniforme - iniciar produção',
    },
  });

  // Create stock items
  const stock1 = await prisma.stockItem.create({
    data: {
      name: 'Tecido Branco 100% Algodão',
      type: 'MATERIA_PRIMA',
      unit: 'metros',
      quantity: 150,
      minQuantity: 50,
      active: true,
    },
  });

  const stock2 = await prisma.stockItem.create({
    data: {
      name: 'Linha Preta Premium',
      type: 'MATERIA_PRIMA',
      unit: 'unidades',
      quantity: 25,
      minQuantity: 10,
      active: true,
    },
  });

  const stock3 = await prisma.stockItem.create({
    data: {
      name: 'Botões Plásticos',
      type: 'MATERIA_PRIMA',
      unit: 'unidades',
      quantity: 500,
      minQuantity: 200,
      active: true,
    },
  });

  const stock4 = await prisma.stockItem.create({
    data: {
      name: 'Camiseta Básica - Produto Acabado',
      type: 'PRODUTO_ACABADO',
      unit: 'unidades',
      quantity: 45,
      minQuantity: 20,
      active: true,
    },
  });

  // Create stock movements
  await prisma.stockMovement.create({
    data: {
      stockItemId: stock1.id,
      type: 'IN',
      quantity: 100,
      reason: 'Compra fornecedor',
    },
  });

  await prisma.stockMovement.create({
    data: {
      stockItemId: stock4.id,
      type: 'OUT',
      quantity: 10,
      reason: 'Entrega pedido #001',
    },
  });

  console.log('Database seeded successfully!');
  console.log('Default credentials:');
  console.log('Email: admin@erp.com');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
