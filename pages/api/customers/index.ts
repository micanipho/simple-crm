import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// Helper for email validation
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // GET /api/customers?search=<query>
    const { search } = req.query;
    try {
      const customers = await prisma.customer.findMany({
        where: search
          ? {
              OR: [
                { firstName: { contains: search as string, mode: 'insensitive' } },
                { lastName: { contains: search as string, mode: 'insensitive' } },
                { email: { contains: search as string, mode: 'insensitive' } },
                { phone: { contains: search as string, mode: 'insensitive' } },
              ],
            }
          : {},
        orderBy: {
          lastName: 'asc',
        },
      });
      res.status(200).json(customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ message: 'Failed to fetch customers.' });
    }
  } else if (req.method === 'POST') {
    // POST /api/customers
    const { firstName, lastName, email, phone, address } = req.body;

    // Server-side validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'First name, last name, and email are required.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    try {
      const newCustomer = await prisma.customer.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          address,
        },
      });
      res.status(201).json(newCustomer);
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return res.status(400).json({ message: 'A customer with this email already exists.' });
      }
      console.error('Error creating customer:', error);
      res.status(500).json({ message: 'Failed to create customer.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}