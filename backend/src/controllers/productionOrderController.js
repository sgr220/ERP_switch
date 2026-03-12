import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllProductionOrders = async (req, res) => {
  try {
    const { search, status } = req.query;

    const where = {
      ...(search && {
        OR: [
          { id: { contains: search, mode: 'insensitive' } },
          { product: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }),
      ...(status && { status }),
    };

    const productionOrders = await prisma.productionOrder.findMany({
      where,
      include: {
        product: true,
        responsible: true,
        order: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(productionOrders);
  } catch (error) {
    console.error('Get production orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductionOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const productionOrder = await prisma.productionOrder.findUnique({
      where: { id },
      include: {
        product: true,
        responsible: true,
        order: {
          include: {
            customer: true,
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!productionOrder) {
      return res.status(404).json({ message: 'Production order not found' });
    }

    res.json(productionOrder);
  } catch (error) {
    console.error('Get production order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createProductionOrder = async (req, res) => {
  try {
    const { orderId, productId, quantity, size, color, deadline, notes, responsibleId } = req.body;

    if (!productId || !quantity || !size || !color) {
      return res.status(400).json({ message: 'Product, quantity, size, and color required' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productionOrder = await prisma.productionOrder.create({
      data: {
        orderId: orderId || null,
        productId,
        quantity,
        size,
        color,
        status: 'PENDING',
        deadline: deadline ? new Date(deadline) : null,
        notes: notes || null,
        responsibleId: responsibleId || null,
      },
      include: {
        product: true,
        responsible: true,
        order: {
          include: {
            customer: true,
          },
        },
      },
    });

    res.status(201).json(productionOrder);
  } catch (error) {
    console.error('Create production order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProductionOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, deadline, notes, responsibleId } = req.body;

    if (status && !['PENDING', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const productionOrder = await prisma.productionOrder.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(deadline && { deadline: new Date(deadline) }),
        ...(notes !== undefined && { notes }),
        ...(responsibleId !== undefined && { responsibleId }),
      },
      include: {
        product: true,
        responsible: true,
        order: {
          include: {
            customer: true,
          },
        },
      },
    });

    res.json(productionOrder);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Production order not found' });
    }
    console.error('Update production order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProductionOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const productionOrder = await prisma.productionOrder.update({
      where: { id },
      data: { status },
      include: {
        product: true,
        responsible: true,
        order: {
          include: {
            customer: true,
          },
        },
      },
    });

    res.json(productionOrder);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Production order not found' });
    }
    console.error('Update production order status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProductionOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.productionOrder.delete({
      where: { id },
    });

    res.json({ message: 'Production order deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Production order not found' });
    }
    console.error('Delete production order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductionOrderStats = async (req, res) => {
  try {
    const total = await prisma.productionOrder.count();
    const pending = await prisma.productionOrder.count({
      where: { status: 'PENDING' },
    });
    const inProduction = await prisma.productionOrder.count({
      where: { status: 'IN_PRODUCTION' },
    });
    const completed = await prisma.productionOrder.count({
      where: { status: 'COMPLETED' },
    });

    res.json({
      total,
      pending,
      inProduction,
      completed,
    });
  } catch (error) {
    console.error('Get production order stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
