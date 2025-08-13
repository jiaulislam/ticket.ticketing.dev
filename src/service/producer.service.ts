import { AbstractKafkaEventProducer, Subject } from "@jiaul.islam/common.ticketing.dev";
import { Ticket } from "@prisma/client";

import { ticketKafkaProducer } from "../app";
export class TicketCreatedProducer extends AbstractKafkaEventProducer<Ticket> {
    readonly topic: Subject.TICKET_CREATED = Subject.TICKET_CREATED;

    constructor() {
        super(ticketKafkaProducer);
    }
}

export class TicketUpdatedProducer extends AbstractKafkaEventProducer<Ticket> {
    readonly topic: Subject.TICKET_UPDATED = Subject.TICKET_UPDATED;

    constructor() {
        super(ticketKafkaProducer);
    }
}