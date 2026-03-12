import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllOrders = async (req, res) => {
  try {
    const { search, status } = req.query;

    const where = {
      ...(search && {
        OR: [
          { customer: { name: { contains: search, mode: 'insensitive' } } },
          { id: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(status && { status }),
    };

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        productionOrders: {
          include: {
            responsible: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { customerId, deliveryDate, notes, items } = req.body;

    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Customer and items required' });
    }

    let total = 0;
    items.forEach((item) => {
      total += item.quantity * item.unitPrice;
    });

    const order = await prisma.order.create({
      data: {
        customerId,
        status: 'PENDING',
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        notes: notes || null,
        total,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, deliveryDate, notes } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(deliveryDate && { deliveryDate: new Date(deliveryDate) }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(order);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'DELIVERED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(order);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.order.delete({
      where: { id },
    });

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const total = await prisma.order.count();
    const pending = await prisma.order.count({
      where: { status: 'PENDING' },
    });
    const confirmed = await prisma.order.count({
      where: { status: 'CONFIRMED' },
    });
    const inProduction = await prisma.order.count({
      where: { status: 'IN_PRODUCTION' },
    });
    const delivered = await prisma.order.count({
      where: { status: 'DELIVERED' },
    });

    res.json({
      total,
      pending,
      confirmed,
      inProduction,
      delivered,
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
