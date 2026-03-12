import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllStockItems = async (req, res) => {
  try {
    const { search, type } = req.query;

    const where = {
      active: true,
      ...(search && {
        name: { contains: search, mode: 'insensitive' },
      }),
      ...(type && { type }),
    };

    const items = await prisma.stockItem.findMany({
      where,
      include: {
        movements: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(items);
  } catch (error) {
    console.error('Get stock items error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStockItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.stockItem.findUnique({
      where: { id },
      include: {
        movements: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!item) {
      return res.status(404).json({ message: 'Stock item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get stock item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createStockItem = async (req, res) => {
  try {
    const { name, type, unit, quantity, minQuantity } = req.body;

    if (!name || !type || !unit) {
      return res.status(400).json({ message: 'Name, type, and unit required' });
    }

    const item = await prisma.stockItem.create({
      data: {
        name,
        type,
        unit,
        quantity: quantity || 0,
        minQuantity: minQuantity || 0,
        active: true,
      },
      include: {
        movements: true,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Create stock item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateStockItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, unit, quantity, minQuantity, active } = req.body;

    const item = await prisma.stockItem.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(unit && { unit }),
        ...(quantity !== undefined && { quantity }),
        ...(minQuantity !== undefined && { minQuantity }),
        ...(active !== undefined && { active }),
      },
      include: {
        movements: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    res.json(item);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Stock item not found' });
    }
    console.error('Update stock item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteStockItem = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.stockItem.update({
      where: { id },
      data: { active: false },
    });

    res.json({ message: 'Stock item deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Stock item not found' });
    }
    console.error('Delete stock item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addStockMovement = async (req, res) => {
  try {
    const { stockItemId, type, quantity, reason } = req.body;

    if (!stockItemId || !type || !quantity) {
      return res.status(400).json({ message: 'Stock item, type, and quantity required' });
    }

    if (!['IN', 'OUT'].includes(type)) {
      return res.status(400).json({ message: 'Type must be IN or OUT' });
    }

    const item = await prisma.stockItem.findUnique({
      where: { id: stockItemId },
    });

    if (!item) {
      return res.status(404).json({ message: 'Stock item not found' });
    }

    const newQuantity = type === 'IN' ? item.quantity + quantity : item.quantity - quantity;

    if (newQuantity < 0) {
      return res.status(400).json({ message: 'Insufficient stock for this operation' });
    }

    const movement = await prisma.stockMovement.create({
      data: {
        stockItemId,
        type,
        quantity,
        reason: reason || null,
      },
    });

    await prisma.stockItem.update({
      where: { id: stockItemId },
      data: { quantity: newQuantity },
    });

    res.status(201).json({
      movement,
      newQuantity,
    });
  } catch (error) {
    console.error('Add stock movement error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStockMovements = async (req, res) => {
  try {
    const { stockItemId } = req.query;

    const movements = await prisma.stockMovement.findMany({
      where: {
        ...(stockItemId && { stockItemId }),
      },
      include: {
        stockItem: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(movements);
  } catch (error) {
    console.error('Get stock movements error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLowStockAlerts = async (req, res) => {
  try {
    const items = await prisma.stockItem.findMany({
      where: {
        active: true,
      },
    });

    const alerts = items
      .filter((item) => item.quantity <= item.minQuantity)
      .map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        current: item.quantity,
        minimum: item.minQuantity,
        unit: item.unit,
      }));

    res.json(alerts);
  } catch (error) {
    console.error('Get low stock alerts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
