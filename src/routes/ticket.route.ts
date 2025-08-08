import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { validateRequestMiddleware, requireAuthMiddleware } from "@jiaul.islam/common.ticketing.dev";
import { body } from "express-validator";

const router = express.Router();

router.get("/health", (req: Request, res: Response) => {
    res.json({ status: "OK" });
});


router.get("/", (req: Request, res: Response) => {
    res.json({ message: "ticket list view working" });
});


router.post("/", requireAuthMiddleware, [
    body("title").notEmpty().withMessage("Title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
], validateRequestMiddleware, (req: Request, res: Response) => {
    res.status(StatusCodes.CREATED).json({ message: "ticket created" });
});


router.get("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    res.json({ message: `ticket detail view working for ticket ${id}` });
});

router.put("/:id", requireAuthMiddleware, [
    body("title").notEmpty().withMessage("Title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
], validateRequestMiddleware, (req: Request, res: Response) => {
    const { id } = req.params;
    res.json({ message: `ticket update view working for ticket ${id}` });
});


export { router as ticketRouter };