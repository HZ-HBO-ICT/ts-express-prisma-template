import Express , { NextFunction, Request, Response } from 'express';
// import { PrismaClient } from '../../node_modules/.prisma/client.ts';
// import { PrismaClient } from '../../node_modules/.prisma/client/default.js';
import { PrismaClient } from '@prisma/client';
import { Client} from '../../prisma/types.ts';

const prisma: PrismaClient = new PrismaClient();
const clientsController = Express.Router();

/**
 * Interface for the response object
 */
interface ClientResponse {
  meta: {
    count: number
    title: string
    url: string
  },
  data: Client[]
}

/**
 * Route handling getting all owners
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
clientsController.get('/', async (req: Request, res: Response) => {
  const clients: Client[] = await prisma.client.findMany();
  const clientReponse: ClientResponse = {
    meta: {
      count: clients.length,
      title: 'All clients',
      url: req.url
    },
    data: clients
  };
  res.status(200).send(clientReponse);
})

/**
 * Route handling getting owner by id request
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
clientsController.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id: number = parseInt(req.params.id);

  try {
    const client: Client = await prisma.client.findUnique({
      where: {
        id: id
      }
    });
    console.log('client:', client);
    if (!client) {
      throw new Error('Client not found', { cause: 404 });
    }
    res.json({ success: true, client });
  } catch (err) {
    next(err); // forwards to error handler
  }
})

export default clientsController;
