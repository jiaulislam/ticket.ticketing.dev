import { BaseModelService } from "@jiaul.islam/common.ticketing.dev";

import { PrismaClient, Prisma, Ticket } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";


const prisma = new PrismaClient();


export class TicketService extends BaseModelService<
    Prisma.TicketDelegate<DefaultArgs>,
    Ticket,
    Prisma.TicketFindUniqueArgs<DefaultArgs>,
    Prisma.TicketFindManyArgs<DefaultArgs>,
    Prisma.TicketCreateArgs<DefaultArgs>,
    Prisma.TicketUpdateArgs<DefaultArgs>,
    Prisma.TicketDeleteArgs<DefaultArgs>,
    Prisma.TicketCountArgs<DefaultArgs>,
    Prisma.TicketUpsertArgs<DefaultArgs>
> {
    protected getModel() {
        return prisma.ticket;
    }

    /**
     * Updates a ticket and increments its version for concurrency control.
     *
     * This method first fetches the current version of the ticket from the database.
     * It then increments the version (current version + 1), or sets it to 1 if the ticket is new.
     * The incremented version is used to prevent race conditions and ensure optimistic concurrency control,
     * so that updates do not overwrite each other unintentionally in distributed systems.
     *
     * @param args - Prisma update arguments for the ticket
     * @param delegate - Optional Prisma delegate
     * @returns The updated Ticket object
     */
    public async update(args: Prisma.TicketUpdateArgs<DefaultArgs>, delegate?: Prisma.TicketDelegate<DefaultArgs, {}> | undefined): Promise<Ticket> {
        const existingTicketVersion = await this.getModel().findUnique({
            where: { id: args.where.id }
        }).then(ticket => ticket?.version);
        // Increment version for optimistic concurrency control
        args.data.version = existingTicketVersion ? existingTicketVersion + 1 : 1;
        const updatedTicket = await super.update(args, delegate);
        return updatedTicket;
    }
}