import { BaseConsumer, ProducerMessage, Subject } from "@jiaul.islam/common.ticketing.dev";
import { ConsumerGlobalAndTopicConfig } from "@confluentinc/kafka-javascript/types/kafkajs";

interface TicketCreatedEvent {
    id: string;
    title: string;
    price: number;
}

class TicketCreatedConsumer extends BaseConsumer<TicketCreatedEvent> {
    constructor(config: ConsumerGlobalAndTopicConfig, topic: string) {
        super(config, topic);
    }

    handleMessage(message: ProducerMessage<TicketCreatedEvent>): void {
        const { subject, data } = message;
        if (subject == Subject.TICKET_CREATED) {
            console.log(`Received event: ${subject}`);
            console.log(`Ticket ID: ${data.id}, Title: ${data.title}, Price: ${data.price}`);
            // Here you could add logic to process the ticket, e.g., save to DB
        }
    }
}