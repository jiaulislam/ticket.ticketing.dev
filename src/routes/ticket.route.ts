import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  validateRequestMiddleware,
  requireAuthMiddleware,
  NotFoundError,
  ValidationError,
} from '@jiaul.islam/common.ticketing.dev';
import { body } from 'express-validator';

import { TicketCreatedEventProducer, TicketUpdatedEventProducer } from '../events/ticket.event';
import { TicketService } from '../service';

const ticketService = new TicketService();

const router = express.Router();

router.get('/health', (_, res: Response) => {
  res.json({ status: 'OK' });
});

router.get('/', async (req: Request, res: Response) => {
  const tickets = await ticketService.findAll();
  res.json(tickets);
});

router.post(
  '/',
  requireAuthMiddleware,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  ],
  validateRequestMiddleware,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const currentUser = req.currentUser!;
    const ticket = await ticketService.create({
      data: {
        title,
        price,
        userId: currentUser.id,
      },
    });

    const ticketCreatedProducer = new TicketCreatedEventProducer();
    await ticketCreatedProducer.publish(ticket);

    res.status(StatusCodes.CREATED).json({ message: 'ticket created successfully', data: ticket });
  },
);

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const ticket = await ticketService.findUnique({
    where: { id: Number(id) },
  });
  res.json(ticket);
});

router.put(
  '/:id',
  requireAuthMiddleware,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  ],
  validateRequestMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, price } = req.body;

    const ticket = await ticketService.findUnique({
      where: { id: Number(id) },
    });

    if (!ticket) {
      throw new NotFoundError(`Ticket with ID ${id} not found`);
    }

    if (ticket.orderId) {
      throw new ValidationError('Cannot update ticket with active order');
    }

    const updatedTicket = await ticketService.update({
      where: { id: Number(id) },
      data: { title, price },
    });

    const ticketUpdatedProducer = new TicketUpdatedEventProducer();
    await ticketUpdatedProducer.publish(updatedTicket);

    res.json({ message: 'ticket updated successfully', data: updatedTicket });
  },
);

export { router as ticketRouter };
