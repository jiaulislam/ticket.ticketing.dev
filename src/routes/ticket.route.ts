import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { validateRequestMiddleware, requireAuthMiddleware } from "@jiaul.islam/common.ticketing.dev";
import { body } from "express-validator";

import { PrismaClient } from "@prisma/client";

const { Kafka } = require('@confluentinc/kafka-javascript').KafkaJS;

import { ConsumerGlobalAndTopicConfig, EachMessagePayload } from "@confluentinc/kafka-javascript/types/kafkajs";

const prisma = new PrismaClient();

const kafka = new Kafka({
    "bootstrap.servers": process.env.KAFKA_BOOTSTRAP_SERVERS!,
    "security.protocol": process.env.KAFKA_SASL_PROTOCOL!,
    "sasl.mechanism": process.env.KAFKA_SASL_MECHANISM!,
    "sasl.username": process.env.KAFKA_SASL_USERNAME!,
    "sasl.password": process.env.KAFKA_SASL_PASSWORD!,
    "socket.timeout.ms": 45000,
    "client.id": process.env.KAFKA_CLIENT_ID!,

});

async function produce(topic: string, value: any) {

    // create a new producer instance
    const producer = kafka.producer();

    // connect the producer to the broker
    await producer.connect();

    // send a single message
    const produceRecord = await producer.send({
        topic,
        messages: [{ value }],
    });
    console.log(
        `\n\n Produced message to topic ${topic}: value = ${value}, ${JSON.stringify(
            produceRecord,
            null,
            2
        )} \n\n`
    );

    // disconnect the producer
    await producer.disconnect();
}


async function consume(topic: string, config: ConsumerGlobalAndTopicConfig) {
    // setup graceful shutdown
    const disconnect = () => {
        consumer.commitOffsets().finally(() => {
            consumer.disconnect();
        });
    };
    process.on("SIGTERM", disconnect);
    process.on("SIGINT", disconnect);

    // set the consumer's group ID, offset and initialize it
    config["group.id"] = "nodejs-group-1";
    config["auto.offset.reset"] = "earliest";
    const consumer = new Kafka().consumer(config);

    // connect the consumer to the broker
    await consumer.connect();

    // subscribe to the topic
    await consumer.subscribe({ topics: [topic] });

    // consume messages from the topic
    consumer.run({
        eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
            console.log(
                `Consumed message from topic ${topic}, partition ${partition}: key = ${message.key?.toString()}, value = ${message.value?.toString()}`
            );
        },
    });
}

const router = express.Router();

router.get("/health", (req: Request, res: Response) => {
    res.json({ status: "OK" });
});


router.get("/", async (req: Request, res: Response) => {
    const tickets = await prisma.ticket.findMany();
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

    await produce("ticketing", JSON.stringify(ticket));

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

    res.json({ message: "ticket updated", ticket });
});


export { router as ticketRouter };