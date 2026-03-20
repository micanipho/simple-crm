```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { isValidEmail, isUUID, isNonEmptyString } from '../../../utils/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!isUUID(id as string)) {
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
      return res.status(200).json(customer);
    } catch (error) {
      console.error(`Failed to fetch customer ${id}:`, error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT') {
    // PUT /api/customers/[id]
    try {
      const { firstName, lastName, email, phone, address } = req.body;

      const updateData: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string | null;
        address?: string | null;
      } = {};

      if (firstName !== undefined) {
        if (!isNonEmptyString(firstName)) return res.status(400).json({ message: 'First name cannot be empty.' });
        updateData.firstName = firstName;
      }
      if (lastName !== undefined) {
        if (!isNonEmptyString(lastName)) return res.status(400).json({ message: 'Last name cannot be empty.' });
        updateData.lastName = lastName;
      }
      if (email !== undefined) {
        if (!isNonEmptyString(email)) return res.status(400).json({ message: 'Email cannot be empty.' });
        if (!isValidEmail(email)) return res.status(400).json({ message: 'Invalid email format.' });
        updateData.email = email;
      }
      if (phone !== undefined) {
        updateData.phone = phone === '' ? null : phone;
      }
      if (address !== undefined) {
        updateData.address = address === '' ? null : address;
      }

      // If no data is provided for update
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'No valid fields provided for update.' });
      }

      const updatedCustomer = await prisma.customer.update({
        where: { id: id as string },
        data: updateData,
      });

      return res.status(200).json(updatedCustomer);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Customer not found.' });
      }
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return res.status(400).json({ message: 'A customer with this email already exists.' });
      }
      console.error(`Failed to update customer ${id}:`, error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    // DELETE /api/customers/[id]
    try {
      await prisma.customer.delete({
        where: { id: id as string },
      });
      return res.status(204).end(); // No content for successful deletion
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Customer not found.' });
      }
      console.error(`Failed to delete customer ${id}:`, error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```