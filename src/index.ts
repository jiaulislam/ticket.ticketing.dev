import dotenv from "dotenv";

dotenv.config()

import { app, ticketKafkaProducer, ticketKafkaConsumer } from "./app";


const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL must be defined');
    }

    try {
        //producer
        await ticketKafkaProducer.connect();
        // consumer
        await ticketKafkaConsumer.connect();
        await ticketKafkaConsumer.subscribe();
        await ticketKafkaConsumer.consume();
    } catch (error) {
        process.exit(1)
    }
    app.listen(process.env.SERVER_PORT || 4001, () => {
        console.log(`Ticket Server is running on port ${process.env.SERVER_PORT || 4001}`);
    });
}

start(); // eslint-disable-line

// Graceful shutdown
const gracefulShutdown = async () => {
    try {
        await ticketKafkaProducer.disconnect();
        console.log(`Kafka producer disconnected`);
    } catch (error) {
        console.error(`Error disconnecting Kafka producer: ${error}`);
    } finally {
        process.exit(0);
    }
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
