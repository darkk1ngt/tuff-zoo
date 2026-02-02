import { Router, Request, Response } from 'express';
import { TicketModel } from '../database/models/Ticket';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const tickets = await TicketModel.getAll();
    res.json({ tickets });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Failed to get tickets' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ticket ID' });
      return;
    }

    const ticket = await TicketModel.getById(id);
    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    res.json({ ticket });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ error: 'Failed to get ticket' });
  }
});

export default router;
