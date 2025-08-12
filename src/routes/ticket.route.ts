import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { validateRequestMiddleware, requireAuthMiddleware } from "@jiaul.islam/common.ticketing.dev";
import { body } from "express-validator";

import { PrismaClient } from "@prisma/client";
import { TicketCreatedProducer, TicketUpdatedProducer } from "../service";

const prisma = new PrismaClient();

const router = express.Router();

router.get("/health", (req: Request, res: Response) => {
    res.json({ status: "OK" });
});


router.get("/", requireAuthMiddleware, async (req: Request, res: Response) => {
    const currentUser = req.currentUser;
    const tickets = await prisma.ticket.findMany({
        where: { userId: currentUser!.id },
    });
    res.json(tickets);
});


router.post("/", requireAuthMiddleware, [
    body("title").notEmpty().withMessage("Title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
], validateRequestMiddleware, async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await prisma.ticket.create({
        data: {
            title,
            price,
            userId: req.currentUser!.id,
        },
    });

    const producer = new TicketCreatedProducer();
    await producer.publish(ticket);

    res.status(StatusCodes.CREATED).json({ message: "ticket created", ticket });
});


router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const ticket = await prisma.ticket.findUnique({
        where: { id: Number(id) },
    });
    res.json(ticket);
});

router.put("/:id", requireAuthMiddleware, [
    body("title").notEmpty().withMessage("Title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
], validateRequestMiddleware, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, price } = req.body;

    const ticket = await prisma.ticket.update({
        where: { id: Number(id) },
        data: { title, price },
    });

    const producer = new TicketUpdatedProducer();
    await producer.publish(ticket);
    res.json({ message: "ticket updated", ticket });
});


export { router as ticketRouter };