import express from 'express';
import path from 'node:path';
import db from './config/connection.js';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { authenticateToken } from './auth';
import { typeDefs, resolvers } from './schemas/index.js';


interface Context {
  user: JwtPayload | null;
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }): Promise<Context> => {
    const authHeader = req.headers.authorization; // Get the auth header
    const user = await authenticateToken(authHeader); // Authenticate token and get user
    return { user }; // Add user to the context
  },

});


const startApolloServer = async () => {

  await server.start();
  await db();

  const PORT = process.env.PORT || 3001;
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

// Call the async function to start the server
startApolloServer();
