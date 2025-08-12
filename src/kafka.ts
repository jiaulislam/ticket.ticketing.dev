import { AbstractKafkaProducer } from "@jiaul.islam/common.ticketing.dev";
import { ProducerConstructorConfig } from "@confluentinc/kafka-javascript/types/kafkajs";

const kafkaConfig: ProducerConstructorConfig = {
    "bootstrap.servers": process.env.KAFKA_BOOTSTRAP_SERVERS!,
    "security.protocol": "sasl_ssl",
    "sasl.mechanism": process.env.KAFKA_SASL_MECHANISM!,
    "sasl.username": process.env.KAFKA_SASL_USERNAME!,
    "sasl.password": process.env.KAFKA_SASL_PASSWORD!,
    "socket.timeout.ms": 45000,
    "client.id": process.env.KAFKA_CLIENT_ID!,
}

export class TicketKafkaProducer extends AbstractKafkaProducer {
    readonly clusterName = "ticketing-cluster";

    constructor() {
        super(kafkaConfig);
    }
}
