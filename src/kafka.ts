import { AbstractKafkaProducer } from "@jiaul.islam/common.ticketing.dev";
import { KafkaConfig } from "kafkajs";


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
