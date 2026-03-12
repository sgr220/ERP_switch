import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllProducts = async (req, res) => {
  try {
    const { search } = req.query;

    const where = {
      active: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { reference: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const formattedProducts = products.map((p) => ({
      ...p,
      sizes: JSON.parse(p.sizes || '[]'),
      colors: JSON.parse(p.colors || '[]'),
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      ...product,
      sizes: JSON.parse(product.sizes || '[]'),
      colors: JSON.parse(product.colors || '[]'),
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, type, reference, sizes, colors, salePrice } = req.body;

    if (!name || !type || !reference || !sizes || !colors || salePrice === undefined) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { reference },
    });

    if (existingProduct) {
      return res.status(400).json({ message: 'Product reference already exists' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        type,
        reference,
        sizes: JSON.stringify(sizes),
        colors: JSON.stringify(colors),
        salePrice,
        active: true,
      },
    });

    res.status(201).json({
      ...product,
      sizes: JSON.parse(product.sizes),
      colors: JSON.parse(product.colors),
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, reference, sizes, colors, salePrice, active } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(reference && { reference }),
        ...(sizes && { sizes: JSON.stringify(sizes) }),
        ...(colors && { colors: JSON.stringify(colors) }),
        ...(salePrice !== undefined && { salePrice }),
        ...(active !== undefined && { active }),
      },
    });

    res.json({
      ...product,
      sizes: JSON.parse(product.sizes),
      colors: JSON.parse(product.colors),
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.update({
      where: { id },
      data: { active: false },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
