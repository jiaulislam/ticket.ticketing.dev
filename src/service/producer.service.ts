import { AbstractKafkaEventProducer, Subject, TicketCreatedUpdatedEvent } from "@jiaul.islam/common.ticketing.dev";

import { ticketKafkaProducer } from "../app";
export class TicketCreatedProducer extends AbstractKafkaEventProducer<TicketCreatedUpdatedEvent> {
    readonly topic: Subject.TICKET_CREATED = Subject.TICKET_CREATED;

    constructor() {
        super(ticketKafkaProducer);
    }
}

export class TicketUpdatedProducer extends AbstractKafkaEventProducer<TicketCreatedUpdatedEvent> {
    readonly topic: Subject.TICKET_UPDATED = Subject.TICKET_UPDATED;

    constructor() {
        super(ticketKafkaProducer);
    }
}