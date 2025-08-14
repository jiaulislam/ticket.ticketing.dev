import { Subject, OrderCreatedUpdatedEvent, OrderStatusEnum, NotFoundError } from "@jiaul.islam/common.ticketing.dev";
import { TicketService } from "./ticket.service";
import { TicketUpdatedEventProducer } from "../events/ticket.event";


const ticketService = new TicketService();


/**
 * Handler for the ORDER_CREATED  event.
 * Update the ticket in the database using the provided data.
 * orderId will be updaeted to keep track which tickets are in use
 * @param data - The ticket data containing id, orderId.
 */
const handleOrderCreated = async (createdOrder: OrderCreatedUpdatedEvent) => {
    const { id: orderId, ticketId } = createdOrder;
    const ticket = await ticketService.findUnique({
        where: { id: ticketId }
    });
    if (!ticket) {
        console.error(`Ticket with ID ${ticketId} not found`);
        return;
    }
    const updatedTicket = await ticketService.update({
        where: { id: ticket.id },
        data: {
            orderId: orderId,
            version: ticket.version + 1
        }
    });

    const ticketUpdateEventProducer = new TicketUpdatedEventProducer()
    await ticketUpdateEventProducer.publish(updatedTicket)
}

const handleOrderUpdated = async (updatedOrder: OrderCreatedUpdatedEvent) => {
    const { status: orderStatus, ticketId } = updatedOrder;
    const ticket = await ticketService.findUnique({
        where: { id: ticketId }
    });
    if (!ticket) {
        throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
    }
    if (orderStatus === OrderStatusEnum.CANCELLED) {
        const updatedTicket = await ticketService.update({
            where: { id: ticket.id },
            data: {
                orderId: null,
                version: ticket.version + 1
            }
        });
        const ticketUpdateEventProducer = new TicketUpdatedEventProducer()
        await ticketUpdateEventProducer.publish(updatedTicket)
    }
}

type HandlerFn = (data: any) => Promise<void>;
// Map each Subject to its handler function
type TopicHandlers = {
    [key in Subject]: HandlerFn;
};
const topicHandlers: TopicHandlers = {} as TopicHandlers;

topicHandlers[Subject.ORDER_CREATED] = handleOrderCreated
topicHandlers[Subject.ORDER_UPDATED] = handleOrderUpdated;

export { topicHandlers }