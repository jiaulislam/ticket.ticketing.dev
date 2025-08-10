import { BaseEventPublisher, Subject } from "@jiaul.islam/common.ticketing.dev";
import { Ticket } from "@prisma/client";

import { kafkaService } from "../app";
export class TicketCreatedProducer extends BaseEventPublisher<Ticket> {
    readonly topic: Subject.TICKET_CREATED = Subject.TICKET_CREATED;

    constructor() {
        super(kafkaService.getProducer());
    }
}
