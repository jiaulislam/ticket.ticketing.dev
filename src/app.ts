import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUserMiddleware, errorHandlerMiddleware } from '@jiaul.islam/common.ticketing.dev';
import { TicketKafkaProducer, TicketKafkaConsumer } from './kafka';

// routes
import { ticketRouter } from './routes';

const app = express();
app.use(json());
app.set('trust proxy', true);
app.use(
  cookieSession({ name: 'session', signed: false, secure: process.env.NODE_ENV === 'production' }),
);
app.use(currentUserMiddleware);

// inject routes
app.use('/api/v1/tickets', ticketRouter);

app.use(errorHandlerMiddleware);

// kafka singleton instance
const ticketKafkaProducer = new TicketKafkaProducer();
const ticketKafkaConsumer = new TicketKafkaConsumer();

export { app, ticketKafkaProducer, ticketKafkaConsumer };
