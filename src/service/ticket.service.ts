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
}