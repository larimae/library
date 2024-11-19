import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import type { Request, Response} from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { authenticateToken } from './services/auth.js';
import { typeDefs, resolvers } from './schemas/index.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const server = new ApolloServer({
  typeDefs,
  resolvers,
});



const startApolloServer = async () => {

  await server.start();
  await db();

  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server as any, {
    context: authenticateToken as any
  }));

  if (process.env.NODE_ENV === 'production') {
    console.log(__dirname, "static");
    console.log(path.join(__dirname, '../client/dist'));
    app.use(express.static( '../client/dist')); //issue line serveing index not serving assets not accessing js correclty

    app.get('*', (_req: Request, res: Response) => {
      console.log(__dirname, "get");
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
