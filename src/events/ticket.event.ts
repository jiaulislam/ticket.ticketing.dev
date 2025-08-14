import {
  AbstractKafkaEventProducer,
  Subject,
  TicketCreatedUpdatedEvent,
} from '@jiaul.islam/common.ticketing.dev';

import { ticketKafkaProducer } from '../app';
export class TicketCreatedEventProducer extends AbstractKafkaEventProducer<TicketCreatedUpdatedEvent> {
  readonly topic: Subject.TICKET_CREATED = Subject.TICKET_CREATED;

  constructor() {
    super(ticketKafkaProducer);
  }
}

export class TicketUpdatedEventProducer extends AbstractKafkaEventProducer<TicketCreatedUpdatedEvent> {
  readonly topic: Subject.TICKET_UPDATED = Subject.TICKET_UPDATED;

  constructor() {
    super(ticketKafkaProducer);
  }
}
