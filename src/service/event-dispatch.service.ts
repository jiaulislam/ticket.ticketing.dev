import { Subject, OrderCreatedUpdatedEvent } from "@jiaul.islam/common.ticketing.dev";
import { TicketService } from "./ticket.service";
import { TicketUpdatedEventProducer } from "../events/ticket.event";


const ticketService = new TicketService();


/**
 * Handler for the ORDER_CREATED  event.
 * Creates a new ticket in the database using the provided data.
 * @param data - The ticket data containing id, title, and price.
 */
const handleOrderCreated = async (data: OrderCreatedUpdatedEvent) => {
    const { id, ticketId } = data;
    const existingTicket = await ticketService.findUnique({
        where: { id: ticketId }
    });
    if (!existingTicket) {
        console.error(`Ticket with ID ${ticketId} not found`);
        return;
    }
    const updatedTicket = await ticketService.update({
        where: { id: existingTicket.id },
        data: {
            orderId: id,
            version: existingTicket.version + 1
        }
    });

    const ticketUpdateEventProducer = new TicketUpdatedEventProducer()
    await ticketUpdateEventProducer.publish(updatedTicket)
}


type HandlerFn = (data: any) => Promise<void>;
// Map each Subject to its handler function
type TopicHandlers = {
    [key in Subject]: HandlerFn;
};
const topicHandlers: TopicHandlers = {} as TopicHandlers;

topicHandlers[Subject.ORDER_CREATED] = handleOrderCreated

export { topicHandlers }