import { AbstractKafkaConsumer, AbstractKafkaProducer, Subject } from "@jiaul.islam/common.ticketing.dev";
import { KafkaConfig } from "kafkajs";

import { topicHandlers } from "./service";

const kafkaConfig: KafkaConfig = {
    clientId: process.env.KAFKA_CLIENT_ID || 'ticket-service',
    brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS || 'localhost:9092'],
}

export class TicketKafkaProducer extends AbstractKafkaProducer {
    readonly clusterName = "ticketing-cluster";

    constructor() {
        super(kafkaConfig);
    }
}


export class TicketKafkaConsumer extends AbstractKafkaConsumer {
    readonly clusterName = "ticketing-cluster";

    constructor() {
        super(kafkaConfig, [Subject.ORDER_CREATED, Subject.ORDER_UPDATED]);
    }

    async onMessage(topic: Subject, message: any): Promise<void> {
        const handler = topicHandlers[topic]
        if (!handler) {
            console.error(`No handler found for topic ${topic}`);
            return;
        }
        await handler(message)
    }
}