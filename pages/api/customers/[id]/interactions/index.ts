import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

// Helper for UUID validation
const isValidUUID = (uuid: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: customerId } = req.query;

  if (!customerId || !isValidUUID(customerId as string)) {
    return res.status(400).json({ message: 'Invalid customer ID format.' });
  }

  if (req.method === 'GET') {
    // GET /api/customers/[id]/interactions
    try {
      const interactions = await prisma.interaction.findMany({
        where: { customerId: customerId as string },
        orderBy: {
          interactionDate: 'desc',
        },
      });
      res.status(200).json(interactions);
    } catch (error) {
      console.error('Error fetching interactions:', error);
      res.status(500).json({ message: 'Failed to fetch interactions.' });
    }
  } else if (req.method === 'POST') {
    // POST /api/customers/[id]/interactions
    const { type, notes, interactionDate } = req.body;

    // Server-side validation
    if (!notes || notes.trim() === '') {
      return res.status(400).json({ message: 'Interaction notes are required.' });
    }
    // Check if customer exists
    const customerExists = await prisma.customer.findUnique({
      where: { id: customerId as string },
      select: { id: true }
    });
    if (!customerExists) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    try {
      const newInteraction = await prisma.interaction.create({
        data: {
          customerId: customerId as string,
          type,
          notes,
          interactionDate: interactionDate ? new Date(interactionDate) : undefined,
        },
      });
      res.status(201).json(newInteraction);
    } catch (error) {
      console.error('Error creating interaction:', error);
      res.status(500).json({ message: 'Failed to create interaction.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}