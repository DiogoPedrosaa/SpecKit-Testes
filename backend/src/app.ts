import Fastify from 'fastify';
import { pathToFileURL } from 'node:url';
import cors from '@fastify/cors';
import { mongoSetup } from './main/database/mongoSetup.js';
import { makeAuthController } from './main/factories/authFactory.js';
import { makeCharacterController } from './main/factories/characterFactory.js';
import { makeAuctionController } from './main/factories/auctionFactory.js';
import { errorHandler } from './shared/errorHandler.js';

const app = Fastify({
  logger: true,
});

app.register(cors, {
  origin: '*', // For development
});

app.setErrorHandler(errorHandler);

app.get('/health', async () => {
  return { status: 'ok' };
});

app.register(makeAuthController());
app.register(makeCharacterController());
app.register(makeAuctionController());

export async function start() {
  try {
    await mongoSetup.connect();
    const port = Number(process.env.PORT) || 3333;
    await app.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  start();
}

export default app;
