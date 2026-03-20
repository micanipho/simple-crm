import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// Helper for email validation
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// Helper for UUID validation (basic check, Prisma handles actual existence)
const isValidUUID = (uuid: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || !isValidUUID(id as string)) {
    return res.status(400).json({ message: 'Invalid customer ID format.' });
  }

  if (req.method === 'GET') {
    // GET /api/customers/[id]
    try {
      const customer = await prisma.customer.findUnique({
        where: { id: id as string },
      });

      if (!customer) {
        return res.status(404).json({ message: 'Customer not found.' });
      }
      res.status(200).json(customer);
    } catch (error) {
      console.error('Error fetching customer:', error);
      res.status(500).json({ message: 'Failed to fetch customer.' });
    }
  } else if (req.method === 'PUT') {
    // PUT /api/customers/[id]
    const { firstName, lastName, email, phone, address } = req.body;

    // Server-side validation for fields if they are provided
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }
    // Ensure at least one field is provided for update
    if (!firstName && !lastName && !email && !phone && !address) {
      return res.status(400).json({ message: 'At least one field must be provided for update.' });
    }

    try {
      const updatedCustomer = await prisma.customer.update({
        where: { id: id as string },
        data: {
          firstName,
          lastName,
          email,
          phone,
          address,
        },
      });
      res.status(200).json(updatedCustomer);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Customer not found.' });
      }
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return res.status(400).json({ message: 'A customer with this email already exists.' });
      }
      console.error('Error updating customer:', error);
      res.status(500).json({ message: 'Failed to update customer.' });
    }
  } else if (req.method === 'DELETE') {
    // DELETE /api/customers/[id]
    try {
      await prisma.customer.delete({
        where: { id: id as string },
      });
      res.status(204).end(); // No Content
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Customer not found.' });
      }
      console.error('Error deleting customer:', error);
      res.status(500).json({ message: 'Failed to delete customer.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}