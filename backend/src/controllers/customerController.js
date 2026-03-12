import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllCustomers = async (req, res) => {
  try {
    const { search } = req.query;

    const where = {
      active: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { document: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const customers = await prisma.customer.findMany({
      where,
      include: {
        orders: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(customers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { name, document, email, phone, paymentCondition, address } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Customer name required' });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        document: document || null,
        email: email || null,
        phone: phone || null,
        paymentCondition: paymentCondition || null,
        address: address || null,
        active: true,
      },
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, document, email, phone, paymentCondition, address, active } = req.body;

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(document !== undefined && { document }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(paymentCondition !== undefined && { paymentCondition }),
        ...(address !== undefined && { address }),
        ...(active !== undefined && { active }),
      },
    });

    res.json(customer);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    console.error('Update customer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.customer.update({
      where: { id },
      data: { active: false },
    });

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    console.error('Delete customer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
