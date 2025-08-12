import { AbstractEventProducer, Subject } from "@jiaul.islam/common.ticketing.dev";
import { Ticket } from "@prisma/client";

import { ticketKafkaProducer } from "../app";
export class TicketCreatedProducer extends AbstractEventProducer<Ticket> {
    readonly topic: Subject.TICKET_CREATED = Subject.TICKET_CREATED;

    constructor() {
        super(ticketKafkaProducer.getProducer());
    }
}


export class TicketUpdatedProducer extends AbstractEventProducer<Ticket> {
    readonly topic: Subject.TICKET_UPDATED = Subject.TICKET_UPDATED;

    constructor() {
        super(ticketKafkaProducer.getProducer());
    }
}