import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// Helper for UUID validation
const isValidUUID = (uuid: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Interaction ID

  if (!id || !isValidUUID(id as string)) {
    return res.status(400).json({ message: 'Invalid interaction ID format.' });
  }

  if (req.method === 'PUT') {
    // PUT /api/interactions/[id]
    const { type, notes, interactionDate } = req.body;

    // Server-side validation for fields if they are provided
    if (notes !== undefined && notes.trim() === '') {
      return res.status(400).json({ message: 'Interaction notes cannot be empty.' });
    }
    // Ensure at least one field is provided for update
    if (type === undefined && notes === undefined && interactionDate === undefined) {
      return res.status(400).json({ message: 'At least one field must be provided for update.' });
    }

    try {
      const updatedInteraction = await prisma.interaction.update({
        where: { id: id as string },
        data: {
          type,
          notes,
          interactionDate: interactionDate ? new Date(interactionDate) : undefined,
        },
      });
      res.status(200).json(updatedInteraction);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Interaction not found.' });
      }
      console.error('Error updating interaction:', error);
      res.status(500).json({ message: 'Failed to update interaction.' });
    }
  } else if (req.method === 'DELETE') {
    // DELETE /api/interactions/[id]
    try {
      await prisma.interaction.delete({
        where: { id: id as string },
      });
      res.status(204).end(); // No Content
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Interaction not found.' });
      }
      console.error('Error deleting interaction:', error);
      res.status(500).json({ message: 'Failed to delete interaction.' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}