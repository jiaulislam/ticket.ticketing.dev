import { BaseProducer, Subject } from "@jiaul.islam/common.ticketing.dev";
import { Ticket } from "@prisma/client";

export class TicketCreatedProducer extends BaseProducer<Ticket> {
    readonly topic: Subject.TICKET_CREATED = Subject.TICKET_CREATED;

    constructor() {
        super();
    }
}
