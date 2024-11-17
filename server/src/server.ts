import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import type { Request, Response} from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { authenticateToken } from './services/auth.js';
import { typeDefs, resolvers } from './schemas/index.js';


// interface Context {
//   user: JwtPayload | null;
// }

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // context: ({ req }): Context => {
  //   const authHeader = req.headers.authorization || '';
  //   const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  //   const user = token ? authenticateToken(token) : null;
  //   return { user };
  // },

});

const app = express();
const PORT = process.env.PORT || 3001;

const startApolloServer = async () => {

  await server.start();
  await db();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server as any, {
    context: authenticateToken as any
  }));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
